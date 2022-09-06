class User {
    constructor(id = '', name = '', email = '', timelog = []){
        this._id = id;
        this._name = name;
        this._email = email;
        this._timeLog = timelog;
    }

    get name(){ return this._name; }
    get email(){ return this._email; }
    get id() {return this._id; }

    fromData(data){
        this._id = data._id;
        this._name = data._name;
        this._email = data._email;
        this._timeLog = [];
    }

    createData() { return {id: this._id, name: this._name, email: this._email}; }
}

export default User;