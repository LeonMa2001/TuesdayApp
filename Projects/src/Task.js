import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import TimelogModal from './TimelogModal';


// TODO (possibly) make this more readable by making it an object
// Human text bound to the object property as well as a redundency message
// ["Human text", "Field Name", "Empty message text", Error boolean, Error helper text]
const Fields = [
    ["Tag", "tag", "N/A", () => false, ""],
    ["Priority", "priority", "N/A", () => false, ""],
    ["Story Points", "points", "N/A", (value) => value < 0 || value > 9, "Story Points must be between 0 and 9"],
    ["Assignee", "assignee", "N/A", () => false, ""],
    ["Status", "status", "N/A", () => false, ""],
    ["Type", "taskType", "N/A", () => false, ""],
    ["Description", "desc", "N/A", () => false, ""],
    ["Time Log", "timeLog", "N/A", () => false, ""]
]

const SelectFields = {
    priority: ["Low", "Medium", "High", "Critical"],
    tag: ["Core", "User Interface", "Testing"],
    status: ["Not Started", "In Progress", "Completed"],
    assignee: [],
    taskType: ["User Story", "Bug"]
}


class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: props.editing ?? false, // nullish coalescing operator (left if not null/undefined, otherwise right)
            data: this.props.data,
            addingTimeLog: false
        }

        this.handleInputChange.bind(this)

        SelectFields.assignee = [];
        this.props.teamMembers.forEach(member => {
            SelectFields.assignee.push(member.name);
        });
    }


    toggleEditing() {
        if (this.state.editing) {
            // Check if any fields are erroring
            const isValid = Fields.reduce((acc, item) => {
                return acc && !item[3](this.state.data[item[1]]); // if any errors, this will return false
            }, true);

            if (isValid) {
                this.setState({ editing: false });
                this.props.saveInfo(this.state.data);
            }
        }
        else { // begin editing
            this.setState({ editing: true });
        }
    }

    // Keep track of values when they get updated. this.state[] will have the current value of every field.
    handleInputChange(event) {
        this.state.data[event.target.id ?? event.target.name] = event.target.value;
        this.setState({
            data: this.state.data
        });
    }

    // Toggle the timelog modal
    toggleTimeLog() {
        this.setState({ addingTimeLog: !this.state.addingTimeLog });
    }

    // Header is the only field that is required, so handle it separately:
    parseHeader() {
        if (this.state.editing) {
            return (
                <Grid item xs={8} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField id={"taskName"} variant="outlined" fullWidth defaultValue={this.state.data.taskName ?? ""}
                        onChange={this.handleInputChange.bind(this)}
                        error={this.state.data.taskName.length == 0}
                        helperText={this.state.data.taskName.length == 0 ? "Story must have a name" : ""}
                    />
                </Grid>
            );
        }

        return (
            <Grid item xs={8} sx={{ display: "flex", alignItems: "center" }}>
                {/* sx={{m:1}} creates a margin of unit size 1*/}
                <Typography
                    component="h2"
                    variant="h6"
                    color="inherit"
                    sx={{ m: 1 }}
                >
                    {/* Task Name */}
                    {this.state.data.taskName}
                </Typography>
            </Grid>
        )
    }


    // Parse the rest of the data and return either text or an editing box depending on type
    parseData() {
        return Fields.map((item) => {
            if (item[1] == 'timeLog' && !this.props.showTimeLog) {
                return;
            }
            if (this.state.editing) {
                let editField;
                // Create drop-down lists for the required options
                if (["status", "taskType", "priority", "assignee", "tag"].includes(item[1])) {
                    editField = (
                        <FormControl fullWidth>
                            <Select id={item[1]} name={item[1]} onChange={this.handleInputChange.bind(this)} value={this.state.data[item[1]] ?? ""}>
                                {/* Map the options specified in SelectFields to options for this Select */}
                                {SelectFields[item[1]].map((curItem) => {
                                    return <MenuItem key={curItem} value={curItem}>{curItem}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    )
                }
                else if (item[1] === 'timeLog') {
                    editField = (
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6} style={{ textAlign: "left" }}>
                                <Typography>
                                    Total : {this.state.data.getTotalTime()} hrs
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: "center" }}>
                                <IconButton color="inherit" onClick={() => this.toggleTimeLog()}>
                                    <AddCircleIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    );
                }
                // Otherwise use text boxes
                else if (item[1] == 'points') {
                    editField = (
                        <TextField
                            fullWidth
                            value={this.state.data.points}
                            type="number"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 9 }}
                            onChange={(e) => {
                                let value;
                                try {
                                    value = parseFloat(e.target.value); // ensure inputted value is a valid number
                                    if (isNaN(value)) throw 'NaN';
                                    if (value < 0) throw 'Negative';
                                    if (value > 9) throw 'Too high'
                                }
                                catch (err) {
                                    value = err == 'Too High' ? 9 : 0;
                                }
                                this.state.data.points = value;
                                this.setState({
                                    data: this.state.data
                                });
                            }}
                        />
                    );
                }
                else {
                    editField = (
                        <TextField id={item[1]} variant="outlined" fullWidth defaultValue={this.state.data[item[1]] ?? ""}
                            onChange={this.handleInputChange.bind(this)}
                            error={item[3](this.state.data[item[1]])}
                            helperText={item[3](this.state.data[item[1]]) ? item[4] : ""}
                            multiline={item[1] == "description"} // this is bad, fix this
                        />
                    )
                }
                return (
                    <Grid item key={item[0]} xs={5} sx={{ m: 1 }}>
                        <div>
                            <Typography component="h6" variant="h6">
                                {item[0]}
                            </Typography>

                            {editField}
                        </div>
                    </Grid>
                )
            }
            // Not editing so just put the actual text
            return (
                <Grid item key={item[0]} xs={5} sx={{ m: 1 }}>
                    <div>
                        <Typography component="h6" variant="h6">
                            {item[0]}
                        </Typography>
                        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }} /* handle newlines in the description field */>
                            {
                                item[1] == 'timeLog' ?
                                    `Total: ${this.state.data.getTotalTime()} hrs` :
                                    this.state.data[item[1]] ?? item[2] /* If no data (null or undefined) use redundency message*/
                            }
                        </Typography>
                    </div>
                </Grid>)
        })
    }

    render() {
        return (
            <Paper elevation={3}>
                <TimelogModal
                    open={this.state.addingTimeLog}
                    toggle={this.toggleTimeLog.bind(this)}
                    task={this.state.data}
                    team={this.props.teamMembers}
                    addTimeLog={this.props.addTimeLog}
                />
                <Grid container>
                    {this.parseHeader()}
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ m: 1 }}>
                            <Button onClick={() => this.toggleEditing()} disabled={this.state.data.taskName === ''}>{this.state.editing ? "Save" : "Edit"}</Button>
                            {
                                !this.state.editing ? // only show the close button on the view page not the edit page
                                    <Button onClick={() => this.props.returnControl()}>Close</Button> :
                                    ''
                            }
                        </ButtonGroup>
                    </Grid>
                    {this.parseData()}
                </Grid>

            </Paper>
        )
    }
}

export default Task;

// Testing branch