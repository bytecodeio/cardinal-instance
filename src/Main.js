import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import PurchasesReview from "./pageTemplates/PurchasesReview/PurchasesReview";
import InflationDeflation from "./pageTemplates/InflationDeflation/InflationDeflation";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import Template1 from "./pageTemplates/Template1/Template1";
import TopNav from "./components/nav/TopNav.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "./utils/constants";

import { sortDateFilterList } from "./utils/globalFunctions";

export const Main = () => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);

  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const [dateFilterOptions, setDateFilterOptions] = useState([]);

  const [quickFilterfields, setQuickFilterFields] = useState([]);
  const [quickFilterOptions, setQuickFilterOptions] = useState([]);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState({})

  const [selectedDateRange, setSelectedDateRange] = useState();

  const [currentInvoiceCount, setCurrentInvoiceCount] = useState("");
  const [selectedAccountGroup, setSelectedAccountGroup] = useState([]);

  const [productMovementFields, setProductMovementFields] = useState([]);
  const [totalInvoiceField, setTotalInvoiceField] = useState();
  const [quickFilter, setQuickFilter] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [accountGroupField, setAccountGroupField] = useState();
  const [dimensionToggleFields, setDimensionToggleFields] = useState({});

  const [dateRange, setDateRange] = useState("");
  const [showMenu, setShowMenu] = useState();
  const [keyword, setKeyword] = useState("");

  const [updatedFilters, setUpdatedFilters] = useState(false);



  const slideIt = (show) => {
    setShowMenu(show);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

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

    const fetchLookmlFields = async () => {
      const response = await sdk.ok(
        sdk.lookml_model_explore(LOOKER_MODEL, LOOKER_EXPLORE, "fields")
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
      const fieldsByTag = groupFieldsByTags(lookmlFields);

      console.log(fieldsByTag, "hi there")

      const _filterOptions = fieldsByTag[LOOKML_FIELD_TAGS.filter];
      const _quickFilterFields = fieldsByTag[LOOKML_FIELD_TAGS.quick_filter];

      const _dateFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.date_filter];


      const _productMovementfieldOptions =
        fieldsByTag[LOOKML_FIELD_TAGS.productMovementField];

      const _defaultFilterFields = fieldsByTag[LOOKML_FIELD_TAGS.defaultFilters];

      console.log("default filters", _defaultFilterFields)

      if (_defaultFilterFields?.length > 0) {
        let _filterSet = {}
        _defaultFilterFields.map(d => {
          if (_dateFilterOptions.find(({name}) => name === d['name'])) {
            setSelectedDateFilter(d['name'])
          } else {
            _filterSet[d['name']] = d['default_filter_value']
            setSelectedFilters(_filterSet)
          }
        })
        console.log("filter set",_filterSet)

      } else {
        console.error("No default filters")
      }
      // _dimensionToggleFields has the shape { [tag]: field }
      // it gets populated with all the tags that are prefixed with `toggle:`
      const _dimensionToggleFields = Object.fromEntries(
        Object.entries(fieldsByTag).reduce((accumulator, [tag, field]) => {
          if (tag.startsWith(LOOKML_FIELD_TAGS.togglePrefix)) {
            accumulator.push([tag, field]);
          }
          return accumulator;
        }, [])
      );
      if (Object.keys(_dimensionToggleFields).length) {
        setDimensionToggleFields(_dimensionToggleFields);
      }

      let _accountGroupField = undefined;
      try {
        _accountGroupField = fieldsByTag[LOOKML_FIELD_TAGS.accountGroups][0];
      } catch (err) {
        console.error(
          `No account group field using tag ${LOOKML_FIELD_TAGS.accountGroups}`
        );
      }

      let _quickFilterOptions = []
      try {
         for await(let f of _quickFilterFields) {
          console.log("filters",f)
          let values = await getDefaultValues(f);
          let qfOption = {
            label:f['label_short'],
            name:f['name'],
            values: values.map(v => {return v[f['name']]})
          }
          _quickFilterOptions.push(qfOption)
        }
      } catch (error){
        console.error(`No Quick Filter Options available`)
      }

      setQuickFilterOptions(_quickFilterOptions)



      const _dateRange = fieldsByTag[LOOKML_FIELD_TAGS.dateRange];

      let _totalInvoice = undefined;


      try {
        _totalInvoice = fieldsByTag[LOOKML_FIELD_TAGS.totalInvoices][0];
      } catch (err) {
        console.error(


          `No total invoice field with the tag ${LOOKML_FIELD_TAGS.totalInvoices}`
        );
      }

      let defaultFilterSelections = [];
      try {
        defaultFilterSelections = Object.fromEntries(
          _filterOptions.map((filter) => [filter.name, "N/A"])
        );
      } catch (error) {
        console.error(
          `No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`
        );
      }

      if (_quickFilterFields.length > 0) {
        setQuickFilterFields(_quickFilterFields)
      } else (
        console.error(`No quick filter fields found using tag ${LOOKML_FIELD_TAGS.quick_filter}`)
      )


     //
     //  //added  QuickFilter here
     //
     //  let defaultQuickFilterSelections = []
     //    try {
     //      defaultQuickFilterSelections = Object.fromEntries(
     //        _quickFilterOptions.map((filter) => [filter.name, "N/A"])
     //        );
     //    } catch(error) {
     //      console.error(`No filter options found using tag ${LOOKML_FIELD_TAGS.quick_filter}`)
     //    }
     //
     // console.log(defaultQuickFilterSelections)



    //date filters
      const defaultDateFilterSelections = _dateFilterOptions?.find((filter) => {
        if (filter["suggestions"]) {
          return filter["suggestions"].find((s) => {
            return s.toUpperCase() === "YES";
          });
        }
      });


      if (defaultDateFilterSelections != undefined) {
        setSelectedDateFilter(defaultDateFilterSelections["name"]);
      }

      setSelectedDateRange(getDefaultDateRange());


      // if (defaultQuickFilterSelections != undefined) {
      //   setQuickFilter(defaultQuickFilterSelections["name"]);
      // }

      setSelectedDateRange(getDefaultDateRange());

      if (_totalInvoice != undefined) {
        setTotalInvoiceField(_totalInvoice);
        console.log("total invoice issue", _totalInvoice)
        let values = await getValues(_totalInvoice);
        setCurrentInvoiceCount(values[0][_totalInvoice["name"]]);
      }

      if (_filterOptions) {
        setFilterOptions(_filterOptions);
      } else {
        console.error(
          `No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`
        );
      }

      // if (_quickFilterOptions) {
      //   setQuickFilterOptions(_quickFilterOptions);
      // } else {
      //   console.error(`No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`)
      // }

      if (_productMovementfieldOptions) {
        setProductMovementFields(_productMovementfieldOptions);
      } else {
        console.error(
          `No fields found using tag ${LOOKML_FIELD_TAGS.productMovementField}`
        );
      }

      if (_dateFilterOptions) {
        setDateFilterOptions(sortDateFilterList(_dateFilterOptions));
      } else {
        console.error(
          `No date filters found using tag ${LOOKML_FIELD_TAGS.date_filter}`
        );
      }

      if (_accountGroupField != undefined) {
        setAccountGroupField(_accountGroupField);
        let values = await getDefaultValues(_accountGroupField);
        setAccountGroupOptions(
          values.splice(0, 160).map((v, i) => {
            return v[_accountGroupField["name"]];
          })
        );
      }


      //setSelectedFilters(defaultFilterSelections);

      //setQuickFilter(defaultQuickFilterSelections);

      try {
        setDateRange(_dateRange[0]);
      } catch (error) {


        console.error(
          `No date range found using tag ${LOOKML_FIELD_TAGS.dateRange}`
        );
      }

      setIsFetchingLookmlFields(false);
    };

    try {
      fetchLookmlFields();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  useEffect(() => {}, [selectedDateRange]);

  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  const updateDateRange = async () => {
    let field = { ...dateRange };
    console.log(selectedDateFilter);
    if (selectedDateFilter != "" && Object.keys(field).length > 0) {
      let dateFilterField = dateFilterOptions.find(
        (df) => df["name"] == selectedDateFilter
      );
      console.log("date_filter field", field);
      let filter = {};
      filter[selectedDateFilter] = "Yes";
      console.log(filter);
      const newRange = await sdk.ok(
        sdk.run_inline_query({
          result_format: "json",
          body: {
            model: LOOKER_MODEL,
            view: dateFilterField["view"],
            fields: [field["name"]],
            filters: filter,
            sorts: [field["name"]],
          },
        })
      );
      console.log("new Range", newRange);
      if (newRange.length > 0) {
        let max = newRange.length - 1;
        setSelectedDateRange(
          `${newRange[0][field["name"]]} to ${newRange[max][field["name"]]}`
        );
      }
    }
  };

  const getValues = (field) => {
    console.log(field)
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: LOOKER_EXPLORE,
          //view: field["view"],
          fields: [field["name"]],
          filters: getAllFilters(),
          limit:10
        },
      })
    );
  };

  const getDefaultValues = (field) => {
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: LOOKER_EXPLORE,
          fields: [field["name"]],
          filters: {},
          limit:10
        },
      })
    );
  };

  const getAllFilters = () => {
    let filters = {};
    for (const filter in selectedFilters) {
      if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        filters[filter] = selectedFilters[filter];
      }
    }

    // for (const filter in quickFilter) {
    //   if (quickFilter[filter] && quickFilter[filter] !== "N/A") {
    //     filters[filter] = quickFilter[filter];
    //   }
    // }
    if (selectedQuickFilter) {
      Object.keys(selectedQuickFilter).map(key => {
        filters[key] = selectedQuickFilter[key]
      })
    }

    if (selectedDateFilter != "") {
      filters[selectedDateFilter] = "Yes";
    } else {
      if (selectedDateRange) {
        filters[dateRange["name"]] = selectedDateRange;
      }
    }

    if (selectedAccountGroup.length > 0) {
      filters[accountGroupField["name"]] = selectedAccountGroup.join(",");
    }
    return filters;
  };

  const updateInvoiceCount = async () => {
    console.log("total invocie", totalInvoiceField)
    if (totalInvoiceField != undefined) {
      let newCount = await getValues(totalInvoiceField);
      setCurrentInvoiceCount(newCount[0][totalInvoiceField["name"]]);
    }
  };

  useEffect(() => {
    if (selectedDateFilter != "") {
      updateDateRange();
    }
  }, [selectedDateFilter]);

  let comment0 =  `The <span class="highlight">Purchases Review Dashboard</span> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor.`
  let comment1 =  `The <span class="highlight">Product Movement Dashboard</span> allows viewing of top-moving products for a single account in descending order by units, filtering by type or customize your report.`
  let comment2 = `The <span class="highlight">Invoice Report Dashboard</span> allows the view of an invoice summary for a single account and query all invoices within a specific date range.`
  let comment3 = `The <span class="highlight">Auto-Sub Report</span> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor.`
  let comment4 = `The <span class="highlight">Inflation/Deflation Report</span> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor.`


  return (
    <>
      <NavbarMain />
      <Container fluid className="mt-50 padding-0">
        <TopNav />
        <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
          <div id="nav2">
            <Tabs
              defaultActiveKey="product-movement"
              onSelect={(k) => setCurrentNavTab(k)}
              className="mb-0 inner"
              fill
            >
              <Tab eventKey="dashboard" title="Purchases Review" mountOnEnter={true} unmountOnExit={false}>
                <PurchasesReview
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  currentNavTab={currentNavTab}

                  dimensionToggleFields={dimensionToggleFields}
                  quickFilterOptions={quickFilterOptions}

                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  keyword={keyword}
                  handleChangeKeyword={handleChangeKeyword}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment0}} />}}
                />
              </Tab>
              <Tab eventKey="product-movement" title="Product Movement Report" mountOnEnter={true} unmountOnExit={false}>
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"product-movement"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  keyword={keyword}
                  handleChangeKeyword={handleChangeKeyword}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment1}} />}}
                  updatedFilters={updatedFilters}
                  setUpdatedFilters={setUpdatedFilters}

                />
              </Tab>
              <Tab eventKey="invoice" title="Invoice Report" mountOnEnter={true} unmountOnExit={false}>
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"invoice"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment2}} />}}
                />
              </Tab>
              <Tab eventKey="auto-sub" title="Auto-Sub Report" mountOnEnter={true} unmountOnExit={false}>
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{ tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID }}
                  tabKey={"auto-sub"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  quickFilterOptions={quickFilterOptions}
                  setSelectedQuickFilter={setSelectedQuickFilter}
                  selectedQuickFilter={selectedQuickFilter}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment3}} />}}
                />
              </Tab>
              <Tab eventKey="id" title="Inflation/Deflation Report" mountOnEnter={true} unmountOnExit={false}>
                <InflationDeflation
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  config={{
                    tabbedVis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
                    vis1: PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
                  }}
                  tabKey={"id"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  currentInvoiceCount={currentInvoiceCount}
                  updateInvoiceCount={updateInvoiceCount}
                  getAllFilters={getAllFilters}
                  setSelectedAccountGroup={setSelectedAccountGroup}
                  accountGroupOptions={accountGroupOptions}
                  selectedAccountGroup={selectedAccountGroup}
                  accountGroupField={accountGroupField}
                  description={{description: <div dangerouslySetInnerHTML={{__html:comment4}} />}}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Container>
      <ToTopButton />
      <SideForm />
      <Footer />
    </>
  );
};
