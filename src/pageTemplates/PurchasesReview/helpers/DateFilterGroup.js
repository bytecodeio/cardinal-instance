import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

export const DateFilterGroup = ({
  dateFilterOptions,
  setSelectedDateFilter,
  selectedDateFilter,
}) => {
  const handleSelection = (e) => {
    setSelectedDateFilter(e.target.id);
  };

  return (
    <ButtonGroup>
      {dateFilterOptions?.map((filter) => {
        return (
          <Button
            key={filter["description"]}
            key={filter.name}
            active={selectedDateFilter === filter["name"] ? true : false}
            id={filter["name"]}
            type="radio"
            name="filters"
            onClick={handleSelection}
          >
            {filter["label_short"].replace("(Yes / No)", "")}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
