
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';


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
  
/*
  Dummy data: replace with calls to back-end
*/ 
const rows = [
createData(1, 'TEAM TEST', 'Database', 'High', 5),
createData(2, 'TEAM TEST 2', 'User Interface', 'Medium', 2),
createData(3, 'TEAM TEST 3', 'Testing', 'Low', 1),
];

export default function TeamInfo() {
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