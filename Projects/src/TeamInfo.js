import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Typography, TextField, Modal, IconButton, Box } from '@mui/material';

// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript 
const validateEmail = (email) => { // Validate the email
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}; 

const addTeamMember = (name, email) => {
  teamMembers.push(new User(teamMembers[teamMembers.length-1].id+1, name, email))
  // ***** ADD BACKEND TO ADD TEAM MEMBER ******* //
};

const teamDuplicateCheck = (name, email) => { // check to ensure no duplicate team members will exist
  for (let i in teamMembers) {
    const member = teamMembers[i]
    if (member.name === name) return 'Team member name already exists';
    if (member.email === email) return 'Team member email already exists';
  }
}

// Exporting the adding team member popup
export function teamMemberModal(open, setOpen, name, setName, email, setEmail, nameError, setNameError, emailError, setEmailError) {
  const handleOpen = () => { setOpen(true); }; // opens the popup
  const handleClose = () => { setOpen(false); }; // closes the popup

  const nameChanged = (e) => { // changes the stored name property
    setName(e.target.value);
    setNameError(e.target.value === ''); // checks if name is valid
  };

  const emailChanged = (e) => { // changes the stored email property
    setEmail(e.target.value);
    const validation = Boolean(validateEmail(e.target.value)) // validates the email
    setEmailError(!validation); // updates the error state
  };

  const popupStyle = { // style for the popup (taken directly from mui)
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 400, bgcolor: 'background.paper', border: '2px solid #000',
    boxShadow: 24, p: 4,
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleOpen}>
        <AddCircleIcon />
      </IconButton>
      <Modal 
          open={open} // open variable tells the popup whether to be open or not
          onClose={handleClose} // handles the closure of the popup
          aria-labelledby="modal-modal-title" // id of the title
          > 
        <Box sx={popupStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Team Member
          </Typography>
          <TextField 
            id="outlined-basic" 
            label="Name"
            variant="outlined" 
            required
            fullWidth 
            value={name} 
            onChange={nameChanged}
            error={nameError} 
            helperText={nameError ? 'Name cannot be blank' : ''}
            />
          <TextField 
            id="outlined-basic" 
            label="Email" 
            variant="outlined" 
            required 
            fullWidth 
            value={email} 
            onChange={emailChanged}
            error={emailError}
            helperText={emailError ? 'Invalid email' : ''}
            />
          <Button 
            color='primary' 
            variant="contained" 
            onClick={() => {
              const memberDuplicateCheck = teamDuplicateCheck(name, email);
              if (memberDuplicateCheck) {
                alert(memberDuplicateCheck); // alert if there is a duplicate
                return;
              }
              addTeamMember(name, email); // otherwise add the team member and close the popup
              handleClose();
            }}
            disabled={nameError || emailError} // add button is disabled if input in invalid
            >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  )
};

const columns = [
  { field: 'id', headerName: 'ID', width: 50},
  { field: 'name', headerName: 'Name', width: 300, editable: false},
  { field: 'email', headerName: 'Email', width: 300, editable: false}
];

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  createData() { return {id: this.id, name: this.name, email: this.email}; }
}

const teamMembers = [
  new User(1, 'User1', 'test1@gmail.com'),
  new User(2, 'User2', 'test1@gmail.com'),
  new User(3, 'User3', 'test1@gmail.com')
];

export default function TeamInfo() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={teamMembers.map((member) => { return member.createData() })}
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