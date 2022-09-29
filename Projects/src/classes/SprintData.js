const dayjs = require('dayjs')


class SprintData {
    constructor(sprintName = "", startDate, endDate, status, tasks = []) {
        this._sprintName = sprintName;
        this._startDate = startDate;
        this._endDate = endDate;
        this._status = status;
        this._tasks = tasks;
    }

    get sprintName() {return this._sprintName;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get status() {return this._status}
    get tasks() {return this._tasks;}

    set sprintName(name) { this._sprintName = name; }
    set startDate(date) { this._startDate = date; }
    set status(status) {this._status = status; }
    set endDate(date) { this._endDate = date; }
    length() { return this._tasks.length; }

    addTask(task) {
        this._tasks.push(task)
    }

    // TODO delete task method

    static fromData(dataList){
        return dataList.map(data => {
            return new SprintData(data._sprintName, dayjs(data._startDate), dayjs(data._endDate), data._status, data._tasks);
        })
    }
}

export default SprintData;






