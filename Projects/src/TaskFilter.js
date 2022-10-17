/*
    Custom filter for the tag component in DataGrid
*/

import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";

// custom operator for the tag
const tagOperator = [
    {
        label: "is", // shown text
        value: "equals",
        getApplyFilterFn: (filterItem, column) => { // filter function (should this column be shown)
            if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) return null; // if value is null don't worry about filtering

            return (params) => {
                const rowValue = column.valueGetter ? column.valueGetter(params) : params.value; // get the row value for the column
                return rowValue === filterItem.value || filterItem.value === 'All'; // show column if it has the right row value or if the filter is 'all'
            };
        },
        InputComponent: TagFilter, // the select filter
    }
];

/*
    The tag filter

    @param props   The props passed down
*/
function TagFilter(props) {
    const { item, applyValue } = props; // item = the current filter item, applyValue = function to change the filter item

    /*
        Change the filter value

        @param event   The event that caused the change
    */
    const handleFilterChange = (event) => {
        applyValue({ ...item, value: event.target.value }); // change the value 
    };

    return (
        <FormControl variant="standard">
            <Select
                value={item.value} // show the current filter item
                onChange={handleFilterChange}
                defaultValue={'All'} // default to show all columns
            >
                <MenuItem value={"All"} selected>
                    All
                </MenuItem>
                <MenuItem value={"Core"}>
                    Core
                </MenuItem>
                <MenuItem value={"User Interface"}>
                    User Interface
                </MenuItem>
                <MenuItem value={"Testing"}>
                    Testing
                </MenuItem>
            </Select>
        </FormControl>
    );
}

export default tagOperator;