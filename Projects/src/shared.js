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







/* checkDataLocalStorage function
 * @ des to check whether data existing in local storage
 * @ and to see if local storage exists
 * @ param 'key' - storage key
 * @ return boolean - whether data existing in local storage
 */
function checkDataLocalStorage(key) {
    let data = localStorage.getItem(key);
    if (typeof (Storage) !== "undefined") { //check if local storage is available first
        if (data !== null) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}


/* updateDataLocalStorage function
 * @ des to update the local storage with the data under a specified key
 * @ param 'key' - storage key
 * @ param 'data' - data to be stored
 */
function updateDataLocalStorage(key, data) {
    if (typeof (data) == 'object') {
        data = JSON.stringify(data);
    }
    localStorage.setItem(key, data);
}


/* getDataLocalStorage function
 * @ des to get data from local storage under a specified key
 * @ param 'key' - storage key
 * @ return 'data' - data to be retrieved
 */
function getDataLocalStorage(key) {
    let data = localStorage.getItem(key);
    //check if the data is an object
    try {
        data = JSON.parse(data);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        return data;
    }
}