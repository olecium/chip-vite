export enum MessageType {
    success = "success",
    warning = "warning",
    error = "error"
}

export interface IMessage {
    type: MessageType;
    text: string;
}

export interface IEmployee {
    id: string;
    name: string;
    surname: string;
    photo: string;
    active: boolean;
}
export interface IEmployeeMap {
    [id: string]: IEmployee;
}
export interface ITaskMap {
    [id: string]: ITask;
}
export interface ITask {
    id: string;
    date: number;
    taskName: string;
    taskDescription: string;
    assignedFor: IEmployee[];
}