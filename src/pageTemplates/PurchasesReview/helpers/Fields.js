import React from "react";
import { Form } from "react-bootstrap";

const Fields = ({
  fieldOptions,
  selectedFields,
  setSelectedFields,
  isDefault,
  updateBtn,
  setUpdateBtn,
}) => {
  function handleFieldSelection(fieldName) {
    setUpdateBtn(false);
    setSelectedFields((prev) => {
      if (prev.includes(fieldName)) {
        return prev.filter((selectedFilter) => selectedFilter !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });
  }

  return (
    <div className="wrapFilters">
      {fieldOptions.map((fieldOption) => (
        <div className="one" key={fieldOption.name}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption.label_short}
              checked={
                updateBtn
                  ? isDefault
                  : selectedFields.includes(fieldOption.name)
              }
              name="Fields"
              value={fieldOption.fields}
              onChange={() => handleFieldSelection(fieldOption.name)}
            />
          </Form.Group>
        </div>
      ))}
    </div>

    // set value to name
  );
};

export default Fields;
