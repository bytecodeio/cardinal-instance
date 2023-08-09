import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";

export const CurrentSelection = ({
  selectedDateFilter,
  selectedFilters,
  filterOptions,
  fieldOptions,
  selectedFields,
  setSelectedFields,
  dateFilterOptions,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);

  useEffect(() => {
    let currentSelectionObj = {};
    // if (selectedDateFilter !== "") {
    //   // const optionDate = dateFilterOptions.find(optionDate => optionDate.name === selectedDateFilter[filter]);
    //   //
    //   // if(optionDate){
    //   //   currentSelectionObj[filter] = "Yes";
    //   // }
    //
    //   currentSelectionObj[selectedDateFilter] = "Yes";
    // }

    for (const filter in selectedFields) {
      if (selectedFields[filter] !== "") {
        const option1 = fieldOptions.find(
          (option1) => option1.name === selectedFields[filter]
        );

        if (option1) {
          currentSelectionObj[filter] = option1;
        }
        // currentSelectionObj[filter] = selectedFields[filter];
      }
    }

    // for (const filter in selectedFilters) {
    //   if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
    //     const optionFilter = filterOptions.find(
    //       (optionFilter) => optionFilter.name === selectedFilters[filter]
    //     );
    //
    //     if (optionFilter) {
    //       currentSelectionObj[filter] = optionFilter;
    //     }
    //
    //     // currentSelectionObj[filter] = selectedFilters[filter];
    //   }
    // }

    setCurrentSelection(currentSelectionObj);
  }, [

    selectedFields,
    fieldOptions,
    filterOptions,
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
      <h3 className="blue">Current Selections</h3>

  {console.log('fieldsOptions in Current ', fieldOptions)}

      <div className="wrapOptions">
        {Object.keys(currentSelection)?.map((selection) => {
          return (
            <div className="theOptions" key={selection}>
              <p className="mb-0">{currentSelection[selection].label_short}</p>

              <i
                onClick={() => removeField(currentSelection[selection].name)}
                className="fal fa-trash-undo red"
              ></i>
            </div>
          );
        })}
      </div>
    </>
  );
};
