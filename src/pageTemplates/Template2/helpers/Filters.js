import React, { useState } from "react";
import { useEffect } from "react";

import { Button, Form, Modal, Spinner } from "react-bootstrap";

const type = 'filter'

const FilterDropdown = ({ handleChange, label, name, options, value }) => {

  return (
    <>
      <p>{label}</p>

      <Form.Select

        onChange={(e) => handleChange(name, e.target.value)}
        value={value}
        >
        <option key="n/a" value="N/A">Please select</option>
        {options?.map((optionText) => (
          <option key={optionText} value={optionText}> {optionText}</option>
        ))}
      </Form.Select>
    </>
  );
};

const Filters = ({
  isLoading,
  filters,
  selectedFilters,
  setSelectedFilters,
  isDefault,
  setIsDefault,
  setIsFilterChanged,
  showActionBtns = true
}) => {
  const [expandMenu, setExpandMenu] = useState(false)


  function handleFilterSelection(filterName, newValue) {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[type][filterName] = newValue;
      return newFilters;
    });
    setIsFilterChanged(true);
  }

  const handleMenuExpand = () => {
    setExpandMenu(true)
  }

  return (
    <>


    {showActionBtns?
      <div className="position-relative d-flex justify-content-end">
          <>


            <span className="allOptions clear mt-3 filter-expand"  onClick={() => handleMenuExpand()}>Expand</span>
          </>
      </div>
      :''
    }


      <div  className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters"}>
        <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
        {filters.options.map((filterOption) => (
          <div className="one" key={filterOption.name}>
            <Form.Group>
              <FilterDropdown
                handleChange={handleFilterSelection}
                label={filterOption.field.label_short}
                name={filterOption.field.name}
                options={filterOption.values?.map(v => Object.values(v)).filter(v => {
                  return !(v.includes(null) || v.includes(""))
                })}
                //value={isDefault ? selectedFilters[filterOption.name] : "N/A"}
              />
            </Form.Group>
          </div>
        ))}
      </div>
    </>

  );
};

export default Filters;
