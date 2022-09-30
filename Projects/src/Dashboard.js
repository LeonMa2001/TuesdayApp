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
const TeamMembers = LocalStorage.exists(LocalStorage.USERS) ? UserData.fromData(LocalStorage.get(LocalStorage.USERS)) : []
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
    }
  }

  /*
    Sprint creation functions
  */
  createSprint = () => {
    this.setState({creatingSprint: true})
  }

  handleSprintAdd = (name, start_date, end_date) => 
  {
    this.setState({creatingSprint: false})
    if (name != "" && start_date !== null && end_date !== null) {
      addSprint(name, start_date, end_date)
    }
  }

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

  canSprintBeEnabled = () => {
    return !Sprints.every(item => item.status !== "In Progress")
  }

  getSprintTasks() {
    let output = []
    for (let i = 0; i < Sprints.length; i++) {
      output = output.concat(Sprints[i].tasks)
    }
    return output
  }

  /*
    Team member creation functions
  */
  handleTeamMemberAdd = (name, email) => {
    this.setState({creatingTeam: false})
    if (name != "" && email != "" ) {
      addTeamMember(name, email);
    }
  }

  /*
    Task creation / editing functionality
  */
  createNewTask = () => {
    let taskID = LocalStorage.exists(LocalStorage.TASK_ID) ? LocalStorage.get(LocalStorage.TASK_ID) : 0;
    LocalStorage.set(LocalStorage.TASK_ID, ++taskID);

    this.setState({displayTask: taskID, editingTask: true});
  }

  getTaskIndex = (taskID) => {
    for (let i in Tasks) {
      if (Tasks[i].id == taskID) {
        return i
      }
    }
    return -1
  }

  editTask = (rowID) => {
    this.setState({displayTask: rowID, editingTask: true})
  }


  /*
    Dashboard display functionality
  */
  displayPage() {
    if (this.state.page == "product-backlog") {
      return (
        <React.Fragment>
          <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
          <MoveItem open={this.state.moveTask} handleSelectedMoveLocation={this.handleSelectedMoveLocation} sprints={Sprints}/>
          <ProductItemsDataGrid data={Tasks} 
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
          <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
          <TeamMemberModal open={this.state.creatingTeam} handleTeamMemberAdd={this.handleTeamMemberAdd} teamMembers={TeamMembers} />
          <TeamInfo teamMembers={TeamMembers}/>
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
          <NewSprintModal open={this.state.creatingSprint} handleSprintAdd={this.handleSprintAdd} sprints={Sprints}/>
          <DisplaySprint sprintData={sprintData} enableLock={this.canSprintBeEnabled(sprintData)} handleSprintStatusChange={this.handleSprintStatusChange(sprintData)}/>
        </React.Fragment>
      )
    }
    
  }

  toggleDrawer = () => {
    this.setState({open: !this.state.open})
  };

  setPageName = (page) => {
    // Check if we are trying to create a new sprint or just change page
    if (page == "new-sprint") {
      this.createSprint()
    }
    else {
      this.setState({page})
    }
  };

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

  // Create a pop-up when a row is clicked
  // Returns to the main dashboard if rowID is not defined / null
  handleItemClick = (rowID, editing=false) => {
    this.setState({displayTask: rowID, editingTask: editing})
  };

  handleMoveItem = (rowID) => {
    this.setState({moveTask: true, taskToMove: rowID})
  }

  handleSelectedMoveLocation = (moveSprint) => {
    this.setState({moveTask: false})
    for (let i = 0; i < Sprints.length; i++) {
      if (Sprints[i].sprintName == moveSprint) {
        Sprints[i].addTask(this.state.taskToMove)
        break
      }
    }
    LocalStorage.set(LocalStorage.SPRINTS, Sprints);
  }
  
  // Returns control to the Dashboard
  returnControl = () =>  {
    handleItemClick();
  };

  handleAddButtonClick() {
    if (this.state.page === "team") {
      this.setState({creatingTeam: true})
    }
    else if (this.state.page === "product-backlog") {
      this.createNewTask();
    }
  }

  AddButton() {
    return (
      <React.Fragment>
        <IconButton color="inherit" onClick={() => this.handleAddButtonClick()}>
              <AddCircleIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  render() {
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
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
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
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
