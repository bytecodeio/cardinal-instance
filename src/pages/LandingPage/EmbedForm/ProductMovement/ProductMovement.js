import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "../../../../utils/constants";
import { ExtensionContext } from "@looker/extension-sdk-react";
import InnerTableTabs from "../InnerTableTabs";
import Fields from "./helpers/Fields";
import Filters from "./helpers/Filters";
import Rx from "./helpers/Rx";
import AccountGroups from "./helpers/AccountGroups";
import { DateFilterGroup } from "./helpers/DateFilterGroup";
import { CurrentSelection } from "./helpers/CurrentSelection";
import { DateRangeSelector } from "./helpers/DateRangeSelector";

const ProductMovement = ({
  currentNavTab,
  selectedFilters,
  setSelectedFilters,
  filterOptions,
  dateFilterOptions,
  fieldOptions,
  isFetchingLookmlFields,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedDateRange,
  setSelectedDateRange,
  dateRange,
  slideIt,
}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  const wrapperRef = useRef(null);
  const [show3, setShow3] = useState();
  const [selectedFields, setSelectedFields] = useState([]);
  const defaultChecked = true;
  const [isDefaultProduct, setIsDefaultProduct] = useState(defaultChecked);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [currentInnerTab, setCurrentInnerTab] = useState(0);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  function handleClearAll() {}

  useEffect(() => {
    if (currentNavTab == "product-movement") {
      setIsFilterChanged(true);
      handleTabVisUpdate();
    }
  }, [currentNavTab]);

  // Fetch default selected fields and filters + query for embedded visualization from Looker dashboard on load
  const [isFetchingDefaultDashboard, setIsFetchingDefaultDashboard] =
    useState(true);
  useEffect(() => {
    async function fetchDefaultFieldsAndFilters() {
      const { dashboard_elements } = await sdk.ok(
        sdk.dashboard(PRODUCT_MOVEMENT_VIS_DASHBOARD_ID, "dashboard_elements")
      );

      dashboard_elements?.map((t) => {
        let { client_id } = t["result_maker"]["query"];
        setTabList((prev) => [
          ...prev,
          {
            title: t["title"],
            query: client_id,
            default_fields: [...t.result_maker.query["fields"]],
            selected_fields: [...t.result_maker.query["fields"]],
          },
        ]);
      });

      const { fields, filters } = dashboard_elements[0].result_maker.query;

      setSelectedFields(fields);
      if (filters) setSelectedFilters(filters);
      //setProductMovementVisQid(client_id);
      setIsFetchingDefaultDashboard(false);
    }

    try {
      fetchDefaultFieldsAndFilters();
    } catch (e) {
      console.error("Error fetching default dashboard", e);
    }
  }, []);

  // Fetch the suggestions for each filter field, after fetching all filter fields
  const [isFetchingFilterSuggestions, setIsFetchingFilterSuggestions] =
    useState(true);
  const [filterSuggestions, setFilterSuggestions] = useState({});
  useEffect(() => {
    if (isFetchingLookmlFields || !filterOptions.length) {
      return;
    }

    function fetchFilterSuggestions(filterFieldName) {
      return sdk.ok(
        sdk.run_inline_query({
          result_format: "json",
          body: {
            model: LOOKER_MODEL,
            view: LOOKER_EXPLORE,
            fields: [filterFieldName],
          },
        })
      );
    }

    async function fetchAllFilterSuggestions() {
      const filterSuggestionPromises = filterOptions.map((filterField) => {
        return fetchFilterSuggestions(filterField.name);
      });
      const filterSuggestionResponses = await Promise.allSettled(
        filterSuggestionPromises
      );

      const filterSuggestionsMap = {};
      filterSuggestionResponses.forEach((response) => {
        // Error handling
        if (response.status !== "fulfilled") {
          // handle rejected failures
          return;
        }
        if (response.value[0].looker_error) {
          console.error(
            "Error fetching suggestions for a Looker filter field ",
            response.value[0].looker_error
          );
          return;
        }

        // Add filter suggestions to map if no errors
        const fieldName = Object.keys(response.value[0])[0];
        const suggestions = response.value.map((row) => row[fieldName]);
        filterSuggestionsMap[fieldName] = suggestions;
      });

      setFilterSuggestions(filterSuggestionsMap);
      setIsFetchingFilterSuggestions(false);
    }

    fetchAllFilterSuggestions();
  }, [filterOptions, isFetchingLookmlFields]);

  // Page loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    if (!isFetchingDefaultDashboard && !isFetchingLookmlFields) {
      setIsPageLoading(false);
    }
  }, [isFetchingDefaultDashboard, isFetchingLookmlFields]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      These are the filters you use to query data. Select the accordions
      individually below to choose the different filter options inside. Once you
      are done you can choose the "Submit Values" button to update the data.
    </Tooltip>
  );

  // Handle run button click
  async function handleTabVisUpdate() {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    const prevVisQid = currentTab["query"];

    // remove filters with a value of "N/A"
    const filters = {};
    for (const filter in selectedFilters) {
      if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        filters[filter] = selectedFilters[filter];
      }
    }

    if (selectedDateFilter != "") {
      filters[selectedDateFilter] = "Yes";
    } else {
      if (selectedDateRange) {
        filters[dateRange["name"]] = selectedDateRange;
      }
    }

    if (isFilterChanged) {
      updateInnerTabFilters(filters);
    }

    const { vis_config } = await sdk.ok(sdk.query_for_slug(prevVisQid));

    const { client_id } = await sdk.ok(
      sdk.create_query({
        model: LOOKER_MODEL,
        view: LOOKER_EXPLORE,
        fields: currentTab["selected_fields"],
        filters,
        vis_config,
      })
    );

    tabs[currentInnerTab]["query"] = client_id;
    setTabList(tabs);
  }

  const updateInnerTabFilters = async (filters) => {
    let fullTabList = [...tabList];
    fullTabList.map(async (t, i) => {
      if (i != currentInnerTab) {
        const { vis_config, fields } = await sdk.ok(
          sdk.query_for_slug(t["query"])
        );

        const { client_id } = await sdk.ok(
          sdk.create_query({
            model: LOOKER_MODEL,
            view: LOOKER_EXPLORE,
            fields: fields,
            filters,
            vis_config,
          })
        );

        fullTabList[i]["query"] = client_id;
        setTabList(fullTabList);
      }
    });
    setIsFilterChanged(false);
  };

  async function handleClearAll() {
    setIsDefaultProduct(false);
    setUpdateButtonClicked(true);
    setSelectedFields([]);
  }

  async function handleRestoreDefault() {
    setIsDefaultProduct(defaultChecked);
    setUpdateButtonClicked(true);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab["selected_fields"] = currentTab["default_fields"];
    setTabList(tabs);
  }

  useEffect((e) => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      // setShow3(true);
      // slideIt()
    }
  };

  return (
    <Container fluid>
      {isPageLoading ? (
        <Spinner />
      ) : (
        <>
          <div id="slideOut3" className={show3 ? "" : "show3"} ref={wrapperRef}>
            <div className="slideOutTab3">
              <div
                id="one3"
                className="openTab bottomShadow"
                role="button"
                tabIndex="0"
                onClick={() => {
                  setShow3(false);
                  slideIt();
                }}
              >
                <p className="black m-0 mb-2">
                  <i className="far fa-bars"></i>
                </p>
                <p className="m-0">
                  <span className="noMobile">Product Filters</span>
                </p>
              </div>
            </div>

            <div className="modal-content">
              <div className="modal-header">
                <OverlayTrigger
                  placement="right"
                  overlay={renderTooltip}
                  className="tooltipHover"
                >
                  <p className="pb-1">
                    Filter Options <i className="fal fa-info-circle red"></i>
                  </p>
                </OverlayTrigger>
                <div className="closeThisPlease" id="close1">
                  <Button
                    role="button"
                    className="close"
                    data-dismiss="modal"
                    id="closeThisPlease1"
                    onClick={() => {
                      setShow3(true);
                      slideIt();
                    }}
                  >
                    {/*onClick={() => setShow3(false)}>*/}
                    &#10005;
                  </Button>
                </div>
              </div>
              <div className="modal-body">
                <Accordion defaultActiveKey={0} className="mt-3 mb-3">
                  <Row>
                    <Col xs={12} md={12}>
                      <Row>
                        <Col xs={12} md={12}>
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>Account Groups</Accordion.Header>
                            <Accordion.Body>
                              <AccountGroups />
                            </Accordion.Body>
                          </Accordion.Item>
                        </Col>

                        <Col xs={12} md={12}>
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>Rx</Accordion.Header>
                            <Accordion.Body>
                              <Rx />
                            </Accordion.Body>
                          </Accordion.Item>
                        </Col>
                        <Col xs={12} md={12}>
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>Filters</Accordion.Header>
                            <Accordion.Body>
                              <Filters
                                isLoading={isFetchingFilterSuggestions}
                                filterOptions={filterOptions}
                                filterSuggestions={filterSuggestions}
                                selectedFilters={selectedFilters}
                                setSelectedFilters={setSelectedFilters}
                                isDefault={isDefaultProduct}
                                setIsDefault={setIsDefaultProduct}
                                updateBtn={updateButtonClicked}
                                setUpdateBtn={setUpdateButtonClicked}
                                setIsFilterChanged={setIsFilterChanged}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        </Col>

                        <Col xs={12} md={12}>
                          <Accordion.Item eventKey="6">
                            <Accordion.Header>Fields</Accordion.Header>
                            <Accordion.Body>
                              <Fields
                                fieldOptions={fieldOptions}
                                setTabList={setTabList}
                                tabList={tabList}
                                currentInnerTab={currentInnerTab}
                                // selectedFields={selectedFields}
                                // setSelectedFields={setSelectedFields}
                                // isDefault={isDefaultProduct}
                                // setIsDefault={setIsDefaultProduct}
                                updateBtn={updateButtonClicked}
                                setUpdateBtn={setUpdateButtonClicked}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        </Col>

                        <Col xs={12} md={12}>
                          <Accordion.Item eventKey="4">
                            <Accordion.Header>Bookmarks</Accordion.Header>
                            <Accordion.Body></Accordion.Body>
                          </Accordion.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Accordion>

                <div className="d-flex flex-column justify-content-center align-items-center mt-3 mb-3">
                  {/*<input placeholder="Search Filter" type="search" className="form-control" />*/}
                  {/*<input placeholder="Top % Products" type="search" className="form-control" />*/}
                  <Button
                    onClick={handleTabVisUpdate}
                    // onClick={handleVisUpdate}
                    className="btn"
                  >
                    Submit Values
                  </Button>
                </div>

                <div className="lineAcross"></div>

                <div className="d-flex flex-column justify-content-between mt-3 pt-3">
                  <Button onClick={handleRestoreDefault} className="btn-clear">
                    Restore Default <i className="fal fa-undo"></i>
                  </Button>
                  <Button className="btn-clear">
                    Print <i className="fal fa-print"></i>
                  </Button>
                  <Button onClick={handleClearAll} className="btn">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col xs={12} md={5}>
              {/*<p onClick={() => slideIt()}>slide</p>*/}

              <CurrentSelection
                selectedDateFilter={selectedDateFilter}
                selectedFilters={selectedFilters}
                selectedFields={selectedFields}
                fieldOptions={fieldOptions}
                setSelectedFields={setSelectedFields}
                filterOptions={filterOptions}
                setSelectedFilters={setSelectedFilters}
                dateFilterOptions={dateFilterOptions}
              />

              <p className="mt-5">
                Total Invoice: <span className="highlight large">17</span>
              </p>
            </Col>

            <Col xs={12} md={7}>
              <DateRangeSelector
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
                setSelectedDateFilter={setSelectedDateFilter}
              />

              <DateFilterGroup
                dateFilterOptions={dateFilterOptions}
                setSelectedDateFilter={setSelectedDateFilter}
                selectedDateFilter={selectedDateFilter}
              />
            </Col>
          </Row>

          <Row className="mt-3 mb-3">
            <Col md={12}>
              <InnerTableTabs
                tabs={tabList}
                setSelectedFields={setSelectedFields}
                currentInnerTab={currentInnerTab}
                setCurrentInnerTab={setCurrentInnerTab}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ProductMovement;
