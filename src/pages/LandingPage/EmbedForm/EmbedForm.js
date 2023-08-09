import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import SideForm from "./nav/Form.js";
import TopNav from "./nav/TopNav.js";
import ProductMovement from "./ProductMovement/ProductMovement";
import PurchasesReview from "./PurchasesReview/PurchasesReview";
import InvoiceReport from "./InvoiceReport/InvoiceReport";
import AutoSub from "./AutoSub/AutoSub";
import InflationDeflation from "./InflationDeflation/InflationDeflation";
import ToTopButton from "./ToTopButton.js";
import NavbarMain from "./NavbarMain";
import Footer from "./Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
} from "../../../utils/constants";

import { sortDateFilterList } from "../../../utils/globalFunctions";

export const EmbedForm = () => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  //Create states for global variables
  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState();

  const [productMovementFields, setProductMovementFields] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [dateFilterOptions, setDateFilterOptions] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [showMenu, setShowMenu] = useState();

  const slideIt = () => {
    setShowMenu(!showMenu);
  };

  // Initialize the states
  useEffect(() => {
    function groupFieldsByTags(fields) {
      const fieldsByTag = {};
      fields.forEach((field) => {
        field.tags.forEach((tag) => {
          if (fieldsByTag[tag] === undefined) {
            fieldsByTag[tag] = [field];
          } else {
            fieldsByTag[tag].push(field);
          }
        });
      });
      return fieldsByTag;
    }

    const fetchLookmlFields = async () => {
      const {
        fields: { dimensions, filters, measures },
      } = await sdk.ok(
        sdk.lookml_model_explore(LOOKER_MODEL, LOOKER_EXPLORE, "fields")
      );

      const lookmlFields = [...dimensions, ...filters, ...measures];
      const fieldsByTag = groupFieldsByTags(lookmlFields);

      const _filterOptions = fieldsByTag[LOOKML_FIELD_TAGS.filter];
      const _dateFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.date_filter];

      const _productMovementfieldOptions =
        fieldsByTag[LOOKML_FIELD_TAGS.productMovementField];

      const _dateRange = fieldsByTag[LOOKML_FIELD_TAGS.dateRange];

      const defaultFilterSelections = Object.fromEntries(
        _filterOptions.map((filter) => [filter.name, "N/A"])
      );

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

      setFilterOptions(_filterOptions);
      setProductMovementFields(_productMovementfieldOptions);
      setDateFilterOptions(sortDateFilterList(_dateFilterOptions));
      setSelectedFilters(defaultFilterSelections);
      setDateRange(_dateRange[0]);
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

  const getValues = (dimension) => {
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: dimension[0]["view"],
          fields: [dimension[0]["name"]],
        },
      })
    );
  };

  return (
    <>
      <NavbarMain />

      <Container fluid className="mt-50 padding-0 position-relative">
        <TopNav />

        <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
          <div id="nav2">
            <Tabs
              defaultActiveKey={currentNavTab}
              onSelect={(k) => setCurrentNavTab(k)}
              className="mb-0"
              fill
            >
              <Tab eventKey="dashboard" title="Purchases Review">
                <PurchasesReview
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                />
              </Tab>

              <Tab eventKey="product-movement" title="Product Movement Report">
                <ProductMovement
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
                  slideIt={slideIt}
                />
              </Tab>
              <Tab eventKey="invoice" title="Invoice Report">
                <InvoiceReport
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                />
              </Tab>
              <Tab eventKey="auto-sub" title="Auto-Sub Report">
                <AutoSub
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                />
              </Tab>
              <Tab eventKey="id" title="Inflation/Deflation Report">
                <InflationDeflation
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
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
