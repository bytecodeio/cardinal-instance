import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const Fields = ({
  fieldOptions,
  setTabList,
  tabList,
  currentInnerTab,
  updateBtn,
  setUpdateBtn,
  showActionBtns = true

}) => {
  const [expandMenu, setExpandMenu] = useState(false);

  function handleFieldSelection(fieldName) {
    console.log(fieldName)
    setUpdateBtn(false);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    if (currentTab["selected_fields"].includes(fieldName)) {
      let index = currentTab["selected_fields"].indexOf(fieldName);
      currentTab["selected_fields"].splice(index, 1);
    } else {
      currentTab["selected_fields"].push(fieldName);
    }
    setTabList(tabs);
  }

  const handleFieldsAll = () => {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab['selected_fields'] = fieldOptions.map(fo => {return fo['name']})
    setTabList(tabs)
  }

  const handleRestoreDefault = () => {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab['selected_fields'] = [...currentTab['default_fields']]
    setTabList(tabs)
  }

  const handleMenuExpand = () => {
    setExpandMenu(true)
  }

  console.log(fieldOptions, "lixxi")

  return (
    <>
    {showActionBtns?
      <div className="mb-5">      
          <>
            <span className="allOptions clear first" onClick={handleFieldsAll}>Select All</span>

            <span className="allOptions clear restore" onClick={handleRestoreDefault}>Restore Defaults</span>

            <span className="allOptions clear" onClick={() => handleMenuExpand()}>Expand</span>
          </>
      </div>        
      :''
    }
    <div  className={expandMenu ? "wrapFilters fullScreen" : "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setExpandMenu(false)} ></i>
      {fieldOptions.map((fieldOption) => (
        <div className="one" key={fieldOption.name}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption.label_short}
              checked={tabList.length > 0?tabList[currentInnerTab]["selected_fields"].includes(
                fieldOption.name
              ):false}
              name="Fields"
              // id={fieldOption.name}
              value={fieldOption.fields}
              onChange={() => handleFieldSelection(fieldOption.name)}
            />
          </Form.Group>
        </div>
      ))}
    </div>
  </>
    // set value to name
  );
};

export default Fields;
