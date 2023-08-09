import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import EmbedTable from "./EmbedTable";

const InnerTableTabs = ({
  tabs,
  setSelectedFields,
  currentInnerTab,
  setCurrentInnerTab,
}) => {
  const handleTabChange = (event) => {
    setCurrentInnerTab(event);
    setSelectedFields(tabs[event]["selected_fields"]);
  };

  return (
    <Container fluid className="padding-0">
      <Container fluid className="padding-0 innerTab">
        <Tabs
          className="inner"
          fill
          activeKey={currentInnerTab}
          onSelect={(e) => handleTabChange(e)}
        >
          {tabs?.map((t, i) => (
            <Tab eventKey={i} title={t.title} key={t.title}>
              <EmbedTable queryId={t["query"]} />
            </Tab>
          ))}
        </Tabs>
      </Container>
    </Container>
  );
};

export default InnerTableTabs;
