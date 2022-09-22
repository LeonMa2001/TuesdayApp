import React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Typography, TextField, Modal, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript 
const validateEmail = (email) => { // Validate the email
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}; 

// Exporting the adding team member popup

export class TeamMemberModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open,
      name: "",
      email: "",
      nameError: [],
      emailError: [],
    }
    
    // Credit: MUI 
    this.popupStyle = { // style for the popup (taken directly from mui)
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
    };
  
  }


  toggleState = () => {this.setState({open: !this.state.open})};

  // Handles when name field is changed
  nameChanged = (e) => {
    this.setState({name: e.target.value});
    let error = false;
    let description = "";
    if (e.target.value == "") { // Name cannot be blank
      error = true;
      description = "Invalid name - cannot be blank";
    }
    for (let i in this.props.teamMembers) { // Name cannot already exist
      const member = this.props.teamMembers[i]
      if (member.name === e.target.value) {
        error = true;
        description = "Invalid name - name already exists";
        break;
      }
    }
    this.setState({nameError: [error, description]}) // Update error state
  }

  emailChanged = (e) => {
    this.setState({email: e.target.value});
    let error = false;
    let description = '';
    if (!validateEmail(e.target.value)) { // Email is invalid
      error = true;
      description = 'Invalid email - invalid format';
    }
    for (let i in this.props.teamMembers){ // Email cannot already exist
      const member = this.props.teamMembers[i];
      if (member.email === e.target.value) {
        error = true;
        description = 'Invalid email - email already exists';
        break;
      }
    }
    this.setState({emailError: [error, description]}); // Update error state
  }

  render() {
    return (
      <div>
        <Modal 
            open={this.props.open} // open variable tells the popup whether to be open or not
            onClose={this.toggleState} // handles the closure of the popup
            aria-labelledby="modal-modal-title" // id of the title
            > 
          <Box sx={this.popupStyle}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} style={{textAlign: "center"}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Team Member
                </Typography>
              </Grid>
              <Grid item xs={12} >
                <TextField 
                id="outlined-basic" 
                label="Name"
                variant="outlined" 
                required
                fullWidth 
                value={this.state.name} 
                onChange={this.nameChanged}
                error={this.state.nameError[0]} 
                helperText={this.state.nameError[0] ? this.state.nameError[1] : ''}
                autoComplete='off'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                id="outlined-basic" 
                label="Email" 
                variant="outlined" 
                required 
                fullWidth 
                value={this.state.email} 
                onChange={this.emailChanged}
                error={this.state.emailError[0]}
                helperText={this.state.emailError[0] ? this.state.emailError[1] : ''}
                autoComplete='off'
              />
              </Grid>
              <Grid item xs={12} style={{textAlign: "center"}}>
                <Button 
                color='primary' 
                variant="contained" 
                onClick={() => this.props.handleTeamMemberAdd(this.state.name, this.state.email)}
                disabled={this.state.nameError[0] || this.state.emailError[0]} // add button is disabled if input in invalid
                >
                Add
                </Button>
                <Button
                color='error'
                variant='contained'
                onClick={() => this.props.handleTeamMemberAdd("", "")}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    )
  }
}



// Exporting the main datagrid
export default class TeamInfo extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [ // columns to show in the data grid
      { field: 'name', headerName: 'Name', width: 300, editable: false},
      { field: 'email', headerName: 'Email', width: 500, editable: false},
      { field: 'hours', headerName: 'Total Hours', width: 100, editable: false, type: 'number', align: 'center'},
      { field: 'delete', type: 'actions', getActions: (params) => [
          <GridActionsCellItem 
            icon={<DeleteIcon/>} 
            onClick={() => this.props.handleTeamMemberDelete(params.id)} 
            label="Delete" 
          />
        ]
      }
    ];
  }

  render() {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.props.teamMembers.map((member) => { return member.createData() })}
          columns={this.columns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    )
  }
}
