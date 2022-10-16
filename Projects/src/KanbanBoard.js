/*
Kanban Board ceation
*/

import { Grid, Typography } from '@mui/material';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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

  render() {
    this.filterTasks();
    console.log(this.inProgress, this.notStarted, this.completed)
    return (
      <Grid container>
        <DataGrid
          rows={this.notStarted.map((task) => { return {id: task.id, name: task.name} })}
          columns={this.notStartedColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          //onRowClick={(rowData) => this.props.toggleView(rowData.id)}
        />
        <DataGrid
          rows={this.inProgress.map((task) => { return {id: task.id, name: task.name} })}
          columns={this.inProgressColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          //onRowClick={(rowData) => this.props.toggleView(rowData.id)}
        />
        <DataGrid
          rows={this.completed.map((task) => { return {id: task.id, name: task.name} })}
          columns={this.completedColumns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          //onRowClick={(rowData) => this.props.toggleView(rowData.id)}
        />
      </Grid>
    )
  }
}