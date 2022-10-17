/**
 * Burndown Chart creation
 */

import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Component } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register( // registers the chart
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default class BurndownChart extends Component {
    /**
     * Construct the chart
     * @param {Map} props Properties passed down from parent
     */
    constructor(props) {
        super(props);
    }

    /**
     * Get the total estimated time using story points for the sprint
     * @return The total time
     */
    getTotalEstimatedTime() {
        let total = 0;
        this.props.sprintData.tasks.forEach(task => {
            total += task.points * 4;
        });
        return total;
    }

    /**
     * Generate the data set for the chart
     */
    generateDataSet() {
        this.dates = [];
        this.idealVelocity = [];
        this.hoursLeft = [];
        this.actualVelocity = [];

        const totalDays = this.props.sprintData.endDate.diff(this.props.sprintData.startDate, 'd');
        const totalEstTime = this.getTotalEstimatedTime();

        let starting_date = this.props.sprintData.startDate.clone();
        while (starting_date.format('DD/MM/YY') !== this.props.sprintData.endDate.add(1, 'day').format('DD/MM/YY')) {
            this.dates.push(starting_date.format('DD/MM')); // add all date strings to array
            starting_date = starting_date.add(1, 'day'); // add a day to the starting day to continue the loop
        }

        let totalTimeWorked = 0;
        let idealTimeWorked = 0;
        for (let i = 0; i < this.dates.length; i++) {
            let totalTimeOnDate = 0;
            for (let j = 0; j < this.props.sprintData.tasks.length; j++) {
                const task = this.props.sprintData.tasks[j];
                totalTimeOnDate += task.getTotalTimeDate(this.dates[i]);// add up the total time spent on a particular date
            }
            idealTimeWorked += totalEstTime / (totalDays + 1);
            totalTimeWorked += totalTimeOnDate;
            this.actualVelocity.push(totalTimeWorked);
            this.idealVelocity.push(idealTimeWorked);

            const hours = totalEstTime - totalTimeWorked
            if (hours < 0) { // cant have negative hours left
                this.hoursLeft.push(0);
            }
            else {
                this.hoursLeft.push(hours);
            }
        }
    }

    /**
     * Render the burndown chart
     * @returns The burndown chart
     */
    render() {
        this.generateDataSet();
        return (
            <Line // render the line graph
                datasetIdKey='id'
                data={{
                    labels: this.dates, // horizontal labels
                    datasets: [
                        {
                            id: 1,
                            label: 'Actual Velocity',
                            data: this.actualVelocity, // data points
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                        {
                            id: 2,
                            label: 'Ideal Velocity',
                            data: this.idealVelocity, // data points
                            borderColor: 'rgb(0, 200, 0)',
                            backgroundColor: 'rgba(0, 200, 0, 0.5)',
                        },
                        {
                            id: 3,
                            label: 'Hours Left',
                            data: this.hoursLeft, // data points
                            borderColor: 'rgb(200, 10, 59)',
                            backgroundColor: 'rgba(200, 10, 59, 0.5)',
                        },
                    ],
                }}
                options={{
                    responsive: true, // changes size when window does
                    plugins: {
                        legend: true
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
        )
    }
}