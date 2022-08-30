/*
    Use a DataGrid instead of a Table for easier / finer control of data and layout of items in the Product Backlog
*/

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Task from './Task.js'

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

function createData(data) {
    return {
      id: data.id,
      name: data.name,
      tag: data.tag,
      priority: data.priority,
      storyPoints: data.storyPoints
    };
  }
  
/*
  Dummy data: replace with calls to back-end
*/ 

const data = [
    {
        id: 1,
        name: "Example story 1",
        tag: "Database",
        priority: "High",
        storyPoints: 5
    },
    {
        id: 2,
        name: "Example story 2",
        tag: "User Interface",
        priority: "Medium",
        storyPoints: 2
    },
    {
        id: 3,
        name: "Example story 3",
        tag: "Testing",
        priority: "Low",
        storyPoints: 5
    }
]
const rows = []
data.forEach((val) => {rows.push(createData(val))})


class ProductItemsDataGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = { displayItem: this.generateDataGrid() }
    }

    // Generate the data grid with the provided information
    generateDataGrid() {
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
                onRowClick = { (rowData) => this.handleItemClick(rowData.id) }
              />
            </Box>
        )
    }

    returnControl() {
        this.handleItemClick();
    }
    // Create a pop-up when a row is clicked
    // Returns to the main dashboard if rowID is not defined / null
    handleItemClick(rowID) {
        if (!rowID) {this.setState({displayItem: this.generateDataGrid()})}
        this.setState({ displayItem: <Task rowID={rowID} returnControl={() => this.handleItemClick()} /> });

    }

    render() {
        return (
            <React.Fragment>
                {console.log(this.state.displayItem)}
                {this.state.displayItem}
            </React.Fragment>
            
        )
    }
}

export default ProductItemsDataGrid;