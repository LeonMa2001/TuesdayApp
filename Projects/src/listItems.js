/*
  Sidebar functionality. Allows for the dynamic creation of list rows based on sprint creations.
*/

import { DirectionsWalk as DirectionsWalkIcon, FormatListNumbered as FormatListNumberedIcon, Group as GroupIcon } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Component, Fragment } from 'react';

class ListItems extends Component {
  constructor(props) {
    super(props);
  }

  /*
    Renders the main taskbar list.
    This includes the Product Backlog, New Sprint button, Team management page, as well as the dynamically
    created list of Sprints.
  */
  render() {
    return (
      <Fragment>
        <ListItemButton
          selected={this.props.page === "product-backlog"}
          onClick={() => this.props.handleClick("product-backlog")}
        >
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary="Product Backlog" />
        </ListItemButton>
        <ListItemButton
          selected={this.props.page === "sprints"}
          onClick={() => this.props.handleClick("sprints")}
        >
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="Sprints" />
        </ListItemButton>
        <ListItemButton
          selected={this.props.page === "team"}
          onClick={() => this.props.handleClick("team")}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Team" />
        </ListItemButton>
      </Fragment>
    )
  }
}

export default ListItems;