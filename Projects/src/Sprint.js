/*
  Sprint page rendering.
*/
import React from 'react';
import { Button, Typography, TextField, Modal, Box, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
 
//TODO: Started here
import { Avatar, Card, CardContent, Chip } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const defaultState = {
    name: "",
    start_date: null, 
    end_date: null,
    status: "",
    nameError: [],
    timeError: []
}


export default class NewSprintModal extends React.Component {
  /*
    Sprint creation modal.
    Checks to make sure data is valid.
  */
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
  

  /*
    Resets the state of the sprint modal so that all information is removed when it is next opened.
  */
  toggleState = () => {
      this.setState({...defaultState})
    };

  /*
    Handles when the name field is changed, ensuring it is a unique name for the sprint.

    @param e  The field change event
  */
  nameChanged = (e) => {
    this.setState({name: e.target.value});
    let error = false;
    let description = "";
    if (e.target.value == "") { // Name cannot be blank
      error = true;
      description = "Invalid name - cannot be blank";
    }
    const matches = this.props.sprints.filter(item => item.sprintName == e.target.value) // Name cannot already exist
    if (matches.length) {
        error = true;
        description = "Invalid name - name already exists";
    }
    this.setState({nameError: [error, description]}) // Update error state
  }


  /*
    Main rendering ffunction.
  */
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
                {/* Header text */}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Sprint
                </Typography>
              </Grid>
              <Grid item xs={12} >
                {/* Name field */}
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
                {/* Calendar option for sprint start date */}
                {this.createTimePicker("Sprint Start Date *", "start_date")}
              </Grid>
              <Grid item xs={12} >
                {/* Calendar option for sprint end date */}
                {this.createTimePicker("Sprint End Date *", "end_date")}
              </Grid>
              <Grid item xs={12} style={{textAlign: "center"}}>
                {/* Add button */}
                <Button 
                color='primary' 
                variant="contained" 
                onClick={() => {this.props.handleSprintAdd(this.state.name, this.state.start_date, this.state.end_date); this.toggleState()}}
                disabled={this.state.name == "" || this.state.start_date === null 
                        || this.state.end_date === null || this.state.nameError[0] || this.state.timeError[0]
                } // add button is disabled if input is invalid
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
  /*  
    Displays sprint data and (in a future sprint) the Kanban board of tasks
  */
  constructor(props) {
      super(props)
  }

  /*
    Main render function.
  */
  render() {
      return (
          <Paper elevation={3}>
              <Grid container>
                  <Grid item xs={8} sx={{display: "flex", alignItems: "left"}}>
                      {/* Display sprint name */}
                      <Typography variant="h4">
                          <b>
                          {"Sprint: " + this.props.sprintData.sprintName}
                          </b>
                      </Typography>
                  </Grid>
                  {/* Display button to change sprint status */}
                  <Grid item xs={4} sx={{display: "flex", justifyContent: "flex-end"}}>
                      <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{m:1}}> 
                          <Button 
                              disabled={this.props.enableLock && !this.props.sprintData.status == "In Progress" || this.props.sprintData.status == "Completed"} 
                              onClick={() => this.props.handleSprintStatusChange(nextStatus[this.props.sprintData.status])}>
                              {this.props.sprintData.status == "Not Started" ? "Start Sprint" : this.props.sprintData.status == "In Progress" ? "End Sprint" : "Sprint Over"}
                          </Button>
                      </ButtonGroup> 
                  </Grid>
                  {/* Display information about the sprint (start + end date, sprint status) */}
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
                      {/* <Board>
                        Board
                        </Board> */}
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
  /*
    Modal to allow movement of tasks into sprints
  */
  constructor(props) {
      super(props)
  }

  // Credit: MUI 
  popupStyle = { // style for the popup (taken directly from mui)
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
    };

  /*
    Takes the list of sprints, filters to only include non-active and non-completed sprints, and creates the React component to render.
  */
  formatSprints() {
      return this.props.sprints.filter(sprint => sprint.status == "Not Started")
      .map(sprint => {
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

  /*
    Main rendering function
  */
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
              <Grid item xs={12} style={{textAlign: "center"}}>
                {/* Cancel button */}
                <Button
                color='error'
                variant='contained'
                onClick={() => {this.props.handleSelectedMoveLocation("")}}
                >
                  Cancel
                </Button>
              </Grid>
              </Box>
            </Modal>
          </div>
        )
  }
}

// Leon started here
/*
export const Board = ({ board }) => {
  const classes = useStyles()
  return (
    <Card
      className={clsx(classes.cardRoot, {
        waitingBoard: board.status === "Waiting",
        successBoard: board.status === "Approved"
      })}
      variant="outlined"
      style={{ borderLeft: `5px solid ${board.category.color}` }}
    >
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h6">
            {board.title}
          </Typography>
          <Grid item xs={12}>
            <Box component="small" m={1}>
              <Typography variant='body2'>{board.start}</Typography>
            </Box>
            { <Box component="small" m={1}>
              <Typography variant='body2'>{board.status}</Typography>
            </Box> }
          </Grid>
          <Grid item xs={12} className={classes.bottomBox}>
            {
              board.category.title && <Chip
                size="small"
                label={board.category.title}
                style={{ backgroundColor: board.category.color, color: '#fff' }}
              />
            }
            <AvatarGroup max={4} className={classes.members}>
              {board.members.map(item => {
                return (
                  <Avatar key={item.id} alt={item.name} src={`/${item.avatar}.jpg`} />
                )
              })}
            </AvatarGroup>
          </Grid>
        </CardContent>
      </div>
    </Card>
  )
}
*/