import React, {Fragment, useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const AccountGroups = ({
  fieldOptions,
  setSelectedAccountGroup,
  selectedAccountGroup,
  showMenu2,
  setShowMenu2,
 handleFieldAll
}) => {


  function handleFieldSelection(value) {

      setSelectedAccountGroup((prev) => {
        if (prev.includes(value)) {
          return prev.filter((selectedFilter) => selectedFilter !== value);
        } else {
          return [...prev, value]

        }


      });

  }


  function handleFieldAll(value) {
    setSelectedAccountGroup(fieldOptions)
  }
// 
// console.log(fieldOptions)


  return (
<Fragment>

    {/*<button onClick={handleFieldAll}>hi</button>*/}



    <div  className={showMenu2 ? "wrapFilters fullScreen" : "wrapFilters"}>
      <i class="fal fa-times closeOptions" onClick={() => setShowMenu2(false)} ></i>


      {fieldOptions.map((fieldOption) => (
        <div className="one" key={fieldOption}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              className=""
              label={fieldOption}
              checked={selectedAccountGroup.includes(
                fieldOption
              )}
              name="accountGroups"
              // id={fieldOption}
              value={fieldOption}
              onChange={() => handleFieldSelection(fieldOption)}
            />
          </Form.Group>
        </div>
      ))}
    </div>


</Fragment>

  );
};

export default AccountGroups;
