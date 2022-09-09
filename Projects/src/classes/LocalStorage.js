class LocalStorage {
    static USERS = 'users';
    static TASKS = 'tasks';
    static USER_ID = 'user_id';
    static TASK_ID = 'task_id';
    
    static exists(key) {
        return localStorage.getItem(key) != null;
    }
    static set(key, data) {
        data = JSON.stringify(data);
        localStorage.setItem(key, data);
    }
    static get(key) {
        let data = localStorage.getItem(key);
        try { data = JSON.parse(data); }
        catch (e) { console.log(e); }
        finally { return data; }
    }
}

export default LocalStorage;