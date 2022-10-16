/*
  Main dashboard functionality file.
  Controls data flow in and out of individual components of the program.
*/

import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import { Box, Toolbar, List, Typography, Divider, IconButton, Container, Grid } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItems from './listItems';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ProductItemsDataGrid from './ProductItemsDataGrid';
import TeamInfo, { TeamMemberModal } from './TeamInfo';
import LocalStorage from './classes/LocalStorage';
import TaskData from './classes/TaskData.js';
import UserData from './classes/UserData.js';
import NewSprintModal, { DisplaySprint, MoveItem } from "./Sprint.js"
import SprintData from './classes/SprintData.js'
import TeamTimeDashboard from './TeamTimeDashboard';
import dayjs from 'dayjs';
import TeamMemberView from './TeamMemberView';


/*
  Styling components.
  Credit to MUI.
*/
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
const mdTheme = createTheme();
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © Group 5 FIT2101 '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

/*
  Get data out of Local Storage.
*/
// All Tasks
const Tasks = LocalStorage.exists(LocalStorage.TASKS) ? TaskData.fromData(LocalStorage.get(LocalStorage.TASKS)) : []
// All Team Members
let TeamMembers = LocalStorage.exists(LocalStorage.USERS) ? UserData.fromData(LocalStorage.get(LocalStorage.USERS)) : []

// All Sprints. Tasks are mapped in the .tasks property as a list of task IDs
const Sprints = LocalStorage.exists(LocalStorage.SPRINTS) ? SprintData.fromData(LocalStorage.get(LocalStorage.SPRINTS)) : []
// Current ID for user, used to have unique IDs for users

let userID = LocalStorage.exists(LocalStorage.USER_ID) ? LocalStorage.get(LocalStorage.USER_ID) : 0

/*
  Utility functions to manipulate data storage
*/

/*
  Adds a new team member to local storage. Assumes name and email are valid and checked.

  @param name  The name of the new team member to add.
  @param email The email of the new team member to add.
*/
function addTeamMember(name, email) {
  TeamMembers.push(new UserData(++userID, name, email))
  LocalStorage.set(LocalStorage.USER_ID, userID)
  LocalStorage.set(LocalStorage.USERS, TeamMembers)
}

/* 
  Adds a new sprint to local storage. Assumes name, start_date and end_date are valid and checked.
  
  @param name       The name of the new sprint to add
  @param start_date The start date of the sprint as a dayjs instance
  @param end_date   The end date of the sprint as a dayjs instance
*/
function addSprint(name, start_date, end_date) {
  Sprints.push(new SprintData(name, start_date, end_date, "Not Started"))
  LocalStorage.set(LocalStorage.SPRINTS, Sprints)
}
/*
  Deletes a team member from the TeamMembers list via filtering.

  @param id   The id of the team member to delete.
*/
function deleteTeamMember(id) { // delete a team member
  TeamMembers = TeamMembers.filter((member) => { // filter team members based on their id
    return member.id != id; 
  });
  LocalStorage.set(LocalStorage.USERS, TeamMembers); // update local storage
}

/*
  Overall Dashboard class.
  Controls the data flow between different components as well as managing popup modals, 
  sprint/team member creation, and task viewing/editing.
*/
class DashboardContent extends React.Component {
  constructor() {
    super()
    this.state = {
      open: true,
      page: "product-backlog",
      displayTask: "",
      editingTask: false,
      creatingTeam: false,
      creatingSprint: false,
      taskToMove: "",
      moveTask: false,
      viewingTeamMember: false,
      graphStartDate: dayjs().subtract(5, 'day'),
      graphEndDate: dayjs(), // initialise the dates
      viewMember: undefined
    }
  }

  /*
    Sprint creation functions
  */

  /*
    Changes the state to cause the sprint creation modal to show.
  */
  createSprint = () => {
    this.setState({creatingSprint: true})
  }

  /*
    Validates that the provided sprint data is valid and then saves it, hiding the modal at the same time.

    @param name       The name of the sprint to add
    @param start_date The start date of the sprint as a dayjs instance
    @param end_date   The end date of the sprint as a dayjs instance
  */
  handleSprintAdd = (name, start_date, end_date) => 
  {
    this.setState({creatingSprint: false})
    if (name != "" && start_date !== null && end_date !== null) {
      addSprint(name, start_date, end_date)
    }
  }

  /*
    Given a specific sprint and a new state of the sprint, updates the storage for the sprint 
    and refreshes the rendering to display the change.

    @param sprint   The sprint to update
    @param newState The new status to store for the provided sprint
  */
  handleSprintStatusChange = (sprint) => (newState) => {
    // Find the index to change
    for (let i = 0; i < Sprints.length; i++) {
      if (Sprints[i].sprintName == sprint.sprintName) {
        Sprints[i].status = newState
        break
      }
    }
    LocalStorage.set(LocalStorage.SPRINTS, Sprints);
    this.forceUpdate()
  }

  /*
    Determines if a sprint can be started (as only one sprint can be started at once).
    Returns true if there is already a started sprint.
  */
  disableSprintEnable = () => {
    return !Sprints.every(item => item.status !== "In Progress")
  }

  /*
    Gets the tasks that are assigned to a sprint, for the purposes of hiding them from the product backlog.
    Returns a list of task IDs which correponding to all tasks within sprints.
  */
  getSprintTasks() {
    let output = []
    for (let i = 0; i < Sprints.length; i++) {
      output = output.concat(Sprints[i].tasks)
    }
    return output
  }

  /*
    Team member creation/deletion/graphing functions
  */

  /*
    Validates that the provided team member data is valid and then saves it, hiding the modal at the same time.

    @param name    The name of the team member to add
    @param email   The email of the team member to add

  */
  handleTeamMemberAdd = (name, email) => {
    this.setState({creatingTeam: false})
    if (name != "" && email != "" ) {
      addTeamMember(name, email);
    }
  }

  /*
    Validates that the user wants to delete the specified team member, then deletes them, refreshing the modal at the same time.

    @param id The id of the team member to delete
  */
  handleTeamMemberDelete = (id) => { // deletes a team member
    if (confirm('Are you sure you want to delete this team member?')) {
      deleteTeamMember(id);
      this.setState({creatingTeam: false}); // set a state so that the list of team members re-renders
    }
  }

  /*
    Sets the starting date for the graph in the state

    @param value  The start date to set
  */
  setStart = (value) => { // set the starting date of the team graphs
    this.setState({graphStartDate: value});
  }

  /*
    Sets the end date for the graph in the state

    @param value  The end date to set

  */
  setEnd = (value) => { // set the end date of the team graphs
    this.setState({graphEndDate: value});
  }

  /*
    Changes the state to render the team member stat modal, displaying a team member if id is specified otherwise hiding the modal.

    @param id The id of the team member to view stats for
  */
  toggleViewTeamMember = (id=null) => {
    if (id !== null) {
      this.setState({viewMember: TeamMembers.find((member) => member.id === id)});
    }
    this.setState({viewingTeamMember: !this.state.viewingTeamMember});
  }

  /*
    Task creation / editing functionality
  */

  /*
    Starts the creation of a new task, incrementing the value of taskID to make sure each task has a unique id.
    Then changes the state of the Dashboard to display the task creation screen.
  */
  createNewTask = () => {
    let taskID = LocalStorage.exists(LocalStorage.TASK_ID) ? LocalStorage.get(LocalStorage.TASK_ID) : 0;
    LocalStorage.set(LocalStorage.TASK_ID, ++taskID);

    this.setState({displayTask: taskID, editingTask: true});
  }

  /*
    Gets the index of a task in the Tasks list.
    Each task should have a unique ID.

    @param taskID   The unique ID of the task to search for
  */
  getTaskIndex = (taskID) => {
    for (let i in Tasks) {
      if (Tasks[i].id == taskID) {
        return i
      }
    }
    return -1
  }

  /*
    Modifies the state to start editing a specific task

    @param rowID   The ID of the row which corresponds to a specific task
  */
  editTask = (rowID) => {
    this.setState({displayTask: rowID, editingTask: true})
  }

  /*
    Saves task information in local storage.
    If the task doesn't exist, this adds it to the local storage.

    @param info The task info to add / update in local storage.
  */
    saveTaskInfo = (info) => {
      let taskIndex = this.getTaskIndex(this.state.displayTask);
      if (taskIndex == -1) {
        Tasks.push(info)
      }
      else {
        Tasks[taskIndex] = info;
      }
      LocalStorage.set(LocalStorage.TASKS, Tasks);
    }
  
    /*
      Create a pop-up when a row is clicked
      Returns to the main dashboard if rowID is not defined / null.

      @param rowID    The row ID corresponding to the task that was clicked on.
      @param editing  Whether to begin editing the specified task
    */
    handleItemClick = (rowID, editing=false) => {
      this.setState({displayTask: rowID, editingTask: editing})
    };
  
    /*
      Opens the move item modal when a task is selected to be moved.

      @param rowID  The row ID corresponding to the task that should be moved into a sprint.
    */
    handleMoveItem = (rowID) => {
      this.setState({moveTask: true, taskToMove: rowID})
    }
  
    /*
      Moves the specified task into the selected sprint and updates local storage accordingly.
      The task to move should be stored in this.state.taskToMove

      @param moveSprint   The name of the sprint to move the task to.
    */
    handleSelectedMoveLocation = (moveSprint) => {
      this.setState({moveTask: false})
      for (let i = 0; i < Sprints.length; i++) {
        if (Sprints[i].sprintName == moveSprint) {
          Sprints[i].addTask(Tasks.find((task) => task.id === this.state.taskToMove))
          break
        }
      }
      LocalStorage.set(LocalStorage.SPRINTS, Sprints);
    }
    
    // Returns control to the Dashboard
    returnControl = () =>  {
      handleItemClick();
    };


  /*
    Dashboard display functionality
  */

  /*
    Main Dashboard logic.
    Sprint Creation modal is on each sub-page so that sprint creation can be done from any part of the screen.
  */
  displayPage() {
    if (this.state.page == "product-backlog") {
      return (
        <React.Fragment>
          {/* Allow sprint creation */}
          <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
          {/* Modal to allow tasks to be moved out of sprints */}
          <MoveItem open={this.state.moveTask} handleSelectedMoveLocation={this.handleSelectedMoveLocation} sprints={Sprints}/>
          {/* DataGrid of Tasks*/}
          <ProductItemsDataGrid data={Tasks} 
            teamMembers={TeamMembers}
            editing={this.state.editingTask}
            displayItem={this.state.displayTask} 
            saveInfo={this.saveTaskInfo} 
            handleItemClick={this.handleItemClick} 
            handleMoveItem={this.handleMoveItem}
            sprintTasks={this.getSprintTasks()}/>
        </React.Fragment>
      )
    }
    else if (this.state.page == "team") {
      return (
        <React.Fragment>
        {/* Allow sprint creation */}
        <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
        <Grid container spacing={3} alignItems="center">
          {/* Display time graph */}
          <Grid item xs={12} style={{textAlign: "center"}}>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Team Timelog Graph
            </Typography>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} style={{textAlign: "center"}}>
            <TeamTimeDashboard teamMembers={TeamMembers} start={this.state.graphStartDate} end={this.state.graphEndDate} setStart={this.setStart} setEnd={this.setEnd}/>
          </Grid>
          <Grid item xs={2}></Grid>
          {/* Allow team member creation*/}
          <TeamMemberModal open={this.state.creatingTeam} handleTeamMemberAdd={this.handleTeamMemberAdd} teamMembers={TeamMembers} />
          {/* Add ability to view specific team member stats */}
          <TeamMemberView open={this.state.viewingTeamMember} start={this.state.graphStartDate} end={this.state.graphEndDate} toggle={this.toggleViewTeamMember} user={this.state.viewMember}/>
          <Grid item xs={12} style={{textAlign: "center"}}>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Team Members
            </Typography>
          </Grid>
          {/* See all team members */}
          <Grid item xs={12} style={{textAlign: "center"}}>
            <TeamInfo teamMembers={TeamMembers} handleTeamMemberDelete={this.handleTeamMemberDelete} toggleView={this.toggleViewTeamMember}/>
          </Grid>
        </Grid>
      </React.Fragment>
      )
    }
    else {
      // Should be a sprint, so try to get the info for the sprint
      let sprintData = Sprints.find(item => item.sprintName == this.state.page) // returns undefined if nothing
      if (!sprintData) {
        return (
          <Typography>
            Shouldn't be here!
          </Typography>
      )}

      return (
        <React.Fragment>
          {/* Allow sprint creation */}
          <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
          {/* Display information on the current sprint*/}
          <DisplaySprint taskData={Tasks} sprintData={sprintData} enableLock={this.disableSprintEnable(sprintData)} handleSprintStatusChange={this.handleSprintStatusChange(sprintData)}/>
        </React.Fragment>
      )
    }

    /* TODO:
    let filteredData = this.props.taskData.filter(task => this.props.sprintData.tasks.includes(task.id))
    // list of tasks to display with all the data
    // This returns a list of objects into filteredData and allows access for me to retrieve the specific to tasks
    // and put them into the kanban board automatically.
    */
    
  }

  /*
    Toggle the state of the drawer (either expand or close)
  */
  toggleDrawer = () => {
    this.setState({open: !this.state.open})
  };

  /*
    Set the specific page that we want to look at.
    If we are trying to create a sprint, then open the specific modal.
    Otherwise just move to the specified page

    @param page The page to move to
  */
  setPageName = (page) => {
    // Check if we are trying to create a new sprint or just change page
    if (page == "new-sprint") {
      this.createSprint()
    }
    else {
      this.setState({page})
    }
  };

  /*
    Add Button functionality
  */

  /*
    Changes the state accordingly when the add button is pressed based on the current page that is being viewed.
    Does nothing if the user is looking at a sprint.
  */
  handleAddButtonClick() {
    if (this.state.page === "team") {
      this.setState({creatingTeam: true})
    }
    else if (this.state.page === "product-backlog") {
      this.createNewTask();
    }
  }

  /*
    Returns the React object to render for the Add Button (modularity!)
  */
  AddButton() {
    return (
      <React.Fragment>
        <IconButton color="inherit" onClick={() => this.handleAddButtonClick()}>
              <AddCircleIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  /* 
    Main render function. Combines all the functions and sub-classes above/in other files to render the Dashboard.
  */
  render() {
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {/* Toolbar */}
          <AppBar position="absolute" open={this.state.open}>
            <Toolbar
              sx={{
                pr: '20px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(this.state.open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton> 
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {/* Page Header */}
                Product Backlog  
              </Typography> 
              {this.AddButton()}
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={this.state.open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              {/* Toolbar collapse/expand */}
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            {/* Page navigation via ListItems*/}
            <List component="nav">
              <ListItems handleClick={this.setPageName} data={Sprints}/>
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>             
                <Grid item xs={12}>
                  {/* Display all other parts of the page dependent on what page we are on.*/ }
                  {this.displayPage()}
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default function Dashboard() {
  return <DashboardContent />;
}
