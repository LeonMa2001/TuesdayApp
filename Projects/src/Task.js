import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

// TODO (possibly) make this more readable by making it an object
// Human text bound to the object property as well as a redundency message
// ["Human text", "Field Name", "Empty message text", Error boolean, Error helper text]
const Fields = [
    ["Tag", "tag", "N/A", () => false, ""],
    ["Priority", "priority", "N/A", () => false, ""],
    ["Story Points", "storyPoints", "N/A", (value) => value < 0 || value > 9, "Story Points must be between 0 and 9"],
    ["Assignee", "assignee", "Not Assigned", () => false, ""],
    ["Status", "status", "N/A", () => false, ""],
    ["Type", "type", "N/A", () => false, ""],
    ["Description", "description", "N/A", () => false, ""],
    ["Time Log", "timeLog", "Not setup", () => false, ""]
]

const SelectFields = {
    priority: ["Low", "Medium", "High", "Critical"],
    tag: ["Database", "User Interface", "Testing"],
    status: ["Not Started", "In Progress", "Completed"],
    assignee: ["Aayush S", "Ari F", "Jeffrey Y", "Leon M", "Samir G"], // TODO change this to be dynamic
    type: ["User Story", "Bug"]
}

class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: props.editing ?? false, // nullish coalescing operator (left if not null/undefined, otherwise right)
            ...data[this.props.rowID] // spread operator (thanks FIT2102!)
        } 

        this.handleInputChange.bind(this)
    }

    toggleEditing() {
        if (this.state.editing) { // Save the data (TODO)
            // Check if any fields are erroring
            const isValid = Fields.reduce((acc, item) => {
                return acc && !item[3](this.state[item[1]]) // if any errors, this will return false
            }, true)

            if (isValid) {
                console.log("[DEBUG] Editing stopped. Data to save:")
                console.log(this.state)
                this.setState({editing: false})
            }
        }
        else { // begin editing
            this.setState({editing: true})
        }
    }

    // Keep track of values when they get updated. this.state[] will have the current value of every field.
    handleInputChange(event) {
        this.setState({ 
            [event.target.id ?? event.target.name]: event.target.value
        })
    }

    parseHeader() {
        if (this.state.editing) {
            return (
                <Grid item xs={8} sx={{display: "flex", alignItems: "center"}}>
                    <TextField id={"name"} variant="outlined" fullWidth defaultValue={this.state["name"] ?? ""} 
                    onChange={this.handleInputChange.bind(this)} 
                    error={this.state.name.length == 0} 
                    helperText={this.state.name.length == 0 ? "Story must have a name" : ""} 
                    />
                </Grid>
            )
        }

        return (
            <Grid item xs={8} sx={{display: "flex", alignItems: "center"}}>
                {/* sx={{m:1}} creates a margin of unit size 1*/}
                <Typography
                    component="h2"
                    variant="h6"
                    color="inherit"
                    sx={{m:1}}
                >
                {/* Task Name */}
                {this.state.name} 
                </Typography> 
            </Grid>
        )
    }



    parseData() {
        return Fields.map((item) => { 
            if (this.state.editing) {
                let editField;
                // Create drop-down lists for the required options
                if (["status", "type", "priority", "assignee", "tag"].includes(item[1])) {
                    editField = (
                        <FormControl fullWidth>
                            <Select id={item[1]} name={item[1]} onChange={this.handleInputChange.bind(this)} value={this.state[item[1]] ?? ""}>
                                {/* Map the options specified in SelectFields to options for this Select */}
                                {SelectFields[item[1]].map((curItem) => {
                                    return <MenuItem key={curItem} value={curItem}>{curItem}</MenuItem>
                                })}                              
                            </Select>
                        </FormControl>
                    )
                }
                else {
                    editField = (
                        <TextField id={item[1]} variant="outlined" fullWidth defaultValue={this.state[item[1]] ?? ""} 
                            onChange={this.handleInputChange.bind(this)} 
                            error={item[3](this.state[item[1]])} 
                            helperText={item[3](this.state[item[1]]) ? item[4] : ""}
                            multiline={item[1] == "description"} // this is bad, fix this
                        />
                    )
                }
                return (
                    <Grid item key={item[0]} xs ={5} sx={{m:1}}>
                    <div>
                        <Typography component="h6" variant="h6">
                            {item[0]}
                        </Typography>
                        
                        {editField}
                    </div>
                </Grid>
                )
            }
            return (
            <Grid item key={item[0]} xs ={5} sx={{m:1}}>
                <div>
                    <Typography component="h6" variant="h6">
                        {item[0]}
                    </Typography>
                    <Typography variant="body1" style={{whiteSpace: 'pre-wrap'}} /* handle newlines in the description field */> 
                        {this.state[item[1]] ?? item[2] /* If no data (null or undefined) use redundency message*/}
                    </Typography>
                </div>
            </Grid>)
        })
    }

    render() {
        return (
            <Paper elevation={3}>
            <Grid container>
                {this.parseHeader()}
                <Grid item xs={4} sx={{display: "flex", justifyContent: "flex-end"}}>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{m:1}}> 
                        <Button onClick={() => this.toggleEditing()}>{this.state.editing ? "Save" : "Edit"}</Button>
                        <Button onClick={() => this.props.returnControl()}>Close</Button>
                    </ButtonGroup> 
                </Grid>
                {this.parseData()}

            </Grid>

            </Paper>


        )
    }
}

export default Task;