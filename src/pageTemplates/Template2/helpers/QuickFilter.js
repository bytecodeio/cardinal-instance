import React, { useState, useEffect } from "react";

import { Button, ButtonGroup, Form, Modal, Spinner } from "react-bootstrap";

const type = 'quick filter'

const QuickFilter = ({ quickFilters, selectedFilters, selection, setSelectedFilters, updateBtn, setUpdateBtn, setIsFilterChanged }) => {
  const handleSelection = (e, name) => {
    let quickFilters = JSON.parse(JSON.stringify(selectedFilters))
    if (quickFilters[type]?.hasOwnProperty(name)) {
      if (quickFilters[type][name].includes(e.target.id)) {
        //delete quickFilters[type][name]
        let index = quickFilters[type][name].indexOf(e.target.id)
        quickFilters[type][name].splice(index,1)
      } else {
        quickFilters[type][name].push(e.target.id)
      }
    } else {
      quickFilters[type] = {[name]:[]}
      quickFilters[type][name].push(e.target.id)
    }
    if (quickFilters[type][name].length === 0){
      delete quickFilters[type][name]
    }
    setSelectedFilters(JSON.parse(JSON.stringify(quickFilters)))
    setIsFilterChanged(true)
  }

  const isActive = (key, v) => {
    console.log("test",selectedFilters[type][key])
    const val = v.join(',')
    console.log("test",v.join(','))
    if (!selectedFilters[type]?.hasOwnProperty(key)) {
      return false
    }
    if (selectedFilters[type][key]?.includes(val)) {
      return true
    }
    return false
  }

  return (
    <>
      {quickFilters?.options.map(f => {
        return (
          <>
            <div>{f['field']['label']}</div>
            <ButtonGroup>
              {f['values']?.map(v =>
                <Button
                  key={Object.values(v)}
                  active={isActive(f['field']['name'], Object.values(v))}
                  id={Object.values(v)}
                  type="radio"
                  name="filters"
                  onClick={(e) => handleSelection(e, f['field']['name'])}
                >{Object.values(v)}</Button>
              )}
            </ButtonGroup>
          </>
        )
      })}
    </>
  )
};

export default QuickFilter;
