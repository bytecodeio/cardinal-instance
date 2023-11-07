import React, {Fragment, useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const Fields = ({
  selectedFields,
  setSelectedFields,
  fieldOptions,
  setTabList,
  tabList,
  currentInnerTab,
  updateBtn,
  setUpdateBtn,
  showMenu2,
  setShowMenu2,
  handleFieldsAll
}) => {
  function handleFieldSelection(fieldName) {
    setUpdateBtn(false);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    if (currentTab["selected_fields"].includes(fieldName)) {
      let index = currentTab["selected_fields"].indexOf(fieldName);
      currentTab["selected_fields"].splice(index, 1);
    }
    else {
      currentTab["selected_fields"].push(fieldName);
    }
    setTabList(tabs);

    // setSelectedFields((prev) => {
    //   if (prev.includes(fieldName)) {
    //     return prev.filter((selectedFilter) => selectedFilter !== fieldName);
    //   } else {
    //     return [...prev, fieldName];
    //   }
    // });


  }

  // function handleFieldAll(value) {
  //   console.log(tabList);
  //   let tabs = [...tabList];
  //   tabs[currentInnerTab]['selected_fields'] = fieldOptions?.map(f => {return f['name']});
  //   setTabList(tabs)
  //
  // }



  return (

    <Fragment>



    <div  className={showMenu2 ? "wrapFilters fullScreen" : "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setShowMenu2(false)} ></i>
      {fieldOptions.map((fieldOption) => (
        <div className="one" key={fieldOption.name}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption.label_short}
              checked={tabList[currentInnerTab]["selected_fields"].includes(fieldOption.name)}
              name="Fields"
              // id={fieldOption.name}
              value={fieldOption.fields}
              onChange={() => handleFieldSelection(fieldOption.name)}
            />
          </Form.Group>
        </div>
      ))}
    </div>

</Fragment>
  );
};

export default Fields;
