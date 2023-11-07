import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const QuickFilter = ({
  quickFilterOptions,
  setTabList,
  tabList,
  currentInnerTab,
  updateBtn,
  setUpdateBtn,
}) => {
  function handleFieldSelection(fieldName) {
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

    // setSelectedFields((prev) => {
    //   if (prev.includes(fieldName)) {
    //     return prev.filter((selectedFilter) => selectedFilter !== fieldName);
    //   } else {
    //     return [...prev, fieldName];
    //   }
    // });
  }


    // console.log("these are quick", quickFilterOptions)

  return (
<div>
    <p>hi!</p>


    {/*<div className="wrapFilters">
      {quickFilterOptions.map((fieldOption) => (
        <div className="one" key={fieldOption.name}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption.label_short}
              checked={tabList[currentInnerTab]["selected_fields"].includes(
                fieldOption.name
              )}
              name="Fields"
              id={fieldOption.name}
              value={fieldOption.fields}
              onChange={() => handleFieldSelection(fieldOption.name)}
            />
          </Form.Group>
        </div>
      ))}
    </div>*/}


    </div>

  );
};

export default QuickFilter;
