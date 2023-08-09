import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";
import * as $ from "jquery";
import moment from 'moment';

export const CurrentSelection = ({ selectedDateFilter, selectedFilters, setSelectedFilters, filterOptions, fieldOptions, selectedFields, setSelectedFields, dateFilterOptions, setSelectedDateRange, selectedDateRange, setSelectedDateFilter, quickFilterOptions, selectedQuickFilter, setSelectedQuickFilter }) => {
  const [currentSelection, setCurrentSelection] = useState([])
  const [filterSelection, setFilterSelection] = useState([])
  const [quickFilterSelection, setQuickFilterSelection] = useState([])

  useEffect(() => {
    let currentSelectionObj = {};
    if (selectedDateFilter !== "") {
      const option3 = dateFilterOptions.find(option3 => option3.name === selectedDateFilter);
        if(option3){
        currentSelectionObj[selectedDateFilter] = option3;
      }

      // currentSelectionObj[selectedDateFilter] = 'Yes'
    }

    let filterObj = {};
    for(let key in selectedFilters) {
      const option = filterOptions.find(option3 => option3.name === key);

      if(option && selectedFilters[key] !== 'N/A'){
        filterObj[option.label_short] = {value: selectedFilters[key], name: key};
      }
    }
    setFilterSelection(filterObj)

    let quickFilterObj = {};
    for(let key in selectedQuickFilter) {
      const option = quickFilterOptions.find(option3 => option3.name === key);

      if(option && selectedQuickFilter[key] !== 'N/A'){
        quickFilterObj[option.label] = {value: selectedQuickFilter[key], name: key};
      }
    }
    setQuickFilterSelection(quickFilterObj)



    setCurrentSelection(currentSelectionObj)
  },[selectedDateFilter, dateFilterOptions, selectedFilters, selectedFields, fieldOptions, filterOptions, setSelectedDateRange, selectedDateRange, quickFilterOptions, selectedQuickFilter, setSelectedQuickFilter])

  function removeField(fieldName) {
    setSelectedFilters((prev) => {
      let newObj = {};
      for(const name in prev){
        if(name !== fieldName) {
          newObj[name] = prev[name];
        } else {
          newObj[name] = 'N/A';
        }
      }
      return newObj;
    });
  }

  function removeQuickField(fieldName) {
    setSelectedQuickFilter((prev) => {
      let newObj = {};
      for(const name in prev){
        if(name !== fieldName) {
          newObj[name] = prev[name];
        } else {
          newObj[name] = 'N/A';
        }
      }
      return newObj;
    });
  }



const first = selectedDateRange.split(" to ")[0]
const last = selectedDateRange.split(" to ")[1]

const format2 = moment(last).format('MM-DD-YYYY').toString();

const format1 = moment(first).format('MM-DD-YYYY').toString();

console.log('currentSelection', currentSelection)


  return (


<div className="d-flex">
<div>
    {

      Object.keys(currentSelection).length > 0 ? (
        <div>

          {Object.keys(currentSelection)?.map((selection) => {
            return(
              <div className="dateChoice short" key={selection}>

                <p className="mb-0 blue"><i class="fal fa-calendar-check"></i> {format1} to {format2}</p>

              </div>

            )
          })}

          </div>

      ) : (



      <div className="dateChoice">

        <p className="mb-0 blue"><i class="fal fa-calendar-check"></i> {format1} to {format2}</p>

      </div>

      )

    }

</div>

    <div className="d-flex">



        {Object.keys(quickFilterSelection)?.map((selection) => {

          return(
            <div className="theOptions" key={selection}>
            {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
            <p className="mb-0 blue">

            {quickFilterSelection[selection].value}</p>

            <i onClick={() => removeQuickField(quickFilterSelection[selection].name)} class="fal fa-times blue"></i>

            </div>

          )
        })}




    {Object.keys(filterSelection)?.map((selection) => {

      return(
        <div className="theOptions" key={selection}>
        {/*<p className="mb-0">{currentSelection[selection]}</p>*/}
        <p className="mb-0 blue">{selection.replace(/\s*\(.*?\)\s*/g, '')}: {filterSelection[selection].value}</p>

        <i onClick={() => removeField(filterSelection[selection].name)} class="fal fa-times blue"></i>

        </div>

      )
    })}

  </div>

</div>

  )
}
