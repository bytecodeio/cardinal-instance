import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";
import * as $ from "jquery";
import moment from 'moment';

export const CurrentSelection = ({ filters, selectedFilters, setSelectedFilters }) => {
  const [currentSelection, setCurrentSelection] = useState([])

  useEffect(() => {
    console.log(selectedFilters)
    let current = []
    Object.keys(selectedFilters).map(key => {
      if (Object.keys(selectedFilters[key]).length > 0) {
        let filter = filters.find(({ type }) => type === key);
        Object.keys(selectedFilters[key]).map(row => {
          if (filter.type === "date range") {
            current.splice(0, 0, selectedFilters[key][row])
          } else {
            let field = filter.fields.find(({ name }) => name === row)
            current.push(`${field.label_short}: ${selectedFilters[key][row]}`)
          }
        })
        console.log("selected", filters)
      }
    })
    setCurrentSelection(current)
  }, [selectedFilters])

  function removeField(fieldName) {
    setSelectedFilters((prev) => {
      let newObj = {};
      for (const name in prev) {
        if (name !== fieldName) {
          newObj[name] = prev[name];
        } else {
          newObj[name] = 'N/A';
        }
      }
      return newObj;
    });
  }

  // const first = selectedDateRange.split(" to ")[0]
  // const last = selectedDateRange.split(" to ")[1]

  // const format2 = moment(last).format('MM-DD-YYYY').toString();

  // const format1 = moment(first).format('MM-DD-YYYY').toString();

  console.log('currentSelection', currentSelection)


  return (


    <div className="d-flex">
      <div>
        {

          currentSelection.length > 0 ? (
            <div>

              {currentSelection?.map((selection) => {
                return (
                  <div className="dateChoice short" key={selection}>

                    <p className="mb-0 blue"> {selection}</p>

                  </div>

                )
              })}

            </div>

          ) : (



            <div className="dateChoice">

              <p className="mb-0 blue"><i class="fal fa-calendar-check"></i> </p>

            </div>

          )

        }

      </div>

    </div>

  )
}
