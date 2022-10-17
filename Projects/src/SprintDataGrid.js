/*
    Creation of the overall sprint boards viewer.
    Also handles displaying a specific sprint when clicked on.
*/

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import {
    DataGrid
} from '@mui/x-data-grid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import React from 'react';
import { CustomNoRowsOverlay, CustomToolbar } from './graphics/DataGridGraphics.js';
import { DisplaySprint } from './Sprint.js';
dayjs.extend(advancedFormat);


function createSprintData(data) {
    return {
        id: data.sprintName,
        name: data.sprintName,
        startDate: data.startDate.format('dddd, Do MMMM YYYY'),
        endDate: data.endDate.format('dddd, Do MMMM YYYY'),
        status: data.status
    };
}

// Button credit to https://stackoverflow.com/questions/64331095/how-to-add-a-button-to-every-row-in-mui-datagrid
const columnsFunc = (renderDeleteButton) => [
    {
        field: 'name',
        headerName: 'Sprint Names',
        width: 300,
        editable: false,
        sortable: false
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        width: 300,
        editable: false,
        sortable: false
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        width: 300,
        editable: false,
        sortable: false
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 300,
        cellClassName: (params) => {
            if (params.value == null) {
                return '';
            }

            return clsx('sprint-status', {
                notstarted: params.value == 'Not Started',
                inprogress: params.value == 'In Progress',
                completed: params.value == 'Completed',
            });
        },
        editable: false,
        sortable: false
    },
    {
        field: "deleteTask",
        headerName: "",
        width: 100,
        renderCell: renderDeleteButton,
        sortable: false
    }
];

export default class DisplaySprints extends React.Component {
    constructor(props) {
        super(props)
        this.columns = columnsFunc(this.renderDeleteButton)
    }


    /*
      Creates a Button object with the specified rowID being handled when clicked.
      Requires a handleDeleteSprint prop.
  
      @param rowID    The rowID this button corresponds to
    */
    renderDeleteButton = (rowID) => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation()
                        this.props.handleDeleteSprint(rowID.id)
                    }}
                ><DeleteForeverIcon /></Button>
            </strong>
        )
    }

    /*
        Converts sprint data into the required objects to display
        
        @param data   A list of sprints to display
    */
    getRows = (data) => {
        return data.map(row => createSprintData(row))
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
                '& .sprint-status.notstarted': {
                    backgroundColor: '#d47483',
                    fontWeight: '500',
                },
                '& .sprint-status.inprogress': {
                    backgroundColor: '#E2D1F9',
                    fontWeight: '500',
                },
                '& .sprint-status.completed': {
                    backgroundColor: '#CCF381',
                    fontWeight: '500',
                }
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
                    disableColumnFilter
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    onRowClick={(rowData) => this.props.handleSprintClick(rowData.id)}
                />
            </Box>
        )
    }

    /*
      Gets the sprint data corresponding to the provided name
    */
    getSprintData() {
        return this.props.data.filter(sprint => sprint.sprintName == this.props.displaySprintName)[0]
    }


    /*
      If looking at a specific sprint, this displays the actual sprint info.
      Otherwise, it displays the sprint datagrid.
    */
    displayComponent() {
        if (this.props.displaySprintName) {
            return <DisplaySprint
                sprintData={this.getSprintData()}
                enableLock={this.props.enableLock}
                handleSprintStatusChange={this.props.handleSprintStatusChange}
                teamMembers={this.props.teamMembers}
                editing={this.props.editing}
                handleItemClick={this.props.handleItemClick}
                displayItem={this.props.displayItem}
                saveInfo={this.props.saveInfo}
                addTimeLog={this.props.addTimeLog}
            />
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
