import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';


export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <FormatListNumberedIcon />
      </ListItemIcon>
      <ListItemText primary="Product Backlog" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DirectionsWalkIcon />
      </ListItemIcon>
      <ListItemText primary="Sprint 1" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DirectionsWalkIcon />
      </ListItemIcon>
      <ListItemText primary="Sprint 2" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DirectionsWalkIcon />
      </ListItemIcon>
      <ListItemText primary="Sprint 3" />
    </ListItemButton>
  </React.Fragment>
);
