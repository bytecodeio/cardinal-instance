import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Filters from './Filters'
import Fields from "./Fields";
import { useEffect } from "react";

const SearchAll2 = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  fieldOptions,
  setTabList,
  tabList,
  currentInnerTab,
  setSelectedFields,
  selectedFields
}) => {
  const [filteredFields, setFilteredFields] = useState([])
  const [filteredFilters, setFilteredFilters] = useState([])
  
  const [selection, setSelection] = useState([])
  const [selectOpen, setSelectOpen] = useState(false)

  useEffect(() => {
    setFilteredFields(fieldOptions)
    setFilteredFilters(filters)
  },[])

  const handleSelectionChange = (v) => {
    setSelection(v.target.value)
    let _fieldOptions = [...fieldOptions];
    let _filterOptions = {...filters}
    if (v.target.value != '') {
      let _fields = _fieldOptions.filter(opt => opt['label_short'].toUpperCase().includes(v.target.value.toUpperCase()))
      let _filters = _filterOptions['options'].filter(opt => opt['field']['label_short'].toUpperCase().includes(v.target.value.toUpperCase()))
      _filterOptions['options'] = _filters;
      setFilteredFilters(_filterOptions)
      setFilteredFields(_fields)
    } else {
      setFilteredFields(_fieldOptions)
      setFilteredFilters(_filterOptions)
    }

    
    
    //filterSearchOptions(v.target.value)
}

const openSearchOptions = () => {
    setSelectOpen(true)
}

const closeSearchOptions = () => {
    setSelectOpen(false)
}


  return (
    <>

    <div onFocus={openSearchOptions}>
      <div className="position-relative columnStart mb-3">
                <label>Search Selections</label>
                <input value={selection} onChange={handleSelectionChange} placeholder="" type="search" class="form-control" />
                <i class="far fa-search absoluteSearch"></i>
      </div>
      {selectOpen?
        <div className="search-popover">
          <i onClick={closeSearchOptions} class="fal fa-times closeSearch"></i>
          {filteredFilters['options']?.length > 0?
            <div className="search-all-container">
              <h5>Filters</h5>
              <Filters filters={filteredFilters}  selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
            </div>
            :''          
          }
          {filteredFields.length > 0?
            <div className="search-all-container">
              <h5>Fields</h5>
              <Fields fieldOptions={filteredFields} setTabList={setTabList} tabList={tabList}  currentInnerTab={currentInnerTab}  selectedFields={selectedFields} setSelectedFields={setSelectedFields} showActionBtns={false}/> 
            </div>
            :''
          }
            
        </div>
            :''
        }     
    </div>
  </>
    // set value to name
  );
};

export default SearchAll2;
