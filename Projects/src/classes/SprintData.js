/**
 * Sprint Data class to store all data included in a sprint
 */

import dayjs from 'dayjs';
import TaskData from './TaskData';

class SprintData {
    /**
     * Construct the data object
     * @param {String} sprintName 
     * @param {dayjs} startDate 
     * @param {dayjs} endDate 
     * @param {String} status 
     * @param {Array<TaskData>} tasks 
     */
    constructor(sprintName, startDate, endDate, status, tasks = []) {
        this._sprintName = sprintName;
        this._startDate = startDate;
        this._endDate = endDate;
        this._status = status;
        this._tasks = tasks;
    }

    get sprintName() { return this._sprintName; }
    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
    get status() { return this._status }
    get tasks() { return this._tasks; }

    set sprintName(name) { this._sprintName = name; }
    set startDate(date) { this._startDate = date; }
    set status(status) { this._status = status; }
    set endDate(date) { this._endDate = date; }
    length() { return this._tasks.length; }

    /**
     * Add a task to the sprint tasks   
     * @param {TaskData} task The task to add
     */
    addTask(task) { this._tasks.push(task); }

    /**
     * Converts raw data into instances of this class
     * @param {*} dataList The data stored in local storage
     * @returns {Array<SprintData>} A list of instances of this class
     */
    static fromData(dataList) {
        return dataList.map(data => {
            return new SprintData(data._sprintName, dayjs(data._startDate), dayjs(data._endDate), data._status, TaskData.fromData(data._tasks));
        });
    }
}

export default SprintData;






