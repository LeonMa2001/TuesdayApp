class user {

    timeLog = []; //array to store time log, not finalised yet on what datatype to be used

    constructor(name, email){
        this.name = name;
        this.email = email;
    }

    setName(newName){
        this.name = newName;
    }

    setEmail(newEmail){
        this.email = newEmail;
    }

    getName(){
        return this.name;
    }

    getEmail(){
        return this.email;
    }
}