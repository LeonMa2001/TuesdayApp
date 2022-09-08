import User from './User.js.js';

class Task {
    constructor(id="", taskName="", taskType="", points=null, status=null, description="", tag=null, assignees=[]){
        this._id = id;
        this._taskName = taskName;
        this._taskType = taskType;
        this._points = points;
        this._status = status;
        this._desc = description;
        this._tag = tag;
        this._assignees = assignees;
    }

    addAssignee(newAssignee){ this._assignees.add(newAssignee); }
    set taskName(newTaskName){this._taskName = newTaskName; }
    set taskType(newTaskType){ this._taskType = newTaskType; }
    set points(newPoints){ this._points = newPoints; }
    set status(newStatus){ this._status = newStatus; }
    set desc(newDesc){ this._desc = newDesc; }
    set tag(newTag){ this._tag = newTag;}

    get taskName(){ return this._taskName; }
    get taskType(){ return this._taskType; }
    get points(){ return this._points; }
    get status(){ return this._status; }
    get desc(){ return this._desc; }
    get tag(){ return this._tag; }
    get timeLog(){ return this._timeLog; }

    fromData(data){
        const users = data._assignees.map((user) => {
            return new User(user._name, user._email, user._timeLog);
        });
        return new Task(taskName=data._taskName, taskType=data._taskType, points=data._points, status=data._status, description=data._description, tag=data._tag, assignees=users);
    }
}

export default Task;