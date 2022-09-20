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


const Tasks = LocalStorage.exists(LocalStorage.TASKS) ? TaskData.fromData(LocalStorage.get(LocalStorage.TASKS)) : []
const TeamMembers = LocalStorage.exists(LocalStorage.USERS) ? UserData.fromData(LocalStorage.get(LocalStorage.USERS)) : []

let userID = LocalStorage.exists(LocalStorage.USER_ID) ? LocalStorage.get(LocalStorage.USER_ID) : 0

function addTeamMember(name, email) {
  TeamMembers.push(new UserData(++userID, name, email))
  LocalStorage.set(LocalStorage.USER_ID, userID)
  LocalStorage.set(LocalStorage.USERS, TeamMembers)
}


class DashboardContent extends React.Component {
  constructor() {
    super()
    this.state = {
      open: true,
      page: "product-backlog",
      displayTask: "",
      editingTask: false,
      creatingTeam: false,
    }
  }

  handleTeamMemberAdd = (name, email) => {
    this.setState({creatingTeam: false})
    if (name != "" && email != "" ) {
      addTeamMember(name, email);
    }
  }

  displayPage() {
    if (this.state.page == "product-backlog") {
      return (
        <ProductItemsDataGrid data={Tasks} teamMembers={TeamMembers} editing={this.state.editingTask} displayItem={this.state.displayTask} saveInfo={this.saveInfo} handleItemClick={this.handleItemClick}/>
      )
    }
    return (
      <React.Fragment>
        <TeamMemberModal open={this.state.creatingTeam} handleTeamMemberAdd={this.handleTeamMemberAdd} teamMembers={TeamMembers} />
        <TeamInfo teamMembers={TeamMembers}/>
      </React.Fragment>
    )
  }

  toggleDrawer = () => {
    this.setState({open: !this.state.open})
  };

  setPageName = (page) => {
    this.setState({page})
  };

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

  saveInfo = (info) => {
    let taskIndex = this.getTaskIndex(this.state.displayTask);
    if (taskIndex == -1) {
      Tasks.push(info)
    }
    else {
      Tasks[taskIndex] = info;
    }
    LocalStorage.set(LocalStorage.TASKS, Tasks);
  }

  editTask = (rowID) => {
    this.setState({displayTask: rowID, editingTask: true})
  }

  // Create a pop-up when a row is clicked
  // Returns to the main dashboard if rowID is not defined / null
  handleItemClick = (rowID, editing=false) => {
    this.setState({displayTask: rowID, editingTask: editing})
  };
  
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
              <ListItems handleClick={this.setPageName} />
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
