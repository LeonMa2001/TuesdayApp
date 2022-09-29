import React from 'react';
import { Button, Typography, TextField, Modal, Box, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
 

const defaultState = {
    name: "",
    start_date: null, 
    end_date: null,
    status: "",
    nameError: [],
    timeError: []
}


export default class NewSprintModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        ...defaultState,
        open: this.props.open,
    }
    
    // Credit: MUI 
    this.popupStyle = { // style for the popup (taken directly from mui)
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
    };
  
  }

  /*
    Handle when a time field is changed, returning an error if the time is either empty or end date > start date

    @param e            The event fired by a change in time state
    @param state_name   The specific time to change, either start_time or end_time
  */
  timeChanged = (e, state_name) => {
    this.setState({[state_name]: e})

    let error = false;
    let description = "";

    // End time < Start time
    if (this.state.start_date && this.state.end_date && this.state.end_date.isBefore(this.state.start_date)) {
        error = true;
        description = "End date cannot be less than start date"
    }

    this.setState({timeError: [error, description]})
  }

  /*
    Dynamically create a time picker by providing a label for the picker as well as the corresponding state data name

    @param label        The label to be rendered on the time picker
    @param state_name   The corresponding state data name
  */
  createTimePicker = (label, state_name) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            label={label}
            disablePast
            value={this.state[state_name]}
            inputFormat="DD/MM/YYYY"
            onChange={(e) => this.timeChanged(e, state_name)}
            required
            renderInput={(params) => <TextField {...params} helperText={state_name == "end_date" && this.state.timeError[0] ? this.state.timeError[1] : ""}/>}
            error={state_name == "end_date" && this.state.timeError[0]}
        />
    </LocalizationProvider>
    )
  

  toggleState = () => {
      this.setState({...defaultState})
    };

  // Handles when name field is changed
  nameChanged = (e) => {
    this.setState({name: e.target.value});
    let error = false;
    let description = "";
    if (e.target.value == "") { // Name cannot be blank
      error = true;
      description = "Invalid name - cannot be blank";
    }
    const matches = this.props.sprints.filter(item => item.sprintName == e.target.value)
    if (matches.length) {
        error = true;
        description = "Invalid name - name already exists";
    }
    this.setState({nameError: [error, description]}) // Update error state
  }


  render() {
    return (
      <div>
        <Modal 
            open={this.props.open} // open variable tells the popup whether to be open or not
            onClose={() => this.toggleState} // handles the closure of the popup
            aria-labelledby="modal-modal-title" // id of the title
            > 
          <Box sx={this.popupStyle}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} style={{textAlign: "center"}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Sprint
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
              <Grid item xs={12} >
                {this.createTimePicker("Sprint Start Date *", "start_date")}
              </Grid>
              <Grid item xs={12} >
                {this.createTimePicker("Sprint End Date *", "end_date")}
              </Grid>
              <Grid item xs={12} style={{textAlign: "center"}}>
                <Button 
                color='primary' 
                variant="contained" 
                onClick={() => {this.props.handleSprintAdd(this.state.name, this.state.start_date, this.state.end_date); this.toggleState()}}
                disabled={this.state.name == "" || this.state.start_date === null 
                        || this.state.end_date === null || this.state.nameError[0] || this.state.timeError[0]
                } // add button is disabled if input in invalid
                >
                Add
                </Button>
                <Button
                color='error'
                variant='contained'
                onClick={() => {this.props.handleSprintAdd("", ""); this.toggleState()}}
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

const nextStatus = {
    "Not Started": "In Progress",
    "In Progress": "Completed",
    "Completed": "N/A"
}

// TODO add actual sprint rendering stuff here
export class DisplaySprint extends React.Component { 
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Paper elevation={3}>
                <Grid container>
                    <Grid item xs={8} sx={{display: "flex", alignItems: "left"}}>
                        <Typography variant="h4">
                            <b>
                            {"Sprint: " + this.props.sprintData.sprintName}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{display: "flex", justifyContent: "flex-end"}}>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{m:1}}> 
                            <Button 
                                disabled={this.props.enableLock && !this.props.sprintData.status == "In Progress" || this.props.sprintData.status == "Completed"} 
                                onClick={() => this.props.handleSprintStatusChange(nextStatus[this.props.sprintData.status])}>
                                {this.props.sprintData.status == "Not Started" ? "Start Sprint" : this.props.sprintData.status == "In Progress" ? "End Sprint" : "Sprint Over"}
                            </Button>
                        </ButtonGroup> 
                    </Grid>
                    <Grid item xs={12} sx={{m:1}}>
                        <Typography>
                            {"Start date: " + this.props.sprintData.startDate.format('DD/MM/YYYY')}
                        </Typography>
                        <Typography>
                            {"End date: " + this.props.sprintData.endDate.format('DD/MM/YYYY')}
                        </Typography>
                        <Typography>
                            {"Status: " + this.props.sprintData.status}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{m:1}}>
                        <Typography>
                            Not implemented
                        </Typography>
                    </Grid>

                </Grid>
            </Paper>
            
        )
    }
}


export class MoveItem extends React.Component {
    constructor(props) {
        super(props)
    }

    // Credit: MUI 
    popupStyle = { // style for the popup (taken directly from mui)
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
      };

    formatSprints() {
        return this.props.sprints.map(sprint => {
            return (
                <Grid item key={sprint.sprintName} xs={12} style={{textAlign: "center"}}>
                    <Button onClick={() => this.props.handleSelectedMoveLocation(sprint.sprintName)}>
                    <Typography>
                            {sprint.sprintName}
                        </Typography>
                    </Button>
                </Grid>
            )
        })
    }

    render() { 
        return (
            <div>
              <Modal 
                  open={this.props.open} // open variable tells the popup whether to be open or not
                  onClose={() => this.toggleState} // handles the closure of the popup
                  aria-labelledby="modal-modal-title" // id of the title
                  > 
                <Box sx={this.popupStyle}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} style={{textAlign: "center"}}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                      Move To
                      </Typography>
                    </Grid>
                    {this.formatSprints()}
                </Grid>
                </Box>
              </Modal>
            </div>
          )
    }
}
