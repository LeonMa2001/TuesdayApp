class User {
    constructor(name = '', email = '', timelog = []){
        this._name = name;
        this._email = email;
        this._timeLog = timelog;
    }

    getName(){ return this.name; }

    getEmail(){ return this.email; }

    fromData(data){
        this._name = data._name;
        this._email = data._email;
        this._timeLog = [];
    }
}