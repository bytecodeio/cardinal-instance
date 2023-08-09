import React from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
} from "react-bootstrap";

function HowTo() {
  return (
    <div>
      <h5 className="mt-3">Bookmarks</h5>
      <p>
        Bookmarks enable the user to create Favorite reports and save for future
        reference. Saved reports will capture the fields and filters established
        by the user. Bookmarks can include the report title and a user specified
        descriptor for easy reference.
      </p>

      <Accordion defaultActiveKey={0} className="mt-3 mb-3">
        <Accordion.Item eventKey="4" disabled>
          <Accordion.Header>Bookmarks</Accordion.Header>
          <Accordion.Body></Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <h5 className="mt-3">Search</h5>
      <p>
        Begin typing in the search object. Please hit enter to search its value.
      </p>

      <input
        placeholder="Search Report"
        type="search"
        className="form-control mt-2 "
      />

      <h5 className="mt-3">Date Ranges</h5>
      <p>
        Date Ranges can be selected by selecting the preset buttons. An active
        blue designates the selected date button. Input your own date selections
        using the From & To fields.
      </p>

      <div className="grid2 mt-3">
      <div className="one radio">
      <Form.Group  controlId="formBasicCheckbox15">
        <Form.Check  type="radio" label="MTD" name="filters" />
      </Form.Group>
    </div>

    <div className="one radio">
      <Form.Group controlId="formBasicCheckbox17">
        <Form.Check type="radio" label="QTD" name="filters"/>
      </Form.Group>
    </div>


   <div className="one radio">
     <Form.Group controlId="formBasicCheckbox19">
       <Form.Check type="radio" label="YTD" name="filters"/>
     </Form.Group>
   </div>
      </div>

      <h5 className="mt-3">Make a Selection</h5>
      <p>
        To make a selection in Filters, choose from the dropdown. To make a
        selection in Fields, check or uncheck the checkboxes you want. Note:
        most selections will apply to all tabs within the application.
      </p>

      <Row className="mt-2">
        <Col md={6}>
          <Form.Select aria-label="Default select example">
            <option>Example</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <div className="one">
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Taxes & Fees" />
            </Form.Group>
          </div>
        </Col>
      </Row>

      <h5 className="mt-3">Add/Remove</h5>
      <p>
        To add or remove a selection from the report, you may uncheck a Field or
        change the Filters dropdown back to "N/A". You can select the Restore
        Defualt button to restore the report back to its default selections.
      </p>

      <Button className="btn-clear mt-3">
        Restore Default <i className="fal fa-undo"></i>
      </Button>

      <h5 className="mt-3">Clear Selections</h5>
      <p>
        To clear selections on a specified field, select the X icon.

      </p>

      <Col md={4}>
        <div class="theOptions">
        <p class="mb-0 blue">Strength</p><i class="fal fa-times blue"></i>
        </div>
      </Col>

      <p className="mt-3">
        To clear all selections, select the "Clear All" button.
      </p>

      <Button className="btn mt-3">Clear All</Button>
    </div>
  );
}

export default HowTo;
