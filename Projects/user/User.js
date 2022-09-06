class User {
    constructor(name = '', email = ''){
        this._name = name;
        this._email = email;
        this._timeLog = [];
    }

    getName(){ return this.name; }

    getEmail(){ return this.email; }

    fromData(data){
        this._name = data._name;
        this._email = data._email;
        this._timeLog = [];
    }
}