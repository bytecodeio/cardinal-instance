import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";
import * as $ from "jquery";
import moment from "moment";

export const CurrentSelection = ({
  selectedDateFilter,
  selectedFilters,
  setSelectedFilters,
  filterOptions,
  fieldOptions,
  selectedFields,
  setSelectedFields,
  dateFilterOptions,
  setSelectedDateRange,
  selectedDateRange,
  setSelectedDateFilter,
  quickFilterOptions,
}) => {
  const [currentSelection, setCurrentSelection] = useState([]);
  const [filterSelection, setFilterSelection] = useState([]);

  useEffect(() => {
    let currentSelectionObj = {};
    if (selectedDateFilter !== "") {
      const option3 = dateFilterOptions.find(
        (option3) => option3.name === selectedDateFilter
      );
      if (option3) {
        currentSelectionObj[selectedDateFilter] = option3;
      }

      // currentSelectionObj[selectedDateFilter] = 'Yes'
    }

    let filterObj = {};
    for (let key in selectedFilters) {
      const option = filterOptions.find((option3) => option3.name === key);

      if (option && selectedFilters[key] !== "N/A") {
        filterObj[option.label_short] = {
          value: selectedFilters[key],
          name: key,
        };
      }
    }
    setFilterSelection(filterObj);

    // for (const filter in selectedFields) {
    //     if (selectedFields[filter] !== "") {
    //       const option1 = quickFilterOptions.find(option1 => option1.name === selectedFields[filter]);
    //
    //       if(option1){
    //         currentSelectionObj[filter] = option1;
    //       }
    //         // currentSelectionObj[filter] = selectedFields[filter];
    //     }
    //
    //         // console.log("one", selectedFields)
    // }

    //   for (const filter in selectedFilters) {
    //
    //
    //         if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
    //         const option1 = filterOptions.find(option1 => option1.name === selectedFilters[filter]);
    //
    //         if(option1){
    //           currentSelectionObj[filter] = option1;
    //         }
    //
    //       // if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
    //       //     currentSelectionObj[filter] = selectedFilters[filter];
    //       // }
    //   }
    //
    // }

    setCurrentSelection(currentSelectionObj);
  }, [
    selectedDateFilter,
    dateFilterOptions,
    selectedFilters,
    selectedFields,
    fieldOptions,
    filterOptions,
    setSelectedDateRange,
    selectedDateRange,
    quickFilterOptions,
  ]);

  function removeField(fieldName) {
    setSelectedFilters((prev) => {
      let newObj = {};
      for (const name in prev) {
        if (name !== fieldName) {
          newObj[name] = prev[name];
        } else {
          newObj[name] = "N/A";
        }
      }
      return newObj;
    });
    // setSelectedFields((prev) => {
    //   return prev.filter(field !== fieldName)
    // })
  }

  //
  // selectedDateRange && selectedDateRange.split().map((selection) => {
  //   console.log(selection)
  //
  //
  //
  //  })

  const first = selectedDateRange.split(" to ")[0];
  const last = selectedDateRange.split(" to ")[1];

  const format2 = moment(last).format("MM-DD-YYYY").toString();

  const format1 = moment(first).format("MM-DD-YYYY").toString();

  return (
    <>
      <h3 className="blue strong mt-3">Current Selections</h3>
      <div className="d-flex flex-column">
        {Object.keys(currentSelection).length > 0 ? (
          <div className="mb-1">
            {Object.keys(currentSelection)?.map((selection) => {
              return (
                <div className="dateChoice short" key={selection}>
                  {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
                  <p className="mb-0 blue">
                    {currentSelection[selection].label_short.replace(
                      /\s*\(.*?\)\s*/g,
                      ""
                    )}
                  </p>

                  <i
                    onClick={() => removeField(filterSelection[selection].name)}
                    class="fal fa-times blue"
                  ></i>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dateChoice mb-1">
            <p className="mb-0 blue">
              {format1} to {format2}
            </p>

            {/*}{selectedDateRange && selectedDateRange.split().map((selection) => {
           return(
          <p className="mb-0 blue">{selection}</p>

           )
         })}*/}
          </div>
        )}
        <div class="wrapOptions">
          {Object.keys(filterSelection)?.map((selection) => {
            return (
              <div className="theOptions" key={selection}>
                {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
                <p className="mb-0 blue">
                  {selection.replace(/\s*\(.*?\)\s*/g, "")}:{" "}
                  {filterSelection[selection].value}
                </p>

                <i
                  onClick={() => removeField(filterSelection[selection].name)}
                  class="fal fa-times blue"
                ></i>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
