import React, { useState, useCallback, useContext, useEffect } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

const DateContainer = () => {
  return (
    <Row className="mt-3">
      <Col xs={12} md={7}>
        <p className="mt-0 mb-5">
          The <span className="highlight">Product Movement Dashboard</span> is
          for consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
      </Col>
      <Col xs={12} md={5}>
        <div className="d-flex">
          <div className="columnStart mr2">
            <p className="small">Start Date</p>
            <Form.Control type="date" />
          </div>
          <div className="columnStart">
            <p className="small">End Date</p>
            <Form.Control type="date" />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DateContainer;
