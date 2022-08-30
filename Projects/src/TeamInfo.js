import React from 'react';
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid';


const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 50,
    },
    { 
        field: 'name',
        headerName: 'Name',
        width: 300,
        editable: false,
    },
    { 
        field: 'email',
        headerName: 'Email',
        width: 300,
        editable: false,
    },
];

function createData(id, name, email) {
    return {
      id,
      name,
      email,
    };
  }
  
/*
  Dummy data: replace with calls to back-end
*/ 
const rows = [
  createData(1, 'User1', 'test1@gmail.com'),
  createData(2, 'User2', 'test1@gmail.com'),
  createData(3, 'User3', 'test1@gmail.com'),
];

export function showTeamMemberPopup() {
  console.log('hi')
};
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