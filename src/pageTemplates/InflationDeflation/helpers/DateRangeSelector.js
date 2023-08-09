import React from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";

import DateFilterGroup from  "./DateFilterGroup.js";

export const DateRangeSelector = ({
  setSelectedDateRange,
  selectedDateRange,
  setSelectedDateFilter,
  handleClearAll,
  handleTabVisUpdate,
  dateFilterOptions,
  selectedDateFilter,
}) => {
  const onDateSelection = (e, type) => {
    if (type == "start") {
      let splitDate = splitSelectedDateRange();
      splitDate[0] = e.target.value;
      setSelectedDateRange(splitDate.join(" to "));
    }
    if (type == "end") {
      let splitDate = splitSelectedDateRange();
      splitDate[1] = e.target.value;
      setSelectedDateRange(splitDate.join(" to "));
    }
    setSelectedDateFilter("");
  };

  const splitSelectedDateRange = () => {
    if (selectedDateRange) {
      return selectedDateRange.split(" to ");
    }
    return ["", ""];
  };


  const handleSelection = (e) => {
    setSelectedDateFilter(e.target.id);
  };


  console.log(selectedDateRange)


  return (
    <Container>
    <Row className="fullW mt-3">
    <Col md={12} lg={9}>

    <p className="mt-0 mb-2 mediumFont">
    The <span className="highlight">Product Movement Dashboard</span> allows viewing of top-moving products for a single account in
    descending order by units, filtering for controlled substances, and
    filtering by type or customize your report with over 40 available
    fields.
    </p>

    </Col>

    <Col md={12} lg={3}>

    <div className="buttons across">


      <Button
      onClick={handleTabVisUpdate}
      className="btn">Update
      </Button>
    </div>

    </Col>
    </Row>

    <Row className="fullW bottom">
    <Col xs={12} md={7}>


      <div className="grid2 mt-3">



      {dateFilterOptions?.map(filter => {
        return (

          <div className="one radio">
          <Form.Group
          controlId={filter['name']}>
            <Form.Check
            checked={selectedDateFilter === filter['name']}
            id={filter['name']}
            value={filter['name']}
            type="radio"
            // name="dateFilters"
            onChange={handleSelection}
            label={filter['label_short'].replace('(Yes / No)','')}
            />

        </Form.Group>
        </div>

      )
    })}


    </div>

    </Col>
    <Col xs={12} md={5}>
    <div className="d-flex ml2">
        <div className="columnStart mr2">
          <p className="small">Start Date</p>
          <Form.Control
          type="date"
          value={splitSelectedDateRange()[0]}
          onChange={(e) => onDateSelection(e, "start")}
          />
        </div>
        <div className="columnStart">
          <p className="small">End Date</p>
          <Form.Control
          type="date"
          value={splitSelectedDateRange()[1]}
          onChange={(e) => onDateSelection(e, "end")}
          />
        </div>
    </div>
    </Col>
    </Row>


    </Container>
  );
};
