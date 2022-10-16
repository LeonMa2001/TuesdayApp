/*
Install chart.js package:
npm install chart.js --save
*/

/* TODO: Notes when editting
    When changing a variable to correct call, refactor to change all instances of variable
*/

import { Timeline } from "@material-ui/lab";

// Copied this from TeamTimeDashboard.js
const dates = [];
const data = [];
let starting_date = this.props.start.clone();
while (starting_date.format('DD/MM/YY') !== this.props.end.add(1, 'day').format('DD/MM/YY')) {
    dates.push(starting_date.format('DD/MM')); // add all date strings to array
    data.push(0); // initialise the hours data for each of the dates as 0
    starting_date = starting_date.add(1, 'day'); // add a day to the starting day to continue the loop
}
for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < this.props.teamMembers.length; j++) {
        data[i] += this.props.teamMembers[j].getTotalTimeDate(dates[i]); // add up the total time spent on a particular date
    }
}

//TODO: this needs to store a list of strings that denote the x axis
const labels = [];
for (i=0; i<daysShown); i++{ // Needs to loop over what x axis labels are needed
    labels.append(data[i]) //TODO: This is just a guess, I dont't understand how this data is retrieved yet
}

//TODO: this needs to store a list of selected team member's datasets with given format as shown. 
const datasets = []

// Graph of team members
// This loops over each selected team member and puts data into a unique dataset in the graph
for (i=0; i<allSelectedTeammembers; i++){ //TODO: allSelectedTeammembers needs to replaced with actual check on who is selected for showing of data
  datasets.append({
    label: teammember[i].name, //TODO: Needs to be replaces with actual call to retrieve team member name
    backgroundColor: 'blue',
    borderColor: 'blue',
    data: [0, 2, 5, 2, 7, 1, 2], //TODO: Needs to be replaced with their dataset of hours worked each day
  });
}

// Graph of hours remaining
let hoursRemaining = [hoursTotal]; //TODO: Replace with actual getter to get the total hours of work
for (i=0; i<length(graphTimeline); i++){ //TODO: Replace with how long of a timeline the graph will be
  hoursRemaining.append(hoursRemaining[i] - workDoneOnGivenDay[i]); //TODO: workDoneOnGivenDay needs to be an array of total work done by teammembers on a given day
}
datasets.append({
    label: 'Hours remaining',
    backgroundColor: 'red',
    borderColor: 'red',
    data: hoursRemaining,
});

// Graph of accumilation of effort
let accumilationOfEffort = workDoneOnGivenDay; 
datasets.append({
    label: 'Accumilation of effort',
    backgroundColor: 'orange',
    borderColor: 'orange',
    data: accumilationOfEffort,
});

// Graph of ideal velocity
let idealVelocity = [];
let idealDailyTimeSpent = hoursTotal/totalDays; // TODO: replace totalDays with how many days the ideal velocity is calculated from
// This loops creates a data set for a linear line of ideal velocity
for (i=0; i<length(graphTimeLine); i++){
    if (i == 0){
        idealVelocity.append(hoursTotal-idealDailyTimeSpent)
    }
    idealVelocity.append(idealVelocity[i-1]-idealDailyTimeSpent);
}
datasets.append({
    label: 'Ideal velocity',
    backgroundColor: 'green',
    borderColor: 'green',
    data: idealVelocity,
});

// Creating chart with datasets
let myChart = document.getElementById('myChart').getContext('2d');
let burndownChart = new Chart(mychart, {
  type:'line',
  data:{
    labels:labels,
    datasets:datasets
  },
  options:{}
});