import React, { useLayoutEffect, useState, useContext, useEffect, useRef } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
  Modal
} from "react-bootstrap";
import * as $ from "jquery";
import RangeSlider from 'react-bootstrap-range-slider';
import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "../../utils/constants";
import { ExtensionContext } from "@looker/extension-sdk-react";


import Fields from "../Template1/helpers/Fields";
import Filters from "../Template1/helpers/Filters";
import Rx from "./helpers/Rx";
import QuickFilter from "../Template1/helpers/QuickFilter";
import AccountGroups from "../Template1/helpers/AccountGroups";
import { DateFilterGroup } from "../Template1/helpers/DateFilterGroup";
import { CurrentSelection } from "../Template1/helpers/CurrentSelection";
import CurrentAccountGroup  from "./helpers/CurrentAccountGroup";
import { DateRangeSelector } from "../Template1/helpers/DateRangeSelector";
import EmbedTable from "../../components/EmbedTable";
import TabbedVisualizations from "../../components/TabbedVisualizations";
import InnerTableTabs from "../../components/InnerTableTabs";

const PurchasesReview = ({
  currentNavTab,
  selectedFilters,
  setSelectedFilters,
  filterOptions,

  dateFilterOptions,
  fieldOptions,
  isFetchingLookmlFields,
  selectedDateFilter,
  setSelectedDateFilter,
  dimensionToggleFields,

  selectedDateRange,
  setSelectedDateRange,
  dateRange,

  tabKey,
  config,
  showMenu,
  setShowMenu,
  currentInvoiceCount,
  updateInvoiceCount,
  getAllFilters,

  quickFilterOptions,
  selectedQuickFilter,
  setSelectedQuickFilter,

  setSelectedAccountGroup,
  accountGroupOptions,
  selectedAccountGroup,
  accountGroupField,
  keyword,
  setKeyword,
  handleChangeKeyword,
  description,
  updatedFilters,
  setUpdatedFilters,
  handleFieldsAll,
  updatedColor,
  setUpdatedColor
}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  const [productMovementVisQid, setProductMovementVisQid] = useState();
  const wrapperRef = useRef(null);
  const [show3, setShow3] = useState();
  const [selectedFields, setSelectedFields] = useState([]);
  const defaultChecked = true;
  const [isDefaultProduct, setIsDefaultProduct] = useState(defaultChecked);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [currentInnerTab, setCurrentInnerTab] = useState(0);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [ value, setValue ] = useState(0);
  const [ step, setStep ] = useState(1);
  const [active, setActive] = useState(false);
  const [faClass, setFaClass] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [showMenu2, setShowMenu2] = useState();
  const [choseClearAll, setChoseClearAll] = useState(defaultChosenValue);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  useEffect(() => {
    if (currentNavTab == tabKey) {
      setIsFilterChanged(true);
      handleTabVisUpdate();
      //slideIt(show3);
    }
  }, [currentNavTab]);

  // Fetch default selected fields and filters + query for embedded visualization from Looker dashboard on load
  const [isFetchingDefaultDashboard, setIsFetchingDefaultDashboard] =
    useState(true);


  // useEffect(() => {
  //   async function fetchDefaultFieldsAndFilters() {
  //
  //     const { dashboard_elements } = await sdk.ok(
  //       sdk.dashboard(PRODUCT_MOVEMENT_VIS_DASHBOARD_ID, "dashboard_elements")
  //     );
  //
  //     const { client_id, fields, filters } =
  //       dashboard_elements[0].result_maker.query;
  //
  //     setSelectedFields(fields);
  //     if (filters) setSelectedFilters(filters);
  //     setProductMovementVisQid(client_id);
  //     setIsFetchingDefaultDashboard(false);
  //   }
  //
  //   try {
  //     fetchDefaultFieldsAndFilters();
  //   } catch (e) {
  //     console.error("Error fetching default dashboard", e);
  //   }
  // }, []);



  useEffect(() => {

    async function fetchDefaultFieldsAndFilters() {
      const { dashboard_elements, dashboard_filters } = await sdk.ok(
        sdk.dashboard(PRODUCT_MOVEMENT_VIS_DASHBOARD_ID, "dashboard_elements, dashboard_filters")
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

      const { client_id, fields, filters } =
      dashboard_elements[0].result_maker.query;

      setSelectedFields(fields);
      setProductMovementVisQid(client_id);
      setIsFetchingDefaultDashboard(false);

      if (Object.keys(getAllFilters()).length == 0) {
        let defaultedFilters = dashboard_filters.filter(f => {
         return f.default_value !== null && f.default_value !== undefined && f.field.tags.length > 0
        })
        if (defaultedFilters.length > 0) {
          let filterArr = {...selectedFilters}
          defaultedFilters.map(f => {
            let key = f['dimension']
            filterArr[key] = f['default_value']
            //addDefaultFilters(f)
          })
          setSelectedFilters(filterArr)
        }
      }
      //if (filters) setSelectedFilters(filters);
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
    if (isFetchingLookmlFields || !filterOptions?.length) {
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



    // Fetch the quick filter suggestions for each filter field
    const [isFetchingQuickFilterSuggestions, setIsFetchingQuickFilterSuggestions] =
    useState(true);
    const [quickFilterSuggestions, setQuickFilterSuggestions] = useState({});
    useEffect(() => {
      if (isFetchingLookmlFields || !quickFilterOptions?.length) {
        return;
      }

      function fetchQuickFilterSuggestions(filterFieldName) {
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

      async function fetchAllQuickFilterSuggestions() {
        const quickFilterSuggestionPromises = quickFilterOptions.map((filterField) => {
          return fetchQuickFilterSuggestions(filterField.name);
        });
        const quickFilterSuggestionResponses = await Promise.allSettled(
        quickFilterSuggestionPromises
        );

        const quickFilterSuggestionsMap = {};
        quickFilterSuggestionPromises.forEach((response) => {
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
          quickFilterSuggestionsMap[fieldName] = suggestions;
        });

        setQuickFilterSuggestions(quickFilterSuggestionsMap);
        setIsFetchingQuickFilterSuggestions(false);
      }

      fetchAllQuickFilterSuggestions();
    }, [quickFilterOptions, isFetchingLookmlFields]);




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
  async function handleVisUpdate() {
    const prevVisQid = productMovementVisQid;
    setProductMovementVisQid();
    // remove filters with a value of "N/A"
    const filters = {};
    for (const filter in selectedFilters) {
      if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        filters[filter] = selectedFilters[filter];
      }
    }

    if (selectedDateFilter != "") {
      filters[selectedDateFilter] = "Yes";
    }

    const { visConfig } = await sdk.ok(sdk.query_for_slug(prevVisQid));
    const { client_id } = await sdk.ok(
      sdk.create_query({
        model: LOOKER_MODEL,
        view: LOOKER_EXPLORE,
        fields: selectedFields,
        filters,
        visConfig,
      })
    );
    setProductMovementVisQid(client_id);
  }

  // Handle run button click
  async function handleTabVisUpdate() {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    const prevVisQid = currentTab["query"];

    // remove filters with a value of "N/A"
    let filters = {};
    // for (const filter in selectedFilters) {
      //   if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        //     filters[filter] = selectedFilters[filter];
        //   }
        // }

        // if (selectedDateFilter != "") {
          //   filters[selectedDateFilter] = "Yes";
          // } else {
            //   if (selectedDateRange) {
              //     filters[dateRange["name"]] = selectedDateRange;
              //   }
              // }
              filters = await getAllFilters();

              if (isFilterChanged) {
                updateInnerTabFilters(filters);
              }

              await updateInvoiceCount()

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

  async function doClearAll() {

    // setIsDefaultProduct(false);
    setUpdateButtonClicked(true);
    setSelectedFields([]);
    setSelectedAccountGroup([])
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab["selected_fields"] = [];
    setTabList(tabs);
    let filters = {...selectedFilters};
    for(let name in filters) {
      filters[name] = 'N/A';
    }
    setSelectedFilters(filters);
    // setSelectedFilters((prevFilters) => {
      //   const newFilters = { ...prevFilters };
      //   newFilters[filterName] = 'N/A';
      //   return newFilters;
      // });
      setIsFilterChanged(true);
    }


    async function clearAllAccounts() {
      setSelectedAccountGroup([])
    }

    async function handleRestoreDefault() {

      let tabs = [...tabList];

      tabs[currentInnerTab]["selected_fields"] = [...tabs[currentInnerTab]["default_fields"]];
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
        //setShow3(false);
      }
    };

    const handleClick = () => {
        setToggle(!toggle);

      setTimeout(() => {
        setActive(!active);

        setFaClass(!faClass);
      }, 600);
      };

      //jquery will be removed and changed, leave for now

    $(document).on('click', function(){
      if ($('.theSelected').height() > 74.8){
        $('.theSelected').addClass('theEnd').css({'maxHeight': '76px', "overflow" : "hidden"})
        $('.hideThisEnd, .whiteBar').show()
      }
      else{
        $('.theSelected').removeClass('theEnd').css({'maxHeight': 'unset', "overflow" : "unset"})
        $('.hideThisEnd, .whiteBar').hide()
      }

        $('#numberCounter').html($('.tab-pane.active.show .theSelected .theOptions').length + $('.tab-pane.active.show .theSelected .dateChoice').length)
    })
    $(window).resize(function () {
        $(document).trigger('click')
    });
    //jquery will be removed and changed, leave for now


    const defaultChosenValue = localStorage.getItem('choseClearAll');
    console.log('local storage value first', defaultChosenValue)



    const handleUserYes = () => {
      setChoseClearAll("1")
      localStorage.setItem('choseClearAll', "1");
      doClearAll();
      setShow(false);
    }



    const handleClearAll = () => {
      if (defaultChosenValue == "1") {
        setShow(false)
        doClearAll();
      } else {
        if(!choseClearAll) {
          setShow(true)
        } else {
          doClearAll();
        }
      }
    }

    const slideIt2 = () =>{
      setShowMenu2(!showMenu2)
    }
    function handleFieldAll(value) {
      setSelectedAccountGroup(accountGroupOptions)
    }

    function handleFieldsAll(value) {
      let tabs = [...tabList];
      tabs[currentInnerTab]['selected_fields'] = fieldOptions?.map(f => {return f['name']});
      setTabList(tabs)
    }


    const changeColor = () => {
        setUpdatedFilters(true);
      };


  return (
    <Container fluid>
      {isPageLoading ? (
        <Spinner />
      ) : (
        <>
        <div id="slideOut3" className={showMenu ? "" : "show3"} ref={wrapperRef}>
          <div className="slideOutTab3">
            <div id="one3" className="openTab bottomShadow" role="button" tabindex="0"
            onClick={() => {setShowMenu(false);}}>
            <p className="black m-0 mb-2"><i class="far fa-bars"></i></p>
            <p className="m-0"><span className="noMobile">Selection Options</span></p>
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
              Selection Options <i className="fal fa-info-circle red"></i>
            </p>
          </OverlayTrigger>
          <div className="closeThisPlease" id="close1">
            <Button role="button" className="close" data-dismiss="modal" id="closeThisPlease1"
            onClick={() => {setShowMenu(true);}}>
            {/*onClick={() => setShow3(false)}>*/}
            &#10005;
          </Button>
        </div>
      </div>
      <div className="modal-actions">
      <div className="position-relative columnStart mb-3">
      <label>Search Selections</label>
        <input placeholder="" type="search" class="form-control" />
        <i class="far fa-search absoluteSearch"></i>
      </div>


        <div className="across">
          <Button
            onClick={handleClearAll}
            className="btn-clear"
          >
            Clear All
          </Button>


          <Button
          onClick={() => {
           handleTabVisUpdate();
           changeColor();
         }}


          className="btn">Update Selections
        </Button>
      </div>
    </div>
    <div className="modal-body">
      <Accordion defaultActiveKey={0} className="mt-3 mb-3">
        <Row>
          <Col xs={12} md={12}>

            <Row>

              {/* Account Groups */}
              {accountGroupOptions?.length > 0?
                <Col xs={12} md={12}>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Account Groups</Accordion.Header>
                    <Accordion.Body>

                    <span className="allOptions clear first" onClick={handleFieldAll}>Select All</span>

                    <span className="allOptions clear second" onClick={clearAllAccounts}>Clear All</span>

                    <span className="allOptions clear"  onClick={() => slideIt2()}>View All</span>

                    <div className="mb-5"></div>


                      <div className="position-relative mb-2">
                        <input value={keyword} onChange={handleChangeKeyword} placeholder="Search" type="search" class="form-control" />
                        <i class="far fa-search absoluteSearch"></i>
                      </div>
                      <AccountGroups
                      fieldOptions={keyword !== "" ? accountGroupOptions.filter(option => option.indexOf(keyword)!== -1) : accountGroupOptions}
                      selectedAccountGroup={selectedAccountGroup}
                      setSelectedAccountGroup={setSelectedAccountGroup}
                      showMenu2={showMenu2}
                      setShowMenu2={setShowMenu2}
                      handleFieldAll={handleFieldAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
                :''
              }


              {/* Fields */}
              {fieldOptions?.length > 0?
                <Col xs={12} md={12}>
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>Fields</Accordion.Header>
                    <Accordion.Body>
                    <div className="mb-5">
                    <span className="allOptions clear first" onClick={handleFieldsAll}>Select All</span>

                    <span className="allOptions clear restore" onClick={handleRestoreDefault}>Restore Defaults</span>

                    <span className="allOptions clear" onClick={() => slideIt2()}>View All</span>
                    </div>

                      <Fields

                      setTabList={setTabList}
                      tabList={tabList}
                      currentInnerTab={currentInnerTab}
                      selectedFields={selectedFields}
                      fieldOptions={fieldOptions}
                      setSelectedFields={setSelectedFields}
                      // selectedFields={selectedFields}
                      // setSelectedFields={setSelectedFields}
                      // isDefault={isDefaultProduct}
                      // setIsDefault={setIsDefaultProduct}
                      updateBtn={updateButtonClicked}
                      setUpdateBtn={setUpdateButtonClicked}
                      showMenu2={showMenu2}
                      setShowMenu2={setShowMenu2}
                      handleFieldsAll={handleFieldsAll}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
                :''
              }

              {/*Filters */}
              {quickFilterOptions?.length && filterOptions?.length > 0 ?
                <Col xs={12} md={12}>
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>

                    {/*Quick Filters */}
                    {
                      quickFilterOptions?.length > 0?
                    <QuickFilter
                    quickFilterOptions={quickFilterOptions}
                    setSelectedQuickFilter={setSelectedQuickFilter}
                    selectedQuickFilter={selectedQuickFilter}
                    updateBtn={updateButtonClicked}
                    setUpdateBtn={setUpdateButtonClicked}
                    setIsFilterChanged={setIsFilterChanged}
                    />
                    :
                    ''
                  }

                  {/* Filters */}
                  {filterOptions?.length > 0?
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

                      :''
                    }
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
                :
                ''
              }

              {/* Bookmarks */}
              <Col xs={12} md={12}>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Saved Filters</Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Accordion>

      <Col xs={12} md={12}>
      <div className="d-flex flex-column text-center position-relative">
      <p className="">Top % Products</p>

      <input
          value={value}
          onChange={changeEvent => {
            setStep(1);
            setValue(changeEvent.target.value)
          }}
          placeholder={value}
          type="search"
          list="steplist"
          min="0" max="100"
          from="0"
          step="1"
          className="value"/>

      <input
          value={value}
          onChange={changeEvent => {
            setStep(25);
            setValue(changeEvent.target.value)
          }}
          type="range"
          min="0" max="100"
          step={step}
          list="steplist"
          className="range-slider mt-2"/>

      <datalist id="steplist" className="range">
          <option label="0">0</option>
          <option label="25">25</option>
          <option label="50">50</option>
          <option label="75">75</option>
          <option label="100">100</option>
      </datalist>


      </div>
      </Col>





    </div>
  </div>
</div>

<Row className="fullW">


<Col md={12} lg={12}>
  {/* Date Range Selector */}
  {dateFilterOptions.length>0?
    <DateRangeSelector
    selectedDateRange={selectedDateRange}
    setSelectedDateRange={setSelectedDateRange}
    setSelectedDateFilter={setSelectedDateFilter}
    dateFilterOptions={dateFilterOptions}
    selectedDateFilter={selectedDateFilter}
    handleTabVisUpdate={handleTabVisUpdate}
    currentInvoiceCount={currentInvoiceCount}
    description={description}
    />
    :''
  }

  {/*<DateFilterGroup
    dateFilterOptions={dateFilterOptions}
    setSelectedDateFilter={setSelectedDateFilter}
    selectedDateFilter={selectedDateFilter}
    />*/}
  </Col>

  </Row>

  <Row className="fullW d-flex align-items-center">
    <Col md={12} lg={2}>



  {currentInvoiceCount != ""?
  <p>
    <b>Total Invoices:</b> <span className="highlight large">{currentInvoiceCount}</span>
  </p>
  :''
}

  </Col>
  <Col md={12} lg={3}>

  </Col>

  <Col md={12} lg={2}>

  {/*<div className="position-relative columnStart">
  <label>Top % Products</label>

    <input  type="search" class="form-control" />

  </div>*/}

  </Col>
  </Row>


<Row className="fullW mt-5 position-relative">

  <Col xs={12} md={11}>


    <div  className={toggle ? 'd-flex justify-content-start align-items-center flex-wrap theSelected slide-up' : 'd-flex justify-content-start align-items-center flex-wrap theSelected slide-down'}>



    <p class="mr-3"><b>Current Selections:</b></p>
      <CurrentSelection
      selectedDateFilter={selectedDateFilter}
      selectedFilters={selectedFilters}
      selectedFields={selectedFields}
      fieldOptions={fieldOptions}
      setSelectedFields={setSelectedFields}
      filterOptions={filterOptions}
      setSelectedFilters={setSelectedFilters}
      dateFilterOptions={dateFilterOptions}
      selectedDateRange={selectedDateRange}
      quickFilterOptions={quickFilterOptions}

      selectedQuickFilter={selectedQuickFilter}
      setSelectedQuickFilter={setSelectedQuickFilter}

      selectedAccountGroup={selectedAccountGroup}
      setSelectedAccountGroup={setSelectedAccountGroup}
      updatedFilters={updatedFilters}
      setUpdatedFilters={setUpdatedFilters}
      changeColor={changeColor}
      />



    </div>

    </Col>

    <div className="hideThisEnd" onClick={handleClick}>
      <i className={faClass ? 'fas fa-plus-circle' : 'fas fa-minus-circle'}>&nbsp;
      <span> { active ? "See Less" : "See All"} (<p id="numberCounter"></p>) </span></i>

  </div>


  </Row>


         <Row className="mt-3 mb-3">
               <Col md={4}>
                 <Container fluid className="padding-0 innerTab smallerHeight embed-responsive embed-responsive-16by9">
                   <EmbedTable queryId={"bDiiTcGudISg0FmJpMo1oN"} />
                 </Container>
                 <Container fluid className="padding-0 innerTab smallerHeight embed-responsive embed-responsive-16by9">
                   <EmbedTable queryId={"jAfuYkAWe2abi6lc0gw4kM"} />
                 </Container>
               </Col>
               <Col md={8}>
                 <Container fluid className="padding-0 innerTab middleHeight embed-responsive embed-responsive-16by9">
                   <TabbedVisualizations
                     dashboardId="Sb8HOOZshOqTzjZOiPuSmE"
                     dimensionToggleFields={dimensionToggleFields}
                   />
                 </Container>
               </Col>
             </Row>

             <Row className="mt-5">
               <Col md={4}>
                 <p className="mb-4">
                   If the message "Positive and Negative values in chart" appears,
                   use the <span className="highlight">Fast Change</span> chart to
                   review values.
                 </p>
                 <Container fluid className="padding-0 innerTab smallerHeight embed-responsive embed-responsive-16by9">
                   <EmbedTable queryId={"HV4C3OeDOr5HaceKseTybI"} />
                 </Container>
                 <Container fluid className="padding-0 innerTab smallerHeight embed-responsive embed-responsive-16by9">
                   <EmbedTable queryId={"84aPbSOrTsrbhF0ifL4zdI"} />
                 </Container>
               </Col>

               <Col md={8}>
                 <Container fluid className="padding-0 innerTab embed-responsive embed-responsive-16by9">
                   <TabbedVisualizations
                     dashboardId="rebecca_thompson_project::product_movement_report_tab"
                     dimensionToggleFields={dimensionToggleFields}
                   />
                 </Container>
               </Col>
             </Row>



                       <Modal show={show} onHide={handleClose} className="clearAllModal">
                             <Modal.Header closeButton>

                             </Modal.Header>
                             <Modal.Body><p>Are you sure you want to clear all selections?</p></Modal.Body>
                             <Modal.Footer>
                             <Button className="btn" onClick={handleUserYes}>
                               Yes
                             </Button>
                               <Button className="btn-clear" onClick={handleClose}>
                                 Cancel <i class="fas fa-ban stop"></i>
                               </Button>

                               </Modal.Footer>
                           </Modal>



        </>
      )}
    </Container>
  );
};

export default PurchasesReview;
