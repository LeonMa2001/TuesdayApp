// TeamMemberView.js
// Last modified: 27/09/22
// Modifier: Samir Gupta

import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, IconButton, Modal, Typography } from '@mui/material';
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register( // registers the chart
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default class TeamMemberView extends React.Component {
  /*
    Construct the component

    @param props   React props passed down from parent
  */
  constructor(props) {
    super(props)
    this.data = [];
    this.dates = [];
    // Credit: MUI 
    this.popupStyle = { // style for the popup (taken directly from mui)
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
    };

  }

  /*
    Generate the data set for the chart for the popup
  */
  __generateDataSet() { // generates the data/date set to be displayed on the graph
    const dates = [];
    const data = [];
    let starting_date = this.props.start.clone();
    while (starting_date.format('DD/MM/YY') !== this.props.end.add(1, 'day').format('DD/MM/YY')) {
      dates.push(starting_date.format('DD/MM')); // add all date strings to array
      data.push(0); // initialise the hours data for each of the dates as 0
      starting_date = starting_date.add(1, 'day'); // add a day to the starting day to continue the loop
    }
    for (let i = 0; i < dates.length; i++) {
      data[i] += this.props.user?.getTotalTimeDate(dates[i]) ?? 0; // add up the total time spent on a particular date
    }
    // write into state
    this.data = data;
    this.dates = dates;
  }

  /*
    Render the modal
  */
  render() {
    this.__generateDataSet();
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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {this.props.user?.name ?? ''}
                </Typography>
              </Grid>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <IconButton onClick={this.props.toggle}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} >
                <Line // render the line graph
                  datasetIdKey='id'
                  data={{
                    labels: this.dates, // horizontal labels
                    datasets: [{
                      id: 1,
                      data: this.data, // data points
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
          </Box>
        </Modal>
      </div>
    )
  }
}