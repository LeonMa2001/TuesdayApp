class TaskData {
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

    static fromData(dataList) {
        return dataList.map(data => {
            return new TaskData(data._id, data._taskName, data._taskType, data._points, data._status, data._desc, data._tag, data._assignee, data._priority, data._timeLog);
        });
    }

    /* 
        Add a timelog to the task

        @param userID   The id of the user that worked on this task
        @param date     The date that this task has been worked on in (DD/MM)
        @param time     The amount of time spent on the task on this date
    */
    addTimelog = (userID, date, time) => this._timeLog.push({ date: date, time: time, userID: userID })

    /*
        Get total time worked on the task
        
    */
    getTotalTime() {
        let total = 0;
        this._timeLog.forEach(log => total += log.time);
        return total;
    }

    /*
        Get total time worked on task on a particular date
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