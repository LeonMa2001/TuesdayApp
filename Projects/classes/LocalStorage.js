class LocalStorage {
    exists(key) {
        return localStorage.getItem(key) != null;
    }
    set(key, data) {
        data = JSON.stringify(data);
        localStorage.setItem(key, data);
    }
    get(key) {
        let data = localStorage.getItem(key);
        try { data = JSON.parse(data); }
        catch (e) { console.log(e); }
        finally { return data; }
    }
}