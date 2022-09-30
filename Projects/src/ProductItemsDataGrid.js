/*
    Use a DataGrid instead of a Table for easier / finer control of data and layout of items in the Product Backlog
*/

import * as React from 'react'
import Box from '@mui/material/Box'
import clsx from 'clsx';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileMove from '@mui/icons-material/DriveFileMove';
import Task from './Task.js'
import TaskData from "./classes/TaskData.js"


// Button credit to https://stackoverflow.com/questions/64331095/how-to-add-a-button-to-every-row-in-mui-datagrid

const columnsFunc = (renderEditButton) => (renderMoveButton) => [
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
        this.columns = columnsFunc(this.renderEditButton)(this.renderMoveButton)
    }


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
    
    getRows = (data) => { 
        // Only display elements that aren't already in a sprint
        const filteredData = data.filter(task => !this.props.sprintTasks.includes(task.id))
        return filteredData.map(row => createData(row))
    }

    // Generate the data grid with the provided information
    generateDataGrid() {
        return (
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

    getCorrectRow() {
      return this.props.data.filter(task => task.id == this.props.displayItem)[0] ?? new TaskData(this.props.displayItem)
    }

   
    displayComponent() {
        if (this.props.displayItem) {
            return <Task rowID={this.props.displayItem} teamMembers={this.props.teamMembers} returnControl={this.props.handleItemClick} editing={this.props.editing} data={this.getCorrectRow()} saveInfo={this.props.saveInfo}/>
        }
        return this.generateDataGrid();

    }

    render() {
        return (
            <React.Fragment>
                {this.displayComponent()}
            </React.Fragment>
            
        )
    }
}

export default ProductItemsDataGrid;

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}