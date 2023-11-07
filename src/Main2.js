import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs, Nav, NavItem } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import PurchasesReview from "./pageTemplates/PurchasesReview/PurchasesReview.js";
import InflationDeflation from "./pageTemplates/InflationDeflation/InflationDeflation.js";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain.js";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import Template1 from "./pageTemplates/Template1/Template1.js";
import TopNav from "./components/nav/TopNav.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "./utils/constants2.js";

import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.js";
import {
  getApplication,
  getApplicationTags,
  getApplicationTabs,
  getTabVisualizations,
  getTabTags,
  getSavedFilterService,
  removeSavedFilterService,
  insertSavedFilterService,
  updateSavedFilterService,
} from "./utils/writebackService.js";
import { LayoutSelector } from "./LayoutSelector.js";

export const ApplicationContext = React.createContext({})

export const Main2 = () => {
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);

  const [showMenu, setShowMenu] = useState();
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState({});

  const [filters, setFilters] = useState([]);
  const [fields, setFields] = useState([]);
  const [properties, setProperties] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [tabFilters, setTabFilters] = useState([]);

  const [initialLoad, setInitialLoad] = useState(true);
  //here
  const [selectedFilters, setSelectedFilters] = useState({});
  const [updatedFilters, setUpdatedFilters] = useState({});

  const [tabs, setTabs] = useState([]);
  const [applicationInfo, setApplicationInfo] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const [isDefaultFilters, setIsDefaultFilters] = useState();

  const params = useParams();

  const route = useRouteMatch();

  const history = useHistory();

  const slideIt = (show) => {
    setShowMenu(show);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {}, [updatedFilters]);

  // Initialize the states
  useEffect(() => {
    function groupFieldsByTags(fields) {
      const fieldsByTag = {};
      fields.forEach((field) => {
        if (field.tags != "") {
          field.tags
            .toString()
            .split(",")
            .forEach((tag) => {
              tag = tag.trim();

              if (fieldsByTag[tag] === undefined) {
                fieldsByTag[tag] = [field];
              } else {
                fieldsByTag[tag].push(field);
              }
            });
        }
      });
      return fieldsByTag;
    }

    const initializeTabs = async (tabs, tabTags, fieldsByTag, application) => {
      if (tabs) {
        if (tabs.length > 0) {
          setTabs(tabs);
          if (!params.path) {
            history.push(tabs[0].route);
          }

          let _fields = tabTags.filter(({tag_group}) => tag_group === "fields").map(f => {
            let _tab = f.title;
            let _tag = f.tag_name;
            let _subTab = f.sub_tab_name;
            return { tab: _tab, fields: fieldsByTag[_tag], sub_tab:_subTab }
          })

          setFields(_fields);

          let _appProperties = [];
          for await (let p of tabTags.filter(
            ({ tag_group }) => tag_group == "property"
          )) {
            if (
              !_appProperties.filter((prop) => prop.type == p.type).length > 0
            ) {
              let _type = p.type;
              let _text = p.att1;
              let _tag = p.tag_name;
              let _group = p.tag_group;
              let _fields = fieldsByTag[_tag];
              let _options = "";
              if (p.option_type === "single_value") {
                let value = await getValues(_fields[0], {}, application);
                _options = value[0];
              }
              if (_options != []) {
                _appProperties.push({
                  type: _type,
                  text: _text,
                  fields: _fields[0],
                  value: _options,
                  group: _group,
                });
              }
            }
          }
          setProperties(_appProperties);

          let _tabFilters = [];
          for await (let f of tabTags.filter(
            ({ tag_group }) => tag_group === "filters"
          )) {
            let _tab = f.title;
            let _type = f.type;
            let _tag = f.tag_name;
            let _group = f.tag_group;
            let _fields = fieldsByTag[_tag];
            let _options = "";
            if (_fields?.length > 0) {
              _tabFilters.push({
                tab: _tab,
                type: _type,
                fields: _fields[0],
                group: _group,
                options: _options,
              });
            }
          }
          setTabFilters(_tabFilters);
        }
      }
    };

    const createFilters = async (
      applicationTags,
      fieldsByTag,
      application,
      user
    ) => {
      let _filters = [];
      let _defaultSelected = {}
      let _defTags = applicationTags.find(({type}) => type === "default_filter");
      console.log(_defTags)
      let _defaultFilterFields = fieldsByTag[_defTags?.tag_name]
      for await (let f of applicationTags.filter(({ tag_group }) => tag_group == "filters")) {
        let _type = f.type;
        let _tag = f.tag_name;
        let _fields = fieldsByTag[_tag];
        console.log("tags", _tag + ' ' + _fields)
        let _options = []
        if (f.option_type === "date range") {
          _options = { field: _fields[0], values: await getDefaultDateRange() };
        }
        let _defFilterType = _defaultFilterFields?.filter((df) =>
          _fields?.includes(df)
        );
        if (_defFilterType?.length > 0) {
          _defaultSelected[_type] = {};
          _defFilterType.map((f) => {
            if (f["default_filter_value"] != null) {
              _defaultSelected[_type][f["name"]] = f["default_filter_value"];
            }
          });
        } else {
          _defaultSelected[_type] = {};
        }
        _filters.push({
          type: _type,
          fields: fieldsByTag[_tag],
          options: _options,
          option_type: f.option_type,
        });
      }
      setFilters(_filters);

      getSavedFilters(application, user, _filters);

      setSelectedFilters(_defaultSelected);

      getOptionValues(_filters, application);
    };

    const createParameters = async (applicationTags, fieldsByTag) => {
      let _appToggles = [];
      for await (let p of applicationTags.filter(
        ({ tag_group }) => tag_group == "toggle"
      )) {
        let _tag = p.tag_name;
        let _fields = fieldsByTag[_tag];
        let _options = [];
        let _type = p.type;
        if (_fields?.length > 0) {
          _options = _fields[0]?.enumerations;
          _appToggles.push({
            type: _type,
            fields: _fields[0],
            value: _options,
          });
        }
      }
      setParameters(_appToggles);
    };

    const initializeAppTags = async (
      applicationTags,
      fieldsByTag,
      application,
      user
    ) => {
      if (applicationTags) {
        createFilters(applicationTags, fieldsByTag, application, user);
        createParameters(applicationTags, fieldsByTag);
      }
    };

    const fetchLookMlFields = async (model, explore) => {
      const response = await sdk.ok(
        sdk.lookml_model_explore(model, explore, "fields")
      );
      const {
        fields: { dimensions, filters, measures, parameters },
      } = response;

      const lookmlFields = [
        ...dimensions,
        ...filters,
        ...measures,
        ...parameters,
      ];
      return groupFieldsByTags(lookmlFields);
    };

    const initialize = async () => {
      let userInfo = await getUser();
      setUser(userInfo);
      let contextData = getContextData();
      if (contextData) {
        let { application, application_tags, tabs, tab_tags } = contextData;
        setApplicationInfo(application);
        let fieldsByTag = await fetchLookMlFields(
          application.model,
          application.explore
        );
        initializeTabs(tabs, tab_tags, fieldsByTag, application);
        initializeAppTags(application_tags, fieldsByTag, application, userInfo);
        setIsFetchingLookmlFields(false);
      }
    };

    try {
      initialize();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  const getUser = async () => {
    return await sdk.ok(sdk.me());
  };

  const getOptionValues = async (filters, application) => {
    let _filters = [];
    let filterArr = [...filters];
    for await (let f of filterArr) {
      let _options = [];
      if (f.option_type === "fields") {
        _options = f.fields;
      }
      if (f.option_type === "values") {
        for await (let field of f.fields) {
          let values = await getValues(field, {}, application);
          _options.push({ field: field, values: values });
        }
      }
      if (f.option_type === "single_dimension_value") {
        if (f.fields?.length > 0) {
          let value = await getValues(f.fields[0], {}, application);
          _options = { field: f.fields[0], values: value };
        }
      }
      if (f.option_type === "date range") {
        _options = f.options;
      }
      if (f.option_type === "suggestions") {
        for await (let field of f.fields) {
          let values = field.suggestions.map((s) => {
            return { [field["name"]]: s };
          });
          _options.push({ field: field, values: values });
        }
      }
      f["options"] = _options;
      _filters.push(f);
    }
    setFilters(_filters);
  };

  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  const getValues = (field, filters, application = null) => {
    let _application = application;
    if (_application == null) {
      _application = applicationInfo;
    }
    try {
      return sdk
        .ok(
          sdk.run_inline_query({
            result_format: "json",
            body: {
              model: _application.model,
              view: field["view"],
              fields: [field["name"]],
              filters: filters,
              limit: 1000,
            },
          })
        )
        .catch((ex) => {
          return [];
        });
    } catch {
      return [];
    }
  };

  const updateAppProperties = async (filters) => {
    let newProps = [];
    for await (let prop of properties) {
      let _value = await getValues(prop["fields"], filters);
      prop.value = _value[0];
      newProps.push(prop);
    }
    setProperties(newProps);
  };

  const getContextData = () => {
    return extensionContext.extensionSDK.getContextData();
  };

  const getSavedFilters = async (
    app = applicationInfo,
    userInfo = user,
    _filters = filters
  ) => {
    let res = await getSavedFilterService(app.id, userInfo.id, sdk);
    const _newFilters = await parseSavedFilters(res, _filters);
    setSavedFilters(_newFilters);
  };

  const parseSavedFilters = async (savedFilters, _filters) => {
    const _newFilters = savedFilters?.map((sf) => {
      const _filter = {};
      const _toolTip = [];
      if (sf["filter_string"] != "") {
        for (const [key, value] of Object.entries(
          JSON.parse(sf["filter_string"])
        )) {
          if (Object.keys(value).length > 0) {
            let _fields = _filters.find(({ type }) => type === key);
            for (const _fieldName of Object.keys(value)) {
              let _field = _fields["fields"].find(({ name }) => {
                return _fieldName === name;
              });
              if (_field) {
                _filter[key] = {};
                _filter[key][_fieldName] = value[_fieldName];
                _toolTip.push(
                  `${_field["label_short"]} = ${value[_fieldName]}`
                );
              }
            }
          } else {
            _filter[key] = {};
          }
        }
      }
      sf["filter_string"] = _filter;
      sf["tooltip"] = _toolTip;
      return sf;
    });
    return _newFilters;
  };

  const removeSavedFilter = async (id) => {
    await removeSavedFilterService(id, sdk).then((r) => getSavedFilters());
  };

  const upsertSavedFilter = async (type, obj) => {
    if (type == "update") {
      await updateSavedFilterService(obj.id, obj.title, obj.global, sdk).then(
        (r) => getSavedFilters()
      );
    } else if (type == "insert") {
      await insertSavedFilterService(
        user.id,
        applicationInfo.id,
        JSON.stringify(updatedFilters),
        obj.title,
        obj.global,
        sdk
      ).then((r) => getSavedFilters());
    }
  };

  return (
    <>
      <NavbarMain user={user} />
      <Container fluid className="mt-50 padding-0">
        <ApplicationContext.Provider
          value={{application:applicationInfo,
            filters:filters,
            parameters:parameters,
            updateAppProperties:updateAppProperties,
            isFetchingLookmlFields:isFetchingLookmlFields,
            showMenu:showMenu,
            setShowMenu:setShowMenu,
            selectedFilters:selectedFilters,
            setSelectedFilters:setSelectedFilters,
            updatedFilters:updatedFilters,
            setUpdatedFilters:setUpdatedFilters,
            initialLoad:initialLoad,
            setInitialLoad:setInitialLoad,
            keyword:keyword,
            handleChangeKeyword:handleChangeKeyword,
            savedFilters:savedFilters,
            removeSavedFilter:removeSavedFilter,
            upsertSavedFilter:upsertSavedFilter,
            }}>
          <TopNav />
          <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
            <div id="nav2">
              <Tab.Container
                defaultActiveKey={currentNavTab}
                onSelect={(k) => setCurrentNavTab(k)}>
                <Nav className="inner nav nav-tabs nav-fill">
                  {tabs?.map(t =>
                    <Nav.Item>
                      <Nav.Link active={t.route === params.path} eventKey={t.route} as={Link} to={`${t.route}`}>{t.title}</Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </Tab.Container>
              <div className="show">
                <Tab.Content>
                  <>
                    {tabs?.map((t, i) =>
                      <LayoutSelector key={i}
                        isActive={params.path === t.route}
                        tabProps={t}
                        currentNavTab={currentNavTab}
                        fields={fields}
                        properties={properties}
                        tabFilters={tabFilters}
                      />
                    )}
                    {/* <Route path={`${route.url}/`}>
                    <Test />
                    </Route> */}
                  </>
                </Tab.Content>
              </div>
            </div>
          </div>
        </ApplicationContext.Provider>
      </Container>
      <ToTopButton />
      <SideForm />
      <Footer />
    </>
  );
};
