import React, { useState, useEffect } from "react";

import { Button, ButtonGroup, Form, Modal, Spinner } from "react-bootstrap";

const QuickFilter = ({ quickFilterOptions, selectedQuickFilter, setSelectedQuickFilter, updateBtn, setUpdateBtn, setIsFilterChanged}) => {
  // console.log('debug: options', options, value);
  const handleSelection = (e,name) => {
    let quickFilters = {...selectedQuickFilter}
    if (quickFilters?.hasOwnProperty(name)) {
      if (quickFilters[name] === e.target.id) {
        delete quickFilters[name]
      } else {
        quickFilters[name] = e.target.id
      }
    }  else {
      quickFilters[name] = e.target.id
    }
    setSelectedQuickFilter(quickFilters)
    setIsFilterChanged(true)
  }

const isActive = (key,v) => {
  if (!selectedQuickFilter?.hasOwnProperty(key)) {
    return false
  }
  if (selectedQuickFilter[key] == v) {
    return true
  }
  return false
}

  return (
    <>
      {quickFilterOptions?.map(f => {
        return (
          <>
          <div>{f['label']}</div>
          <ButtonGroup>
            {f['values'].map(v =>
                <Button
                key={v}
                active={isActive(f['name'], v)}
                id={v}
                type="radio"
                name="filters"
                onClick={(e) => handleSelection(e,f['name'])}
                >{v}</Button>
            )}
          </ButtonGroup>
          </>
        )
      })}
    </>
  )
};

export default QuickFilter;
