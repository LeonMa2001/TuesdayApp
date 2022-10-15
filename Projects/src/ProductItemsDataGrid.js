/*
    Use a DataGrid instead of a Table for easier / finer control of data and layout of items in the Product Backlog
*/

import * as React from 'react'
import Box from '@mui/material/Box'
import clsx from 'clsx';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';


import {
    DataGrid,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileMove from '@mui/icons-material/DriveFileMove';
import Task from './Task.js'
import TaskData from "./classes/TaskData.js"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CustomToolbar, StyledGridOverlay, CustomNoRowsOverlay } from './graphics/DataGridGraphics.js'


// Button credit to https://stackoverflow.com/questions/64331095/how-to-add-a-button-to-every-row-in-mui-datagrid
const columnsFunc = (renderEditButton) => (renderMoveButton) => (renderDeleteButton) => [
    {
        field: 'name',
        headerName: 'Story Name',
        width: 300,
        editable: false,
        sortable: false,
        filterable: false,
    },
    { 
        field: 'tag',
        headerName: 'Tag',
        width: 300,
        cellClassName: (params) => {
          if (params.value == null) {
            return '';
          }

          return clsx('task-tag', {
            core: params.value == 'Core',
            interface: params.value == 'User Interface', 
            testing: params.value == 'Testing',
          });
        },
        editable: false,
        sortable: false,
    },
    { 
        field: 'priority',
        headerName: 'Priority',
        width: 100,
        cellClassName: (params) => {
          if (params.value == null) {
            return '';
          }

          return clsx('task-priority', {
            low: params.value == 'Low',
            medium: params.value == 'Medium', 
            high: params.value == 'High',
            critical: params.value == 'Critical'
          });
        },
        editable: false,
        sortable: false,
        filterable: false,
    },
    { 
        field: 'points',
        headerName: 'Story Points',
        width: 110,
        editable: false,
        sortable: false,
        filterable: false,
    },
    {
        field: "editButton",
        headerName: "",
        width: 100,
        renderCell: renderEditButton,
        sortable: false,
        filterable: false,
    },
    {
        field: "moveTask",
        headerName: "",
        width: 100,
        renderCell: renderMoveButton,
        sortable: false,
        filterable: false,
    },
    {
      field: "deleteTask",
      headerName: "",
      width: 100,
      renderCell: renderDeleteButton,
      sortable: false,
      filterable: false,
    }
];


function createData(data) {
    return {
      id: data.id,
      name: data.taskName,
      tag: data.tag,
      priority: data.priority,
      points: data.points
    };
  }


class ProductItemsDataGrid extends React.Component {
    constructor(props) {
        super(props)
        this.columns = columnsFunc(this.renderEditButton)(this.renderMoveButton)(this.renderDeleteButton)
    }


    /*
      Creates a Button object with the specified rowID being handled when clicked.
      Requires a handleItemClick prop.

      @param rowID    The rowID this button corresponds to
    */
    renderEditButton = (rowID) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick = {(event) => {
                        event.stopPropagation()
                        this.props.handleItemClick(rowID.id, true)
                    }}
                ><EditIcon /></Button>
            </strong>
        )
    }

    /*
      Creates a Button object with the specified rowID being handled when clicked.
      Requires a handleMoveItem prop.

      @param rowID    The rowID this button corresponds to
    */
    renderMoveButton = (rowID) => {
      return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick = {(event) => {
                    event.stopPropagation()
                    this.props.handleMoveItem(rowID.id)
                }}
            ><DriveFileMove /></Button>
        </strong>
    )
    }

    /*
      Creates a Button object with the specified rowID being handled when clicked.
      Requires a handleDeleteItem prop.

      @param rowID    The rowID this button corresponds to
    */
    renderDeleteButton = (rowID) => {
      return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick = {(event) => {
                    event.stopPropagation()
                    this.props.handleDeleteItem(rowID.id)
                }}
            ><DeleteForeverIcon /></Button>
        </strong>
    )
    }
    
    /*
      Filters out tasks that are part of a sprint.
      Requires a sprintTasks prop which is a list of task IDs that are already in a sprint.
      
      @param data   A list of tasks to filter on
    */
    getRows = (data) => { 
        const filteredData = data.filter(task => !this.props.sprintTasks.includes(task.id))
        return filteredData.map(row => createData(row))
    }

    /*
      Generates the data grid with the provided data.
    */
    generateDataGrid() {
        return (
          // Fancy graphics
            <Box sx={{ 
              height: 400, 
              width: '100%',
              '& .task-tag.core': {
                backgroundColor: '#d47483',
                fontWeight: '500',
              },
              '& .task-tag.interface': {
                backgroundColor: '#E2D1F9',
                fontWeight: '500',
              },
              '& .task-tag.testing': {
                backgroundColor: '#CCF381',
                fontWeight: '500',
              },
              '& .task-priority.low': {
                backgroundColor: '#A6A6A6',
                fontWeight: '500',
              },
              '& .task-priority.medium': {
                backgroundColor: '#FFF529',
                fontWeight: '500',
              },
              '& .task-priority.high': {
                backgroundColor: '#F18A00',
                fontWeight: '500',
              },
              '& .task-priority.critical': {
                backgroundColor: '#D00000',
                fontWeight: '500',
              },
              }}>
            {/* Generate the actual grid itself */}
              <DataGrid
                components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                  rows={this.getRows(this.props.data)}
                  columns={this.columns}
                  pageSize={5}
                  autoHeight
                  disableColumnMenu
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
          
                  initialState={{
                    filter: {
                      filterModel: {
                        items: [
                          {
                            columnField: 'tag',
                            operatorValue: 'equals',
                            value: '',
                          },
                        ],
                      },
                    },
                  }}
                onRowClick = { (rowData) => this.props.handleItemClick(rowData.id) }
              />
            </Box>
        )
    }

    /*
      Gets the task data corresponding to the provided displayItem, else creating a new TaskData instance if 
      it does not already exist.

      Requires the data and displayItem prop to be set.
    */
    getCorrectRow() {
      return this.props.data.filter(task => task.id == this.props.displayItem)[0] ?? new TaskData(this.props.displayItem)
    }

   
    /*
      Displays the task if specified, optionally in editing mode.
    */
    displayComponent() {
        if (this.props.displayItem) {
            return <Task rowID={this.props.displayItem} teamMembers={this.props.teamMembers} returnControl={this.props.handleItemClick} editing={this.props.editing} data={this.getCorrectRow()} saveInfo={this.props.saveInfo}/>
        }
        return this.generateDataGrid();

    }

    /*
      Main render function.
    */
    render() {
        return (
            <React.Fragment>
                {this.displayComponent()}
            </React.Fragment>
            
        )
    }
}

export default ProductItemsDataGrid;