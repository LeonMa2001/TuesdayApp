// TimelogModal.js
// Last modified: 06/10/22
// Modifier: Samir Gupta

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React from 'react';


export default class TimelogModal extends React.Component {
    /*
      Construct the component

      @param props   React props passed down from parent
    */
    constructor(props) {
        super(props)
        this.state = { // initialise state
            name: '',
            time: 0,
            date: dayjs()
        };
        // Credit: MUI 
        this.popupStyle = { // style for the popup (taken directly from mui)
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
        };

    }

    /* 
        Handle when the user is changed

        @param e    The event that triggered the change
    */
    userChange(e) {
        this.setState({ name: e.target.value });
    }

    /*
        Add the log
    */
    addLog() {
        this.props.addTimeLog(this.state.name, this.props.task, this.state.time, this.state.date);
        this.props.toggle();
    }


    /*
      Render the modal
    */
    render() {
        return (
            <div>
                <Modal
                    open={this.props.open} // open variable tells the popup whether to be open or not
                    onClose={this.props.toggle} // handles the closure of the popup
                    aria-labelledby="modal-modal-title" // id of the title
                >
                    <Box sx={this.popupStyle}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={10} style={{ textAlign: "left" }}>
                                <Typography variant="h6" component="h2">
                                    Add Timelog
                                </Typography>
                            </Grid>
                            <Grid item xs={2} style={{ textAlign: "center" }}>
                                <IconButton onClick={() => this.props.toggle()}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: "center" }}>
                                <Typography> Select User </Typography>
                            </Grid>
                            <Grid item xs={8} style={{ textAlign: "center" }}>
                                <FormControl fullWidth>
                                    <Select id='teamMemberSelection' value={this.state.name} onChange={this.userChange.bind(this)}>
                                        {/* Map the options specified in SelectFields to options for this Select */}
                                        {this.props.team.map((member) => {
                                            return <MenuItem key={member.name} value={member.name}>{member.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker // starting date picker
                                        label="Date"
                                        inputFormat="DD/MM/YYYY"
                                        value={this.state.date}
                                        onChange={(newValue) => this.setState({ date: newValue })}
                                        renderInput={(params) => <TextField {...params} />}
                                        disableFuture
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: "center" }}>
                                <Typography>Time (hrs)</Typography>
                            </Grid>
                            <Grid item xs={8} style={{ textAlign: "center" }}>
                                <TextField
                                    value={this.state.time === 0 ? '' : this.state.time}
                                    type="number"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                                    onChange={(e) => {
                                        let value;
                                        try {
                                            value = parseFloat(e.target.value); // ensure inputted value is a valid number
                                            if (isNaN(value)) throw 'NaN';
                                            if (value <= 0) throw 'Negative';
                                        }
                                        catch { value = 0; }
                                        this.setState({ time: value });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <Button
                                    color='primary'
                                    variant="contained"
                                    onClick={() => this.addLog()}
                                    disabled={this.state.name === '' || this.state.time === 0} // add button is disabled if input is invalid
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        )
    }
}

