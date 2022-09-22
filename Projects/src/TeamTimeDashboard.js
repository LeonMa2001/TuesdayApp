// TeamTimeDashboard.js
// Last modified: 22/09/22
// Modifier: Samir Gupta

import React, {Component} from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Grid, TextField } from '@mui/material';

ChartJS.register( // registers the chart
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default class TeamTimeDashboard extends Component {
    // Contruct the dashboard
    constructor(props) {
        super(props);
        const today = dayjs();
        const prev_week = dayjs().subtract(5, 'day'); // originally set the date to start at 5 days before today and end at today
        this.state = {
            start_date: prev_week,
            end_date: today,
            dates: [],
            data: [],
        };
    }

    // Generate the data set to display on the graph
    __generateDataSet() {
        const dates = [];
        const data = [];
        let starting_date = this.state.start_date.clone();
        while (starting_date.format('DD/MM/YY') !== this.state.end_date.add(1, 'day').format('DD/MM/YY')) {
            dates.push(starting_date.format('DD/MM')); // add all date strings to array
            data.push(0); // initialise the hours data for each of the dates as 0
            starting_date = starting_date.add(1, 'day'); // add a day to the starting day to continue the loop
        }
        for (let i = 0; i < dates.length; i++) {
            for (let j = 0; j < this.props.teamMembers.length; j++) {
                data[i] += this.props.teamMembers[j].getTotalTime(dates[i]); // add up the total time spent on a particular date
            }
        }
        // write into state
        this.state.data = data;
        this.state.dates = dates;
    }

    // render the dashboard
    render() {
        this.__generateDataSet(); // generate the data
        return (
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker // starting date picker
                            label="Start date" 
                            inputFormat="DD/MM/YYYY"
                            value={this.state.start_date}
                            onChange={(newValue) => this.setState({start_date: newValue})}
                            maxDate={this.state.end_date.subtract(1, 'day')} // can't be greater than or equal to the end date
                            renderInput={(params) => <TextField {...params} /> }
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker // ending date picker
                            label="End date"
                            inputFormat="DD/MM/YYYY"
                            value={this.state.end_date}
                            onChange={(newValue) => this.setState({end_date: newValue})}
                            minDate={this.state.start_date.add(1, 'day')} // can't be smaller than or equal to the min date
                            disableFuture // can't be in the future
                            renderInput={(params) => <TextField {...params} /> }
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <Line // render the line graph
                        datasetIdKey='id'
                        data={{
                            labels: this.state.dates, // horizontal labels
                            datasets: [{
                                id: 1,
                                data: this.state.data, // data points
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            }],
                        }}
                        options={{
                            responsive: true, // changes size when window does
                            plugins: {
                                legend: false, // no legend
                            },
                            scales: {
                                y: {
                                    type: 'linear', // linear scaling axis
                                    beginAtZero: true,
                                    grace: 1, // shows graph +-1 from highest data point
                                    ticks: {
                                        stepSize: 1
                                    },
                                    title: { // axis title
                                        display: true,
                                        text: 'Number of Hours',
                                    },
                                },
                                x: { 
                                    title: { // axis title
                                        display: true,
                                        text: 'Date',
                                    },
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>
        )
    }
}