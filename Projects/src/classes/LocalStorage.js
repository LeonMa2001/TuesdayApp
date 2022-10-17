/**
 * Local Storage class to maintain consistency when storing data
 */
class LocalStorage {
    // Key strings
    static USERS = 'users';
    static TASKS = 'tasks';
    static USER_ID = 'user_id';
    static TASK_ID = 'task_id';
    static SPRINTS = "sprints";

    /**
     * Checks if data exists at a particular key
     * @param {String} key The key to check for
     * @returns True if there is data and false if there isnt
     */
    static exists(key) {
        return localStorage.getItem(key) != null;
    }

    /**
     * Set data at a specific key   
     * @param {String} key The data to set
     * @param {*} data 
     */
    static set(key, data) {
        data = JSON.stringify(data);
        localStorage.setItem(key, data);
    }

    /**
     * Get the data at a particular key
     * @param {String} key The key to get data for
     * @returns {*} The data from the key
     */
    static get(key) {
        let data = localStorage.getItem(key);
        try { data = JSON.parse(data); }
        catch (e) { console.log(e); }
        finally { return data; }
    }
}

export default LocalStorage;