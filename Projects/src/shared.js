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