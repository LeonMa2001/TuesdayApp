class UserData {
    constructor(id = '', name = '', email = '', timelog = []){
        this._id = id;
        this._name = name;
        this._email = email;
        this._timeLog = timelog;
    }

    get name(){ return this._name; }
    get email(){ return this._email; }
    get id() {return this._id; }

    static fromData(dataList){
        return dataList.map(data => {
            return new UserData(data._id, data._name, data._email, [])
        })
    }

    createData() { return {id: this._id, name: this._name, email: this._email, hours: this.getTotalTime()}; }
    
    // get the total time worked on tasks on a specific date
    getTotalTimeDate(date) {
        let total = 0;
        for (let i = 0; i < this._timeLog.length; i++) {
            const log = this._timeLog[i];
            if (log.date === date) {
                total += log.time;
            }
        }
        //return 2 // uncomment for dummy values
        return total;
    }

    // get the total time worked by this user
    getTotalTime() {
        let total = 0;
        this._timeLog.forEach(log => total += log.time);
        //return 10 // uncomment for dummy values
        return total;
    }
}

export default UserData;