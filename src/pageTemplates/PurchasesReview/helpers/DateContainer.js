import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const DateContainer = ({
  setSelectedDateRangeStart,
  setSelectedDateRangeEnd,
  selectedDateRangeStart,
  selectedDateRangeEnd,
}) => {
  const onDateSelection = (e, type) => {
    if (type == "start") {
      setSelectedDateRangeStart(e.target.value);
    }
    if (type == "end") {
      setSelectedDateRangeEnd(e.target.value);
    }
  };

  return (
    <Row className="mt-3">
      <Col xs={12} md={7}>
        <p className="mt-0 mb-5">
          The <span className="highlight">Purchases Review Dashboard</span> is
          for consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
      </Col>
      <Col xs={12} md={5}>
        <div className="d-flex">
          <div className="columnStart mr2">
            <p className="small">Start Date</p>
            <Form.Control
              type="date"
              value={selectedDateRangeStart}
              onChange={(e) => onDateSelection(e, "start")}
            />
          </div>
          <div className="columnStart">
            <p className="small">End Date</p>
            <Form.Control
              type="date"
              value={selectedDateRangeEnd}
              onChange={(e) => onDateSelection(e, "end")}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DateContainer;
