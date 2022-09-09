class UserData {
    constructor(id = '', name = '', email = '', timelog = []){
        this._id = id;
        this._name = name;
        this._email = email;
        this._timeLog = timelog;
    }

    get name(){ return this._name; }
    get email(){ return this._email; }
    get id() {return this._id; }

    static fromData(dataList){
        return dataList.map(data => {
            return new UserData(data._id, data._name, data._email, [])
        })
    }

    createData() { return {id: this._id, name: this._name, email: this._email}; }
}

export default UserData;