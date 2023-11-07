import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";

const CurrentAccountGroup = ({
  selectedDateFilter,
  selectedFilters,
  filterOptions,
  fieldOptions,
  selectedFields,
  setSelectedFields,
  dateFilterOptions,
  setSelectedAccountGroup,
  selectedAccountGroup
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);

  useEffect(() => {
    let currentSelectionObj = {};

    for (const filter in selectedAccountGroup) {
      if (selectedAccountGroup[filter] !== "") {
        const option1 = fieldOptions.find(
          (option1) => option1.name ===  selectedAccountGroup[filter]
        );

        if (option1) {
          currentSelectionObj[filter] = option1;
        }
      }
    }

    setCurrentSelection(currentSelectionObj);
  }, [

    fieldOptions,
    setSelectedAccountGroup,
    selectedAccountGroup
  ]);

  function removeAccount(fieldName) {
    setSelectedAccountGroup((prev) => {
      if (prev.includes(fieldName)) {
        return prev.filter((selectedFilter) => selectedFilter !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });

  }

  return (
    <>
      <div className="wrapOptions">
        {Object.keys(selectedAccountGroup)?.map((selection) => {
          return (
            <div className="theOptions" key={selection}>
              <p className="mb-0 blue">{selectedAccountGroup[selection]}</p>
              <i
                onClick={() => removeAccount(selectedAccountGroup[selection])}
                className="fal fal fa-times blue"
              ></i>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CurrentAccountGroup;
