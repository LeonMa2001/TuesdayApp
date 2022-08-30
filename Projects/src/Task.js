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
        storyPoints: 5,
        assignee: null,
        status: "Not Started",
        timeLog: null,
        type: "User Story",
        description: "Example user story\n\n\n\n\nyes yes very cool"
    },
    {
        id: 2,
        name: "Example story 2",
        tag: "User Interface",
        priority: "Medium",
        storyPoints: 2,
        assignee: null,
        status: "In Progress",
        timeLog: null,
        type: "Bug",
        description: "Even cooler user story"
    },
    {
        id: 3,
        name: "Example story 3",
        tag: "Testing",
        priority: "Low",
        storyPoints: 5,
        assignee: null,
        status: "Completed",
        timeLog: null,
        type: "User Story",
        description: "Done :)"
    }
]

// Human text bound to the object property as well as a redundency message
const Fields = [
    ["Tag", "tag", "N/A"],
    ["Description", "description", "N/A"],
    ["Priority", "priority", "N/A"],
    ["Story Points", "storyPoints", "N/A"],
    ["Assignee", "assignee", "Not Assigned"],
    ["Status", "status", "N/A"],
    ["Type", "type", "N/A"],
    ["Time Log", "timeLog", "Not setup"]
]

class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {editing: props.editing ?? false} // nullish coalescing operator (left if not null/undefined, otherwise right)
    }

    parseData(data) {
        return Fields.map((item) => { 
            return (
            <Grid item key={item[0]} xs ={5} sx={{m:1}}>
                <div>
                    <Typography component="h6" variant="h6">
                        {item[0]}
                    </Typography>
                    <Typography variant="body1">
                        {data[item[1]] ?? item[2] /* If no data (null or undefined) use redundency message*/}
                    </Typography>
                </div>
            </Grid>)
        })
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
                    {console.log(this.parseData(taskData))}
                </Grid>
                <Grid item xs={4} sx={{display: "flex", justifyContent: "flex-end"}}>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{m:1}}> 
                        <Button>Edit</Button>
                        <Button onClick={() => this.props.returnControl()}>Close</Button>
                    </ButtonGroup> 
                </Grid>
                {this.parseData(taskData)}

            </Grid>

            </Paper>


        )
    }
}

export default Task;