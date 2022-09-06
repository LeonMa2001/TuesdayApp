class SprintBoard {
    consturctor(sprintName = "", startDate, endDate, tasks = []) {
        this._sprintName = sprintName;
        this._startDate = startDate;
        this._endDate = endDate;
        this._tasks = tasks;
    }

    get sprintName() {return this._sprintName;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get tasks() {return this._tasks;}

    set sprintName(name) {
        this._sprintName = name;
    }
    set startDate(date) {
        this._startDate = date;
    }
    set endDate(date) {
        this._endDate = date;
    }

    length() {
        return this._tasks.length;
    }

    // add task method

    // delete task method

    // fromData
}






