import React from "react";
import Task from "./Task";
import { ITask } from "./common/interfaces";

export interface ITasksListProps {
    tasks: ITask[];
}

const TasksList: React.FC<ITasksListProps> = (props: ITasksListProps): React.ReactElement => {
    return (
        <section className="tasks">
            <h2>Tasks</h2>
            <ul className={'tasks__list'} >
                {props.tasks.map((t, index) => <Task task={t} key={index} index={index} />)}
            </ul>
        </section>
    );
};

export default TasksList;
