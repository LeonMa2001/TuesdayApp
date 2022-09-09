import UserData from './UserData.js';

class TaskData {
    constructor(id="", taskName="", taskType="", priority="", points=null, status=null, description="", tag=null, assignees=[]){
        this._id = id;
        this._taskName = taskName;
        this._taskType = taskType;
        this._points = points;
        this._status = status;
        this._desc = description;
        this._tag = tag;
        this._assignees = assignees;
        this._priority = priority;
    }

    addAssignee(newAssignee){ this._assignees.add(newAssignee); }
    set taskName(newTaskName){this._taskName = newTaskName; }
    set taskType(newTaskType){ this._taskType = newTaskType; }
    set points(newPoints){ this._points = newPoints; }
    set status(newStatus){ this._status = newStatus; }
    set desc(newDesc){ this._desc = newDesc; }
    set tag(newTag){ this._tag = newTag;}
    set priority(newPriority){ this._priority = newPriority; }
    set assignees(assigneeList){ this._assignees = assigneeList}
    set id(id) {this._id = id}


    get taskName(){ return this._taskName; }
    get taskType(){ return this._taskType; }
    get points(){ return this._points; }
    get status(){ return this._status; }
    get desc(){ return this._desc; }
    get tag(){ return this._tag; }
    get timeLog(){ return this._timeLog; }
    get priority(){ return this._priority; }
    get assignees(){ return this._assigness; }
    get id(){ return this._id }

    static fromData(dataList){
        return dataList.map(data => {
            /*
            const users = data._assignees.map((user) => {
                return new UserData(user._name, user._email, user._timeLog);
            });*/
            return new TaskData(data._id, data._taskName, data._taskType, data._priority, data._points, data._status, data._description, data._tag, data._assignees);
        })
    }
}

export default TaskData;