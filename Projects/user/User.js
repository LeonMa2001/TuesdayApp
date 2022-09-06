class User {
    constructor(){
        this._name = '';
        this._email = '';
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