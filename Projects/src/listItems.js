/*
  Sidebar functionality. Allows for the dynamic creation of list rows based on sprint creations.
*/

import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GroupIcon from '@mui/icons-material/Group';
import AddBox from '@mui/icons-material/AddBox';


class ListItems extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
    Generates the React components based on the provided Sprint information passed as a prop.
  */
  getSprints() {
    return this.props.data.map((item) => {
      return (
        <ListItemButton key={item.sprintName} onClick={() => this.props.handleClick(item.sprintName)}>
          <ListItemIcon>
            
          </ListItemIcon>
          <ListItemText primary={item.sprintName} />
        </ListItemButton>
      )
    })
  }

  /*
    Renders the main taskbar list.
    This includes the Product Backlog, New Sprint button, Team management page, as well as the dynamically
    created list of Sprints.
  */
  render() {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => this.props.handleClick("product-backlog")}>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary="Product Backlog" />
        </ListItemButton>
        <ListItemButton onClick={() => this.props.handleClick("sprints")}>
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="Sprints" />
        </ListItemButton>
        {this.getSprints()}
        <ListItemButton onClick={() => this.props.handleClick("new-sprint")}>
          <ListItemIcon>
            <AddBox />
          </ListItemIcon>
          <ListItemText primary="New Sprint" />
        </ListItemButton>
        <ListItemButton onClick={() => this.props.handleClick("team")}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Team" />
        </ListItemButton>
        
      </React.Fragment>
      )
  }
}

export default ListItems;