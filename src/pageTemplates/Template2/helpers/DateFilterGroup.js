import React from "react";
import { Row, Col, Form } from "react-bootstrap";

export const DateFilterGroup = ({
  dateFilterOptions,
  setSelectedDateFilter,
  selectedDateFilter,
}) => {
  const handleSelection = (e) => {
    setSelectedDateFilter(e.target.id);
  };

  return (
    <Row>
      <Col xs={12} md={7}></Col>
      <Col xs={12} md={5}>
        <div className="grid2 mneg40">

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
    </Row>
  );
};
