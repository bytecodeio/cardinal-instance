import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner, Row, Col } from "react-bootstrap";
import * as $ from "jquery";

const CurrentAccountGroup = ({
  selectedDateFilter,
  selectedFilters,
  filterOptions,
  fieldOptions,
  selectedFields,
  setSelectedFields,
  dateFilterOptions,
  setSelectedAccountGroup,
  selectedAccountGroup

}) => {
  const [currentSelection, setCurrentSelection] = useState([]);

  useEffect(() => {
    let currentSelectionObj = {};

    for (const filter in selectedAccountGroup) {
      if (selectedAccountGroup[filter] !== "") {
        const option1 = fieldOptions.find(
          (option1) => option1.name ===  selectedAccountGroup[filter]
        );

        if (option1) {
          currentSelectionObj[filter] = option1;
        }
      }
    }

    setCurrentSelection(currentSelectionObj);
  }, [

    fieldOptions,
    setSelectedAccountGroup,
    selectedAccountGroup
  ]);

  function removeAccount(fieldName) {
    setSelectedAccountGroup((prev) => {
      if (prev.includes(fieldName)) {
        return prev.filter((selectedFilter) => selectedFilter !== fieldName);
      } else {
        return [...prev, fieldName];
      }
    });

  }


const num = $('.tab-pane.active.show .currentFiltersAdded .theOptions').length

$('.numberCounter').html($('.tab-pane.active.show .currentFiltersAdded .theOptions').length)

// if (num > 3  ){
//   $('.whiteBar').fadeIn()
//  $('.currentFiltersAdded').addClass('minHeight')
//  $('.mostSmall').removeClass('greyedOut')
//
// }
// if (num < 4  ){
//   $('.whiteBar').fadeOut()
//  $('.currentFiltersAdded').removeClass('minHeight')
//   $('.mostSmall').addClass('greyedOut')
// }
//
// if (num > 0 ){
// $('.currentFiltersAdded').addClass('newHeight')
// $('.pHidden, .mostSmall').removeClass('hidden')
// }
// else{
//   $('.currentFiltersAdded').removeClass('newHeight')
//  $('.pHidden, .mostSmall').addClass('hidden')
// }
//
// $('.mostSmall').on('click', function(e) {
//   if($('.whiteBar').css('display') == 'block') {
//     e.stopPropagation()
//     e.preventDefault()
//     $('.whiteBar').hide()
//     $('.currentFiltersAdded').animate({
//         minHeight: "none",
//         maxHeight:"100%",
//         height:"auto"
//
//     },400);
//   }
//
// })
//
//
// $('.mostSmall').on('click', function(e) {
//   if($('.whiteBar').css('display') == 'none' && $('.tab-pane.active.show .currentFiltersAdded .theOptions').length > 3 ) {
//
//      e.stopPropagation()
//       $('.whiteBar').show()
//     $('.currentFiltersAdded').animate({
//           minHeight: "none",
//           maxHeight:"100px",
//           height:"auto"
//     },400);
//   }
// })


  return (
    <>


<div className="d-flex justify-content-between align-items-center">
<p className="pHidden mb-3 hidden">Selected Filters</p>
<a href=""><p class="text-center mostSmall hidden greyedOut mb-3">Select to expand all <i class="fas fa-plus-circle tooltips-elements seeLess"></i></p></a>
</div>
    <div className="currentFiltersAdded">

      <div className="whiteBar">
        <i class="fas fa-circle">
          <h6 className="numberCounter"></h6>
        </i>

      </div>
      <div className="wrapOptions">
        {Object.keys(selectedAccountGroup)?.map((selection) => {
          return (
            <div className="theOptions" key={selection}>
              <p className="mb-0 blue">{selectedAccountGroup[selection]}</p>
              <i
                onClick={() => removeAccount(selectedAccountGroup[selection])}
                className="fal fal fa-times blue"
              ></i>
            </div>
          );
        })}
      </div>

      </div>

    </>
  );
};

export default CurrentAccountGroup;
