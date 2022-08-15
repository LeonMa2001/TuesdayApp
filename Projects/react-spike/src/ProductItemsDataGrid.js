/*
    Replaces the Table version of the Product Backlog (ProductItems.js) with a DataGrid, which provides more customisation 
    and is easier to modify
*/

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
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
        field: 'id',
        headerName: 'ID',
        width: 50,
    },
    { 
        field: 'name',
        headerName: 'Story Name',
        width: 300,
        editable: true,
    },
    { 
        field: 'tag',
        headerName: 'Tag',
        width: 300,
        editable: false,
    },
    { 
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        editable: false,
    },
    { 
        field: 'points',
        headerName: 'Story Points',
        width: 110,
        editable: false,
    },
    {
        field: "editButton",
        headerName: "",
        width: 100,
        renderCell: renderEditButton

    }
];

function createData(id, name, tag, priority, points) {
    return {
      id,
      name,
      tag,
      priority,
      points
    };
  }
  
const rows = [
createData(1, 'Example story 1', 'Database', 'High', 5),
createData(2, 'Example story 2', 'User Interface', 'Medium', 2),
createData(3, 'Example story 3', 'Testing', 'Low', 1),
];

export default function DataGridProductItems() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        autoHeight
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}