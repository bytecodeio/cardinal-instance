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
import { LOOKER_MODEL, LOOKER_EXPLORE } from "../../utils/constants";
import { ExtensionContext } from "@looker/extension-sdk-react";
import InnerTableTabs from "../../components/InnerTableTabs";
import Fields from "./helpers/Fields";
import Filters from "./helpers/Filters";
import Rx from "./helpers/Rx";
import QuickFilter from "./helpers/QuickFilter";
import AccountGroups from "./helpers/AccountGroups";
import SearchAll from "./helpers/SearchAll";
import { DateFilterGroup } from "./helpers/DateFilterGroup";
import { CurrentSelection } from "./helpers/CurrentSelection";
import CurrentAccountGroup from "./helpers/CurrentAccountGroup";
import { DateRangeSelector } from "./helpers/DateRangeSelector";
import EmbedTable from "../../components/EmbedTable";
import { CurrentSelection2 } from "./helpers/CurrentSelection2";
import usePagination from "@mui/material/usePagination/usePagination";
import SearchAll2 from './helpers/SearchAll2'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { connection_columns } from "@looker/sdk";
import { EmbedContainer } from "../../components/EmbedContainer";

import { ApplicationContext } from "../../Main2";
const Template4 = ({
  currentNavTab,
  fields,
  setFields,
  properties,
  tabKey,
  config,
  description,
  isActive,
  tabFilters
}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  const wrapperRef = useRef(null);
  const [show3, setShow3] = useState();
  const [selectedFields, setSelectedFields] = useState([]);
  const defaultChecked = true;
  const [isDefaultProduct, setIsDefaultProduct] = useState(defaultChecked);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [currentInnerTab, setCurrentInnerTab] = useState(0);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [visList, setVisList] = useState([])
  const [isMounted, setIsMounted] = useState(false)
  const [selection, setSelection] = useState('');

  const [value, setValue] = useState(0);
  const [step, setStep] = useState(1);
  const [active, setActive] = useState(false);
  const [faClass, setFaClass] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [showMenu2, setShowMenu2] = useState();
  const [showMenu3, setShowMenu3] = useState();
  // const [choseClearAll, setChoseClearAll] = useState(defaultChosenValue);
  const [choseClearAll, setChoseClearAll] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);


  const params = useParams()
  
  const {filters,
    parameters,
    updateAppProperties,
    isFetchingLookmlFields,
    showMenu,
    setShowMenu,
    keyword,
    setKeyword,
    handleChangeKeyword,
    selectedFilters,
    setSelectedFilters,
    updatedFilters,
    setUpdatedFilters,
    initialLoad,
    setInitialLoad,
    application,
    savedFilters,
    removeSavedFilter,
    upsertSavedFilter} = useContext(ApplicationContext)

  useEffect(() => {
    if (params.path == tabKey) {
      if (!isMounted) {
        console.log("Mounting")
        console.log("application", application)
        try {
          fetchDefaultFieldsAndFilters();
          setIsMounted(true)
        } catch (e) {
          console.error("Error fetching default dashboard", e);
          setIsMounted(true)
        }
      } else {
        //handleTabVisUpdate();
      }
    }
  }, [currentNavTab]);

  // Fetch default selected fields and filters + query for embedded visualization from Looker dashboard on load
  const [isFetchingDefaultDashboard, setIsFetchingDefaultDashboard] =
    useState(true);

  const handleChangeSelection = (e) => {
    setSelection(e.target.value);
  }


  async function fetchDefaultFieldsAndFilters() {
    let _visList = []
    let index = 0
    for await (let visConfig of config) {
      const { dashboard_elements, dashboard_filters } = await sdk.ok(
        sdk.dashboard(visConfig['lookml_id'], 'dashboard_elements, dashboard_filters')
      )
      if (dashboard_elements.length > 0) {
        for await (let t of dashboard_elements) {
          let tileFilters = t['result_maker']['query']['filters'];
          let _tileFilterOptions = []
          let _selectedFilters = {}
          parameters?.map(p => {
            if (tileFilters) {
              Object.keys(tileFilters).map(key => {
                if (key === p.fields['name']) {
                  _selectedFilters[key] = tileFilters[key]
                  _tileFilterOptions.push({ 'name': p.fields['name'], options: p['value'] });
                };
              })
            }
          })

          console.log("filter options", _tileFilterOptions)
          let vis = {}
          console.log("selected tabs",selectedFilters)
          let { client_id } = t['result_maker']['query'];
          //let newClientId = await loadDefaultVisualizations(client_id, _selectedFilters)
          //console.log(newClientId)
          vis = {
            visId: visConfig['vis_name'],
            title: t['title'],
            query: client_id,
            default_fields: [...t.result_maker.query.fields],
            selected_fields: [...t.result_maker.query.fields],
            tileFilterOptions: _tileFilterOptions,
            localSelectedFilters: _selectedFilters,
            index: index++
          }
          _visList.push(vis)

          // if (initialLoad && i === 0) {
          //   //Finish default query
          //   console.log("dashboard element", t.result_maker.query.filters)
          //   setInitialLoad(false)
          // }
        }
      } else (setInitialLoad(false))

    }
    console.log("visList", _visList)
    setVisList(_visList)

    setSelectedFields(fields);
    setIsFetchingDefaultDashboard(false); 
    loadDefaults(_visList)
  }

  const loadDefaults = async (_visList) => {
    handleTabVisUpdate(_visList)
  }

  const loadDefaultVisualizations = async (clientId, localFilters) => {
    let _filters = formatFilters({...selectedFilters})
    const { vis_config, fields, model, view } = await sdk.ok(sdk.query_for_slug(clientId));

    const { client_id } = await sdk.ok(
      sdk.create_query({
        model: model,
        view: view,
        fields: fields,
        filters: _filters,
        vis_config,
      })
    );
    setUpdatedFilters({...selectedFilters})
    return client_id
  }

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

  const formatFilters = (filters) => {
    let filter = {}
    Object.keys(filters).map(key => {
      if (Object.keys(filters[key]).length > 0) {
        if (!(key == "date range" && Object.keys(filters['date filter']).length > 0)) {
          if (key === "date range") {
            let val = Object.keys(filters[key]);
            console.log(val)
            filters[key][val] = filters[key][val].replace("-","/");
            filter = {...filter, ...filters[key]}
          } else {
            filter = { ...filter, ...filters[key] }
          }          
        }
      }
    })
    return filter
  }

  // Handle run button click
  const handleTabVisUpdate = async (_visList = []) => {
    if (!Array.isArray(_visList)) {
      _visList = [...visList];
    }    
    console.log("visList", _visList)
    let currentVis = _visList.find(({ index }) => index === currentInnerTab)

    let _filters = {};
    _filters = await formatFilters(JSON.parse(JSON.stringify(selectedFilters)));
    setUpdatedFilters(JSON.parse(JSON.stringify(selectedFilters)))
    updateAppProperties(_filters)

    let newVisList = []
    for await (let vis of _visList) {
      const { vis_config, fields, model, view } = await sdk.ok(sdk.query_for_slug(vis['query']));

      let _fields = []
      if (vis['index'] === currentInnerTab) {
        _fields = currentVis['selected_fields']
      } else {
        _fields = fields
      }
      const { client_id } = await sdk.ok(
        sdk.create_query({
          model: model,
          view: view,
          fields: _fields,
          filters: vis['localSelectedFilters'] ? { ..._filters, ...vis['localSelectedFilters'] } : _filters,
          vis_config,
        })
      );
      vis['query'] = client_id
      newVisList.push(vis)
    }
    setIsFilterChanged(false);
    setVisList(newVisList)
  }

  const handleSingleVisUpdate = async (index) => {
    let _visList = [...visList];
    let currentVis = _visList.find(({ index }) => index === index)

    let _filters = {};
    _filters = await formatFilters(JSON.parse(JSON.stringify(updatedFilters)));
    console.log("currentvis", currentVis)
    _filters = { ..._filters, ...currentVis['localSelectedFilters'] }

    const { vis_config, fields, model, view } = await sdk.ok(sdk.query_for_slug(currentVis['query']));

    let _fields = []
    _fields = currentVis['selected_fields']

    const { client_id } = await sdk.ok(
      sdk.create_query({
        model: model,
        view: view,
        fields: _fields,
        filters: _filters,
        vis_config,
      })
    );
    currentVis['query'] = client_id
    setVisList(_visList)
  }





  async function doClearAll() {
    console.log("baba")
    setIsDefaultProduct(false);
    setUpdateButtonClicked(true);


    

    // setSelectedFilters([])
    // setSelectedAccountGroup([])

    // let tabs = [...tabList];
    //
    // let currentTab = tabs[currentInnerTab];
    // if (currentTab)
    //   currentTab["selected_fields"] = [];
    // setTabList(tabs);

    let filters = JSON.parse(JSON.stringify(selectedFilters));
    for (let name in filters) {
      if (name !== "date range")
        filters[name] = {};
    }
    setSelectedFilters(filters);
    setUpdatedFilters(filters)

    // setIsFilterChanged(true);
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

  $(document).on('click', function () {
    if ($('.theSelected').height() > 74.8) {
      $('.theSelected').addClass('theEnd').css({ 'maxHeight': '76px', "overflow": "hidden" })
      $('.hideThisEnd, .whiteBar').show()
    }
    else {
      $('.theSelected').removeClass('theEnd').css({ 'maxHeight': 'unset', "overflow": "unset" })
      $('.hideThisEnd, .whiteBar').hide()
    }

    $('#numberCounter').html($('.tab-pane.active .theSelected .theOptions').length + $('.tab-pane.active.show .theSelected .dateChoice').length)
  })
  $(window).resize(function () {
    $(document).trigger('click')
  });
  //jquery will be removed and changed, leave for now


  // const defaultChosenValue = localStorage.getItem('choseClearAll');
  // console.log('local storage value first', defaultChosenValue)
  //


  const handleUserYes = () => {
    // setChoseClearAll("1")
    // localStorage.setItem('choseClearAll', "1");
    doClearAll();
    // setShow(false);
    setShow(true)
  }



  const handleClearAll = () => {
    setShow(true)
    // if (defaultChosenValue == "1") {
    //   setShow(false)
    //   doClearAll();
    // } else {
    //   if(!choseClearAll) {
    //     setShow(true)
    //   } else {
    //     doClearAll();
    //   }
    // }
  }

  const slideIt2 = () => {
    setShowMenu2(!showMenu2)
  }

  const slideIt3 = () =>{
    setShowMenu3(!showMenu3)
  }
  // function handleFieldAll(value) {
  //   setSelectedAccountGroup(accountGroupOptions)
  // }
  //
  // function handleFieldsAll(value) {
  //   let tabs = [...tabList];
  //   tabs[currentInnerTab]['selected_fields'] = fieldOptions?.map(f => {return f['name']});
  //   setTabList(tabs)
  // }


  //for search

  // function getSelectedFilters() {
  //   if (selection !== "") {
  //     return filters.map(filter => {
  //       let values = {};
  //       Object.keys(filter.options.values).forEach(value => {
  //         if (filter.options.values[value] && filter.options.values[value].indexOf(selection) !== -1)
  //           values[value] = filter.options.values[value];
  //       })
  //       return {
  //         ...filter,
  //         options: {
  //           ...filter.options,
  //           values: values
  //         }
  //       };
  //     });
  //   }
  //   return filters;
  // }


  return (
    <div className={isActive ? "tab-pane active" : "hidden"}>

      <Container fluid>
        {isPageLoading ? (
          <Spinner />
        ) : (
          <>
            <div id="slideOut3" className={showMenu ? "" : "show3"} ref={wrapperRef}>
              <div className="slideOutTab3">
                <div id="one3" className="openTab bottomShadow" role="button" tabindex="0"
                  onClick={() => { setShowMenu(false); }}>
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
                      onClick={() => { setShowMenu(true); }}>
                      {/*onClick={() => setShow3(false)}>*/}
                      &#10005;
                    </Button>
                  </div>
                </div>
                <div className="modal-actions">
                  <div className="position-relative columnStart mb-3">
                    {/*<input value={keyword} onChange={() => {slideIt3(true);handleChangeKeyword();}} placeholder="" type="search" class="form-control" />*/}
                    {fields?.fields?.length > 0?
                    <SearchAll2
                      filters={filters.find(({ type }) => type === "filter")}
                      setSelectedFilters={setSelectedFilters}
                      selectedFilters={selectedFilters}
                      fieldOptions={fields.fields}
                      setTabList={setVisList}
                      tabList={visList.filter(({ visId }) => visId === "tabbedVis1")}
                      currentInnerTab={currentInnerTab}
                      updateBtn={updateButtonClicked}
                      selectedFields={selectedFields}
                      setSelectedFields={setSelectedFields}
                    />
                    : ''
                  }
                  </div>



                  <div className="across">
                    <Button onClick={handleClearAll} className="btn-clear">
                      Clear All
                    </Button>
                    <Button
                      onClick={handleTabVisUpdate}
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
                          {filters?.find(({ type }) => type === "account group")?.options?.values?.length > 0 ?
                            <Col xs={12} md={12}>
                              <Accordion.Item eventKey="1">
                                <Accordion.Header>Account Groups</Accordion.Header>
                                <Accordion.Body>
                                  <AccountGroups
                                    //fieldOptions={keyword !=="" ? accountGroupOptions.filter(option => option.indexOf(keyword)!== -1) : accountGroupOptions}
                                    fieldOptions={filters.find(({ type }) => type === "account group")}
                                    selectedFilters={selectedFilters}
                                    setSelectedFilters={setSelectedFilters}
                                  />
                                </Accordion.Body>
                              </Accordion.Item>
                            </Col>
                            : ''
                          }
                        </Row>
                      </Col> 
                    </Row>
                  </Accordion>
                </div>
              </div>
            </div>

            <Row className="fullW">


              <Col md={12} lg={12}>
                {/* Date Range Selector */}
                  <DateRangeSelector
                    dateFilter={filters.find(({ type }) => type === "date filter")}
                    dateRange={filters.find(({ type }) => type === "date range")}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    setUpdatedFilters={setUpdatedFilters}
                    handleTabVisUpdate={handleTabVisUpdate}
                    //currentInvoiceCount={properties.find(({ type }) => type === "total invoices")}
                    description={description}
                    application={application}
                  />
                {/*<DateFilterGroup
              dateFilterOptions={dateFilterOptions}
              setSelectedDateFilter={setSelectedDateFilter}
              selectedDateFilter={selectedDateFilter}
              />*/}
              </Col>

            </Row>

            <Row className="fullW d-flex align-items-center">
              <Col md={12} lg={2}>
                {properties?.find(({ group }) => group === "property") ?
                  <p>
                    <b>{properties?.find(({ group }) => group === "property").text}</b> <span className="highlight large">{Object.values(properties?.find(({ group }) => group === "property").value)}</span>
                  </p>
                  : ''
                }

              </Col>
              {/* <Col md={12} lg={3}>
              <div className="position-relative columnStart">
              <label>Search Filter</label>
                <input placeholder="" type="search" class="form-control" />
                <i class="far fa-search absoluteSearch"></i>
              </div>
            </Col>

            <Col md={12} lg={2}>

            <div className="position-relative columnStart">
            <label>Top % Products</label>

              <input  type="search" class="form-control" />

            </div>
            </Col> */}
            </Row>


            <Row className="fullW mt-5 position-relative">

              <Col xs={12} md={11}>


                <div className={toggle ? 'd-flex justify-content-start align-items-center flex-wrap theSelected slide-up' : 'd-flex justify-content-start align-items-center flex-wrap theSelected slide-down'}>

                  <p class="mr-3"><b>Current Selections:</b></p>
                  <CurrentSelection2
                    filters={filters}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    updatedFilters={updatedFilters}
                    setUpdatedFilters={setUpdatedFilters}
                    formatFilters={formatFilters}
                  />




                </div>
              </Col>
              <div className="hideThisEnd" onClick={handleClick}>
                <i className={faClass ? 'fas fa-plus-circle' : 'fas fa-minus-circle'}>&nbsp;
                  <span> {active ? "See Less" : "See All"} (<p id="numberCounter"></p>) </span></i>

              </div>
            </Row>
            <Row>
              <Col md={3}>
                {visList.find(({ visId }) => visId === "vis1")?
                  <div className="vis1-container h-50">
                    <EmbedContainer 
                      vis={visList.find(({ visId }) => visId === "vis1")}
                      visList={visList}
                      updateVisList={setVisList}
                      handleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.find(({ visId }) => visId === "vis2")?
                  <div className="vis1-container h-50">
                    <EmbedContainer 
                      vis={visList.find(({ visId }) => visId === "vis2")}
                      visList={visList}
                      updateVisList={setVisList}
                      handleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
              </Col>
              <Col md={9}>
                {visList.find(({ visId }) => visId === "vis3")?
                  <div className="vis1-container h-100">
                    <EmbedContainer 
                      vis={visList.find(({ visId }) => visId === "vis3")}
                      visList={visList}
                      updateVisList={setVisList}
                      handleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
              </Col>
            </Row>



            <Row className="mt-3 mb-3">
              <Col md={2}>
                {visList.find(({ visId }) => visId === "vis4")?
                  <div className="vis1-container h-50">
                    <EmbedContainer 
                      vis={visList.find(({ visId }) => visId === "vis4")}
                      visList={visList}
                      updateVisList={setVisList}
                      handleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
                {visList.find(({ visId }) => visId === "vis5")?
                  <div className="vis1-container h-50">
                    <EmbedContainer 
                      vis={visList.find(({ visId }) => visId === "vis5")}
                      visList={visList}
                      updateVisList={setVisList}
                      handleVisUpdate={handleSingleVisUpdate}
                    />
                  </div>:''}
              </Col>
              <Col md={10} className="embed-responsive embed-responsive-16by9">
                {visList.filter(({ visId }) => visId === "vis6").length > 0 ?
                  <InnerTableTabs
                    tabs={visList.filter(({ visId }) => visId === "vis6")}
                    setSelectedFields={setSelectedFields}
                    currentInnerTab={currentInnerTab}
                    setCurrentInnerTab={setCurrentInnerTab}
                    setVisList={setVisList}
                    visList={visList}
                    handleSingleVisUpdate={handleSingleVisUpdate}
                  />
                  : ''
                }

              </Col>
            </Row>

            <Modal show={show} onHide={handleClose} className="clearAllModal">
              <Modal.Header closeButton>

              </Modal.Header>
              <Modal.Body><p>Are you sure you want to clear all selections?</p></Modal.Body>
              <Modal.Footer>
                <Button className="btn" onClick={() => { handleUserYes(); handleClose() }}>
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
    </div>
  );
};

export default Template4;
