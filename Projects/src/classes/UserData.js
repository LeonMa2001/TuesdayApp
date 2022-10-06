class UserData {
    constructor(id, name, email, timelog) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._timeLog = timelog ?? []; // stored as [{task: ..., date: ..., time: ...}, ...]
    }

    get name() { return this._name; }
    get email() { return this._email; }
    get id() { return this._id; }

    static fromData(dataList){
        return dataList.map(data => {
            return new UserData(data._id, data._name, data._email, [])
        })
    }

    createData() { return { id: this._id, name: this._name, email: this._email, hours: this.getTotalTime() }; }

    /* 
        Get the total time worked on tasks on a specific date

        @param date   The date to find the total tine for
    */
    getTotalTimeDate(date) {
        let total = 0;
        for (let i = 0; i < this._timeLog.length; i++) {
            const log = this._timeLog[i];
            if (log.date === date) total += log.time;
        }
        return total;
    }

    /* 
        Get the total time worked by this user
    */
    getTotalTime() {
        let total = 0;
        this._timeLog.forEach(log => total += log.time);
        return total;
    }

    /* 
        Add a timelog to the user

        @param taskID   The id of the task this user has worked on
        @param date     The date that this task has been worked on in (DD/MM)
        @param time     The amount of time spent on the task on this date
    */
    addTimelog = (taskID, date, time) => this._timeLog.push({ date: date, time: time, taskID: taskID });
    
}

export default UserData;