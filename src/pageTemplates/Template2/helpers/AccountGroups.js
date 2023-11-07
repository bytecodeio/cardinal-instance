import { indexOf } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const account_key = "account group";

const AccountGroups = ({
  fieldOptions,
  selectedFilters,
  setSelectedFilters,
  showActionBtns = true,
}) => {
  const [field, setField] = useState("");
  const [expandMenu, setExpandMenu] = useState(false);

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (fieldOptions["options"] && fieldOptions["options"]["field"]?.name) {
      setField(fieldOptions["options"]["field"]?.name);
      setOptions(fieldOptions["options"]["values"]);
    }
  }, [fieldOptions]);

  function handleFieldSelection(value) {
    let key = "users.account_name." + value.replace(" ", "_");

    let _selectedOptions = [...selectedOptions];
    if (_selectedOptions.find((v) => v === value)) {
      let index = _selectedOptions.indexOf(value);
      _selectedOptions.splice(index, 1);
    } else {
      _selectedOptions.push(value);
    }
    let filters = { ...selectedFilters };
    filters[account_key][key] = value;
    if (_selectedOptions.length === 0) {
      filters[account_key] = {};
      setSelectedFilters(filters);
      setSelectedOptions([]);
    } else {
      setSelectedOptions(_selectedOptions);
      setSelectedFilters(filters);
    }
  }

  const handleFieldsAll = () => {
    let filters = { ...selectedFilters };
    let allVals = fieldOptions["options"]["values"].map((opt) => {
      return Object.values(opt)[0];
    });
    setSelectedOptions(allVals);
    filters[account_key][field] = allVals.join(",");
    setSelectedFilters(filters);
  };

  const clearAllAccounts = () => {
    let filters = { ...selectedFilters };
    filters[account_key] = {};
    setSelectedFilters(filters);
    setSelectedOptions([]);
  };

  const handleMenuExpand = () => {
    setExpandMenu(true);
  };

  return (
    <>
      {showActionBtns ? (
        <>
          <span className="allOptions clear first" onClick={handleFieldsAll}>
            Select All
          </span>

          <span className="allOptions clear second" onClick={clearAllAccounts}>
            Clear All
          </span>

          <span className="allOptions clear" onClick={() => handleMenuExpand()}>
            Expand
          </span>
          <div className="mb-5"></div>
        </>
      ) : (
        ""
      )}
      <div
        className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters pt-2"}
      >
        <i
          class="fal fa-times closeOptions"
          onClick={() => setExpandMenu(false)}
        ></i>
        {Array.isArray(fieldOptions["options"]["values"])
          ? fieldOptions["options"]["values"]?.map((fieldOption) => {
              let [key, value] = Object.entries(fieldOption)[0];
              return (
                <div className="one" key={value}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      className=""
                      label={value}
                      checked={selectedOptions.includes(value)}
                      name="accountGroups"
                      // id={fieldOption}
                      value={value}
                      onClick={() => handleFieldSelection(value)}
                    />
                  </Form.Group>
                </div>
              );
            })
          : ""}
      </div>
    </>
  );
};

export default AccountGroups;
