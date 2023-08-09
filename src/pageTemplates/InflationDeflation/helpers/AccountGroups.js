import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const AccountGroups = ({
  fieldOptions,
  setSelectedAccountGroup,
  selectedAccountGroup
}) => {
  function handleFieldSelection(value) {
    setSelectedAccountGroup((prev) => {
      if (prev.includes(value)) {
        return prev.filter((selectedFilter) => selectedFilter !== value);
      } else {
        return [...prev, value];
      }
    });
  }


  
  // console.log("these are fields", fieldOptions)
  return (
    <div className="wrapFilters">
      {fieldOptions.map((fieldOption) => (
        <div className="one" key={fieldOption}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption}
              checked={selectedAccountGroup.includes(
                fieldOption
              )}
              name="Fields"
              id={fieldOption}
              value={fieldOption}
              onChange={() => handleFieldSelection(fieldOption)}
            />
          </Form.Group>
        </div>
      ))}
    </div>

    // set value to name
  );
};

export default AccountGroups;
