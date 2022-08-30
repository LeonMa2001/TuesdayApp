import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';

const data = [
    {
        id: 1,
        name: "Example story 1",
        tag: "Database",
        priority: "High",
        storyPoints: 5
    },
    {
        id: 2,
        name: "Example story 2",
        tag: "User Interface",
        priority: "Medium",
        storyPoints: 2
    },
    {
        id: 3,
        name: "Example story 3",
        tag: "Testing",
        priority: "Low",
        storyPoints: 5
    }
]

class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {editing: props.editing ?? false} // nullish coalescing operator (left if not null/undefined, otherwise right)
    }

    render() {
        let taskData = data[this.props.rowID]
        return (
            <Paper elevation={3}>
            <Grid container>
                {/* sx options center the text vertically */}
                <Grid item xs={8} sx={{display: "flex", alignItems: "center"}}>
                    {/* sx={{m:1}} creates a margin of unit size 1*/}
                    <Typography
                        component="h2"
                        variant="h6"
                        color="inherit"
                        sx={{m:1}}
                    >
                    {/* Task Name */}
                    {taskData.name} 
                    </Typography> 
                </Grid>
                <Grid item xs={4} sx={{display: "flex", justifyContent: "flex-end"}}>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{m:1}}> 
                        <Button>Edit</Button>
                        <Button onClick={() => this.props.returnControl()}>Close</Button>
                    </ButtonGroup> 
                </Grid>

            </Grid>

            </Paper>


        )
    }
}

export default Task;