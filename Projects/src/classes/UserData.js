/**
 * Class to store all user information
 */
class UserData {
    /**
     * Construct the User
     * @param {Number} id The id of the user
     * @param {String} name The name of the user
     * @param {String} email The email of the user
     * @param {Array<Map>} timelog The list of timelogs the user has
     */
    constructor(id, name, email, timelog) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._timeLog = timelog ?? []; // stored as [{task: ..., date: ..., time: ...}, ...]
    }

    get name() { return this._name; }
    get email() { return this._email; }
    get id() { return this._id; }

    /**
     * Converts raw data into instances of this class
     * @param {*} dataList The raw data to convert
     * @returns {Array<UserData>} The list of instances of this class
     */
    static fromData(dataList) {
        return dataList.map(data => {
            return new UserData(data._id, data._name, data._email, data._timeLog);
        });
    }

    /**
     * Create a row instance dictionary of this class to display
     * @returns The row information of this instance
     */
    createData() { return { id: this._id, name: this._name, email: this._email, hours: this.getTotalTime() }; }

    /**
     * Get the total time worked on a specific date 
     * @param {dayjs} date The date to find the total time for
     * @returns The total time worked on this date
     */
    getTotalTimeDate(date) {
        let total = 0;
        for (let i = 0; i < this._timeLog.length; i++) {
            const log = this._timeLog[i];
            if (log.date === date) total += log.time;
        }
        return total;
    }

    /**
     * Get the total time worked by the user
     * @returns The total time worked by the user
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

    /**
     * Add a timlog to the user
     * @param {Number} taskID The task id that this user has worked on
     * @param {String} date The date this task has been worked on (DD/MM)
     * @param {Number} time The amount of time spent on the task on this dates
     * @returns The new length of the timelog
     */
    addTimelog = (taskID, date, time) => this._timeLog.push({ date: date, time: time, taskID: taskID });

}

export default UserData;