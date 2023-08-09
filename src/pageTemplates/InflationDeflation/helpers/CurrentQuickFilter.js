import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";

export const CurrentQuickFilter = ({ selectedDateFilter, selectedFilters, setSelectedFilters, filterOptions, fieldOptions, selectedFields, setSelectedFields, dateFilterOptions, setSelectedDateRange, selectedDateRange, setSelectedDateFilter, quickFilterOptions }) => {
  const [currentSelection, setCurrentSelection] = useState([])
  const [filterSelection, setFilterSelection] = useState([])


  useEffect(() => {
    let currentSelectionObj = {};

    for (const filter in selectedFields) {
      if (selectedFields[filter] !== "") {
        const option1 = quickFilterOptions?.find(
          (option1) => option1.name === selectedFields[filter]
        );

        if (option1) {
          currentSelectionObj[filter] = option1;
        }
        // currentSelectionObj[filter] = selectedFields[filter];
      }
    }

    setCurrentSelection(currentSelectionObj);
  }, [selectedFields, fieldOptions, filterOptions, quickFilterOptions
  ]);

  function removeField(fieldName) {
    setSelectedFields((prev) => {
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
        {Object.keys(currentSelection)?.map((selection) => {
          return (
            <div className="theOptions" key={selection}>
              <p className="mb-0 blue">{currentSelection[selection].label_short}</p>

              

              <i onClick={() => removeField(currentSelection[selection].name)} class="fal fa-times blue"></i>
            </div>
          );
        })}
      </div>
    </>
  );
};
