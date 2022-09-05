class Task{
    taskName = " ";
    taskType = " ";
    points;
    status = "Not Started";
    desc = "add description here";
    tag;
    assignee = [];
    timeLog = 0;

    constructor(taskName, taskType, points, status, description, tag){
        this.taskName = taskName;
        this.taskType = taskType;
        this.points = points;
        this.status = status;
        this.desc = description;
        this.tag = tag;
    }

    addAssignee(newAssignee){
        this.assignee.add(newAssignee);
    }

    setTaskName(newTaskName){
        this.taskName = newTaskName;
    }

    setTaskType(newTaskType){
        this.taskType = newTaskType;
    }

    setPoints(newPoints){
        this.points = newPoints;
    }

    setStatus(newStatus){
        this.status = newStatus;
    }

    setDesc(newDesc){
        this.desc = newDesc;    
    }

    setTag(newTag){
        this.tag = newTag;
    }

    getTaskName(){
        return this.taskName;
    }
    
    getTaskType(){
        return this.taskType;
    }

    getPoints(){
        return this.points;
    }

    getStatus(){
        return this.status;
    }

    getDesc(){
        return this.desc;
    }

    getTag(){
        return this.tag;
    }

    getTimeLog(){
        return this.timeLog;
    }
}