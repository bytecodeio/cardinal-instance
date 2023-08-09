import React, { useState } from "react";

import { Button, Form, Modal, Spinner } from "react-bootstrap";

const FilterDropdown = ({ handleChange, label, name, options, value }) => {
  return (
    <>
      <p>{label}</p>

      <Form.Select
        onChange={(e) => handleChange(name, e.target.value)}
        value={value}
        >
        <option key="N/A">N/A</option>
        {options?.map((optionText) => (
          <option key={optionText}> {optionText}</option>
        ))}
      </Form.Select>
    </>
  );
};

const Filters = ({
  isLoading,
  filterOptions,
  filterSuggestions,
  selectedFilters,
  setSelectedFilters,
  isDefault,
  setIsDefault,
  setIsFilterChanged,
}) => {



  function handleFilterSelection(filterName, newValue) {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[filterName] = newValue;
      return newFilters;
    });
    setIsFilterChanged(true);
  }

  return (
    <div className="wrapFilters">
      {filterOptions.map((filterOption) => (
        <div className="one" key={filterOption.name}>
          <Form.Group>
            <FilterDropdown
              handleChange={handleFilterSelection}
              label={filterOption.label_short}
              name={filterOption.name}
              options={filterSuggestions[filterOption.name]}
              value={isDefault ? selectedFilters[filterOption.name] : "N/A"}
            />
          </Form.Group>
        </div>
      ))}
    </div>
  );
};

export default Filters;
