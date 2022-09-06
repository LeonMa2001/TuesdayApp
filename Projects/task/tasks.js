class Task {
    constructor(taskName="", taskType="", points=null, status=null, description="", tag=null, assignees=[], priority="" ){
        this._taskName = taskName;
        this._taskType = taskType;
        this._points = points;
        this._status = status;
        this._desc = description;
        this._tag = tag;
        this._assignees = assignees;
        this._priority = priority;
    }

    addAssignee(newAssignee){
        this._assignees.add(newAssignee);
    }

    setTaskName(newTaskName){
        this._taskName = newTaskName;
    }

    setTaskType(newTaskType){
        this._taskType = newTaskType;
    }

    setPoints(newPoints){
        this._points = newPoints;
    }

    setStatus(newStatus){
        this._status = newStatus;
    }

    setDesc(newDesc){
        this._desc = newDesc;    
    }

    setTag(newTag){
        this._tag = newTag;
    }

    setPriority(newPriority){
        this._priority = newPriority;
    }

    getTaskName(){
        return this._taskName;
    }
    
    getTaskType(){
        return this._taskType;
    }

    getPoints(){
        return this._points;
    }

    getStatus(){
        return this._status;
    }

    getDesc(){
        return this._desc;
    }

    getTag(){
        return this._tag;
    }

    getTimeLog(){
        return this._timeLog;
    }

    getPriority(){
        return this._priority;
    }

    fromData(data){
        users = data._assignees.map((user) => {
            return new User(user._name, user._email, user._timeLog)
        }) 
        return new Task(taskName=data._taskName, taskType=data._taskType, points=data._points, status=data._status, description=data._description, tag=data._tag, assignees=users)

    }
}