import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GroupIcon from '@mui/icons-material/Group';


class ListItems extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => this.props.handleClick("product-backlog")}>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary="Product Backlog" />
        </ListItemButton>
        <ListItemButton onClick={() => this.props.handleClick("sprint-1")}>
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="Sprint 1" />
        </ListItemButton>
        <ListItemButton onClick={() => this.props.handleClick("sprint-2")}>
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="Sprint 2" />
        </ListItemButton>
        <ListItemButton onClick={() => this.props.handleClick("sprint-3")}>
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="Sprint 3" />
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