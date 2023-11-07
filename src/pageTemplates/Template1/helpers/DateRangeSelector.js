import React from "react";
import DatePicker from "react-datepicker";
import { Form, Row, Col, Button, Container } from "react-bootstrap";


export const DateRangeSelector = ({
  setSelectedDateRange,
  selectedDateRange,
  setSelectedDateFilter,
  handleClearAll,
  handleTabVisUpdate,
  dateFilterOptions,
  selectedDateFilter,
  currentInvoiceCount,
  description
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


  // console.log(selectedDateRange)


  return (
  <Container fluid className="padding-0">
    <Row className="fullW mb-1">
      <Col md={12} lg={4}>

        <p className="mt-0 mb-2 mediumFont">
        {description?.description}
        </p>
        </Col>

        <Col md={12} lg={4}>

                <div className="grid2">

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

      <Col md={12} lg={4}>

        <div className="d-flex mt-1 ml2">

          <div className="columnStart mr2">
            <label>Start Date</label>
            <Form.Control
            type="date"
            value={splitSelectedDateRange()[0]}
            onChange={(e) => onDateSelection(e, "start")}

            />

          </div>
          <div className="columnStart">
            <label>End Date</label>
            <Form.Control
            type="date"
            value={splitSelectedDateRange()[1]}
            onChange={(e) => onDateSelection(e, "end")}
            />

          </div>


        </div>
      </Col>
    </Row>


    <Row className="fullW bottom d-flex align-items-center">
      <Col md={12} lg={8}>


    </Col>

  </Row>

  <Row className="fullW mt-3 position-relative">

    <Col xs={12} md={12} className="position-relative">

      <div className="d-flex justify-content-end endAbsolute">


        <Button
        onClick={handleTabVisUpdate}
        className="btn">Update Dates
      </Button>
    </div>
  </Col>
</Row>


</Container>
);
};
