/*
Kanban Board ceation
*/

import { Grid, Typography } from '@mui/material';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Task from './Task';

export default class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.notStartedColumns = [ // columns to show in the data grid
      { field: 'name', headerName: 'Not Started', width: 300, editable: false},
    ];
    this.inProgressColumns = [ // columns to show in the data grid
      { field: 'name', headerName: 'In Progress', width: 300, editable: false},
    ];
    this.completedColumns = [ // columns to show in the data grid
      { field: 'name', headerName: 'Completed', width: 300, editable: false},
    ];
  }

  filterTasks() {
    this.notStarted = [];
    this.inProgress = [];
    this.completed = [];
    this.props.sprintData.tasks.forEach((task) => {
      if (task.status === 'Not Started') {
        this.notStarted.push(task);
      }
      else if (task.status === 'In Progress') {
        this.inProgress.push(task);
      }
      else {
        this.completed.push(task);
      }
    });
  }

  /*
      Gets the task data corresponding to the provided displayItem, else creating a new TaskData instance if 
      it does not already exist.

      Requires the data and displayItem prop to be set.
    */
      getCorrectRow() {
        return this.props.sprintData.tasks.filter(task => task.id == this.props.displayItem)[0] ?? new TaskData(this.props.displayItem)
      }

  render() {
    this.filterTasks();
    if (this.props.displayItem) {
      return <Task
        rowID={this.props.displayItem}
        teamMembers={this.props.teamMembers}
        returnControl={this.props.handleItemClick}
        editing={this.props.editing}
        data={this.getCorrectRow()}
        saveInfo={this.props.saveInfo}
        showTimeLog={true}
        addTimeLog={this.props.addTimeLog}
        />
    }
    return (
      <Grid container>
        <DataGrid
          rows={this.notStarted.map((task) => { return {id: task.id, name: task.taskName} })}
          columns={this.notStartedColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick = { (rowData) => this.props.handleItemClick(rowData.id) }
        />
        <DataGrid
          rows={this.inProgress.map((task) => { return {id: task.id, name: task.taskName} })}
          columns={this.inProgressColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick = { (rowData) => this.props.handleItemClick(rowData.id) }
        />
        <DataGrid
          rows={this.completed.map((task) => { return {id: task.id, name: task.taskName} })}
          columns={this.completedColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick = { (rowData) => this.props.handleItemClick(rowData.id) }
        />
      </Grid>
    )
  }
}