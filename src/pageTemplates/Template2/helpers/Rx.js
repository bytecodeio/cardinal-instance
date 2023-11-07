import React from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

const Rx = () => {
  const Content = [
    {
      controlId: "formBasicCheckbox",
      label: "Rx",
    },
    {
      controlId: "formBasicCheckbox2",
      label: "Brand",
    },
    {
      controlId: "formBasicCheckbox3",
      label: "On Contract",
    },
    {
      controlId: "formBasicCheckbox4",
      label: "Controlled",
    },
    {
      controlId: "formBasicCheckbox5",
      label: "Source",
    },
    {
      controlId: "formBasicCheckbox6",
      label: "SPX",
    },

    {
      controlId: "formBasicCheckbox7",
      label: "Speciality",
    },
    {
      controlId: "formBasicCheckbox8",
      label: "Non-Rx",
    },
    {
      controlId: "formBasicCheckbox9",
      label: "Generic",
    },
    {
      controlId: "formBasicCheckbox10",
      label: "Off Contract",
    },
    {
      controlId: "formBasicCheckbox11",
      label: "Non-Controlled",
    },
    {
      controlId: "formBasicCheckbox12",
      label: "Non-SOURCE",
    },
    {
      controlId: "formBasicCheckbox13",
      label: "Non-SPX",
    },
    {
      controlId: "formBasicCheckbox14",
      label: "Purchases",
    },
  ];

  return (
    <div className="wrapFields">
      {Content.map((val, i) => (
        <div className="one" key={val.controlId}>
          <Form.Group controlId={val.controlId}>
            <Form.Check type="checkbox" label={val.label} />
          </Form.Group>
        </div>
      ))}
    </div>
  );
};

export default Rx;
