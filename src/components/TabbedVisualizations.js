import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import EmbedTable from "./EmbedTable";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { useLookerQuery } from "../hooks/useLookerQuery";
import styled from "styled-components";

const ToggleButtonGroup = styled(ButtonGroup)`
  min-width: inherit;
`;

// Use &&& to increase specificity to override some styles in src/styles.css
// https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
const ToggleButton = styled(Button)`
  &&& {
    min-width: fit-content;
    padding: 0px 10px;
    height: fit-content;
  }
  &&&:hover {
    background-color: #dbedf4;
  }
`;

const DimensionToggle = ({ handleToggle, options }) => {
  return (
    <ToggleButtonGroup>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          onClick={() => handleToggle(option.value)}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const Visualization = ({ dimensionToggleFields, tab }) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [queryId, setQueryId] = useState(tab.query);
  const [queryBody, setQueryBody] = useState();

  // Dimension Toggle
  const { getQueryBodyForSlug } = useLookerQuery();
  const dimensionToggle = {};
  dimensionToggle.tag = Object.keys(dimensionToggleFields).find((tag) =>
    tag.toLowerCase().endsWith(tab.title.toLowerCase())
  );
  dimensionToggle.field = dimensionToggleFields[dimensionToggle.tag]?.[0];
  dimensionToggle.options = dimensionToggle.field?.enumerations;

  async function handleDimensionToggle(newValue) {
    setIsLoading(true);
    const newQueryBody = queryBody
      ? { ...queryBody }
      : await getQueryBodyForSlug(queryId);

    if (!newQueryBody.filters) {
      newQueryBody.filters = {};
    }
    newQueryBody.filters[dimensionToggle.field.name] = newValue;
    const { client_id } = await sdk.ok(sdk.create_query(newQueryBody));
    setQueryId(client_id);
    setQueryBody(newQueryBody);
    setIsLoading(false);
  }

  return (
    <>
      {!!dimensionToggle.tag && (
        <DimensionToggle
          handleToggle={handleDimensionToggle}
          options={dimensionToggle.options}
        />
      )}
      {isLoading ? <Spinner /> : <EmbedTable queryId={queryId} />}
    </>
  );
};

const TabbedVisualizations = ({ dashboardId, dimensionToggleFields }) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  const [tabs, setTabs] = useState([]);
  const [error, setError] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVisualizationsFromDashboard() {
      const { dashboard_elements } = await sdk.ok(
        sdk.dashboard(dashboardId, "dashboard_elements")
      );

      // Throw error if no dashboard elements were returned
      if (!dashboard_elements?.length) {
        throw new Error(
          "No elements returned from dashboard. The tabbed visualizations requires a dashboard with one or more elements."
        );
      }

      // Throw error if dashboard elements have duplicate titles
      const hasTilesWithDuplicateTitles =
        dashboard_elements.length !== new Set(dashboard_elements).size;
      if (hasTilesWithDuplicateTitles) {
        throw new Error(
          "Dashboard has tiles with duplicate titles. The tabbed visualizations requires each dashboard tile to have a unique title."
        );
      }

      const _tabs = dashboard_elements.map((tile) => ({
        title: tile.title,
        query: tile.result_maker.query.client_id,
      }));

      setTabs(_tabs);
      setSelectedTabIndex(0);
      setIsLoading(false);
    }

    try {
      fetchVisualizationsFromDashboard();
    } catch (error) {
      setError(error.message);
      console.error(
        "Error fetching tabbed visualizations from dashboard",
        error
      );
    }
  }, []);

  const handleTabChange = (event) => {
    setSelectedTabIndex(event);
  };

  return (
    <Container fluid className="padding-0">
      <Container fluid className="padding-0 innerTab">
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Tabs
            className="inner"
            fill
            activeKey={selectedTabIndex}
            onSelect={handleTabChange}
          >
            {tabs?.map((tab, i) => {
              return (
                <Tab key={tab.title} eventKey={i} title={tab.title}>
                  <Visualization
                    dimensionToggleFields={dimensionToggleFields}
                    tab={tab}
                  />
                </Tab>
              );
            })}
          </Tabs>
        )}
      </Container>
    </Container>
  );
};

export default TabbedVisualizations;
