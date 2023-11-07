import React, { useState, useEffect } from "react";

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
    if (selectedDateFilter !== "") {
      currentSelectionObj[selectedDateFilter] = "Yes";
    }

    for (const filter in selectedFields) {
      if (selectedFields[filter] !== "") {
        const option1 = fieldOptions.find(
          (option1) => option1.name === selectedFields[filter]
        );

        if (option1) {
          currentSelectionObj[filter] = option1;
        }
      }
    }

    for (const filter in selectedFilters) {
      if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        const option2 = filterOptions.find(
          (optionFilter) => option2.name === selectedFilters[filter]
        );

        if (option2) {
          currentSelectionObj[filter] = option2;
        }
      }
    }

    setCurrentSelection(currentSelectionObj);
  }, [
    selectedDateFilter,
    dateFilterOptions,
    selectedFilters,
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
