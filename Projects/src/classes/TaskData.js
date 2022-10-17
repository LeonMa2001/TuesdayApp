/**
 * Class to store all task information
 */

class TaskData {
    /**
     * Construct the Task
     * @param {Number} id The id of the task
     * @param {String} taskName The name of the task
     * @param {String} taskType The type of task
     * @param {Number} points The number of points the task is worth
     * @param {String} status The status of the task
     * @param {String} desc The description of the task
     * @param {String} tag The tag of the task
     * @param {Number} assignee The id of the assignee of the task 
     * @param {String} priority The priority of the task
     * @param {Array<Map>} timeLog List of timelogs for the task
     */
    constructor(id = "", taskName = "", taskType = "", points = null, status = null, desc = "", tag = null, assignee = '', priority = '', timeLog) {
        this._id = id;
        this._taskName = taskName;
        this._taskType = taskType;
        this._points = points;
        this._status = status;
        this._desc = desc;
        this._tag = tag;
        this._assignee = assignee;
        this._priority = priority;
        this._timeLog = timeLog ?? [];
    }

    set taskName(newTaskName) { this._taskName = newTaskName; }
    set taskType(newTaskType) { this._taskType = newTaskType; }
    set points(newPoints) { this._points = newPoints; }
    set status(newStatus) { this._status = newStatus; }
    set desc(newDesc) { this._desc = newDesc; }
    set tag(newTag) { this._tag = newTag; }
    set priority(newPriority) { this._priority = newPriority; }
    set assignee(assignee) { this._assignee = assignee; }
    set id(id) { this._id = id; }


    get taskName() { return this._taskName; }
    get taskType() { return this._taskType; }
    get points() { return this._points; }
    get status() { return this._status; }
    get desc() { return this._desc; }
    get tag() { return this._tag; }
    get timeLog() { return this._timeLog; }
    get priority() { return this._priority; }
    get assignee() { return this._assignee; }
    get id() { return this._id; }

    /**
     * Convert raw data into instances of this class
     * @param {*} dataList The data to convert into this class
     * @returns {Array<TaskData>} A list of instances of this class with the correct data
     */
    static fromData(dataList) {
        return dataList.map(data => {
            return new TaskData(data._id, data._taskName, data._taskType, data._points, data._status, data._desc, data._tag, data._assignee, data._priority, data._timeLog);
        });
    }

    /**
     * 
     * @param {Number} userID The number of the user that worked on this task
     * @param {String} date The data that this task has been worked on (DD/MM)
     * @param {Number} time The amount of time spent on the task on this date
     * @returns The new length of the timelog
     */
    addTimelog = (userID, date, time) => this._timeLog.push({ date: date, time: time, userID: userID })

    /**
     * Get the total time worked on this task
     * @returns The total time worked on this task
     */
    getTotalTime() {
        let total = 0;
        this._timeLog.forEach(log => total += log.time);
        return total;
    }

    /**
     * Get total time worked on task on a particular date
     * @param {dayjs} date 
     * @returns 
     */
    getTotalTimeDate(date) {
        let total = 0;
        for (let i = 0; i < this._timeLog.length; i++) {
            const log = this._timeLog[i];
            if (log.date === date) total += log.time;
        }
        return total;
    }
}

export default TaskData;