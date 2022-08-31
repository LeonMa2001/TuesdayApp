/*
    Use a DataGrid instead of a Table for easier / finer control of data and layout of items in the Product Backlog
*/

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

import {
    DataGrid,
    GridToolbar,
    GridLinkOperator,
    GridToolbarContainer,
    GridToolbarFilterButton,
    getGridNumericOperators,
    GridFilterInputValueProps,
    GridFilterItem,
    GridFilterOperator,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

// https://stackoverflow.com/questions/64331095/how-to-add-a-button-to-every-row-in-mui-datagrid

const renderEditButton = (params) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick = {() => {
                    alert(params.row.name)
                }}
            ><EditIcon /></Button>
        </strong>
    )
}

const columns = [

    {
        field: 'name',
        headerName: 'Story Name',
        width: 300,
        editable: true,
        sortable: false,
    },
    { 
        field: 'tag',
        headerName: 'Tag',
        width: 300,
        editable: false,
        sortable: false,
    },
    { 
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        editable: false,
        sortable: false,
    },
    { 
        field: 'points',
        headerName: 'Story Points',
        width: 110,
        editable: false,
        sortable: false,
    },
    {
        field: "editButton",
        headerName: "",
        width: 100,
        renderCell: renderEditButton,
        sortable: false,

    }
];

const filterOperators = getGridNumericOperators().filter(
  (operator) => operator.value === '>' || operator.value === '<',
);

function createData(id, name, tag, priority, points) {
    return {
      id,
      name,
      tag,
      priority,
      points
    };
  }

/*
  Dummy data: replace with calls to back-end
*/ 
const rows = [
createData(1, 'Example story 1', 'Database', 'High', 5),
createData(2, 'Example story 2', 'User Interface', 'Medium', 2),
createData(3, 'Example story 3', 'Testing', 'Low', 1),
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function DataGridProductItems() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        components={{
          Toolbar: CustomToolbar,
        }}
        rows={rows}
        columns={columns}
        pageSize={5}
        autoHeight
        disableColumnMenu
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}

        // Not working yet
//        initialState={{
//          filter: {
//            filterModel: {
//              items: [
//                {
//                  id: 1,
//                  columnField: 'tag',
//                  operatorValue: 'is',
//                  value: 'Testing',
//                },
//              ],
//            },
//          },
//        }}
      />
    </Box>
  );
}