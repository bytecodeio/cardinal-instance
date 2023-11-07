import React, { useState,  useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Filters from './Filters'
import Fields from "./Fields";
import AccountGroups from "./AccountGroups";

const SearchAll2 = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  fieldOptions,
  setTabList,
  tabList,
  currentInnerTab,
  setSelectedFields,
  selectedFields,
  selectedAccountGroups,
  setSelectedAccountsGroups,
  accountGroups
}) => {
  const [filteredFields, setFilteredFields] = useState([])
  const [filteredFilters, setFilteredFilters] = useState([])
  const [accountGroupsList, setAccountGroupsList] = useState([])

  const [selection, setSelection] = useState('')
  const [selectOpen, setSelectOpen] = useState(false)

  useEffect(() => {
    setFilteredFields(fieldOptions)
    setFilteredFilters(filters)
      setAccountGroupsList(selectedAccountGroups)
  }, [])

useEffect(() => {
  setAccountGroupsList(selectedAccountGroups)
}, [selectedAccountGroups])


const handleSelectionChange = (v) => {
  setSelection(v.target.value)
  let _fieldOptions = [...fieldOptions];
  let _filterOptions = { ...filters }
  let _accountGroups = {...selectedAccountGroups}

  if (v.target.value != '') {
    let _fields = _fieldOptions.filter(opt => opt['label_short'].toUpperCase().includes(v.target.value.toUpperCase()))
    let _filters = _filterOptions['options'].filter(opt => opt['field']['label_short'].toUpperCase().includes(v.target.value.toUpperCase()))
    let _accountGroupsFiltered = _accountGroups['options']['values']?.filter(opt => opt['users.account_name'].toUpperCase().includes(v.target.value.toUpperCase()))

    _filterOptions['options'] = _filters;
    setFilteredFilters(_filterOptions)
    setFilteredFields(_fields)
    setAccountGroupsList({ ...selectedAccountGroups, ['options']: {...selectedAccountGroups['options'], ['values']: _accountGroupsFiltered }})
  } else {
    setFilteredFields(_fieldOptions)
    setFilteredFilters(_filterOptions)
    setAccountGroupsList({ ...selectedAccountGroups, ['options']: {...selectedAccountGroups['options'], ['values']: _accountGroupsFiltered }})
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

      <div onFocus={openSearchOptions} className="position-relative">
        <div className="position-relative columnStart mb-3">
          <label>Search Selections</label>
          <input value={selection} onChange={handleSelectionChange} placeholder="" type="search" class="form-control" />
          <i class="far fa-search absoluteSearch"></i>
        </div>
        {selectOpen && selection ?
          <div className="search-popover">
            <i onClick={closeSearchOptions} class="fal fa-times closeSearch"></i>

            {accountGroupsList['options']?.['values'].length > 0 ?
               <div className="search-all-container">
                <h6 className="mb-4 mt-0">Account Groups</h6>
                    <AccountGroups
                    fieldOptions={accountGroupsList}
                    setTabList={setTabList}
                    tabList={tabList}
                    currentInnerTab={currentInnerTab}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    showActionBtns={false} />
                  </div>
                  : ''
                }

            {filteredFilters['options']?.length > 0 ?
              <div className="search-all-container">
                <h6 className="mb-2 mt-0">Filters</h6>
                <Filters
                filters={filteredFilters}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                showActionBtns={false}/>
              </div>
              : ''
            }
            {filteredFields.length > 0 ?
              <div className="search-all-container">
                <h6 className="mb-2 mt-0">Fields</h6>
                <Fields
                fieldOptions={filteredFields}
                setTabList={setTabList}
                tabList={tabList}
                currentInnerTab={currentInnerTab}
                selectedFields={selectedFields}
                setSelectedFields={setSelectedFields}
                showActionBtns={false} />
              </div>
              : ''
            }

          </div>
          : ''
        }
      </div>
    </>

  );
};

export default SearchAll2;
