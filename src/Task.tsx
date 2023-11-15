import React from "react";
import Employee from "./Emloyee";
import { ITask } from "./common/interfaces";
import { Droppable } from "react-beautiful-dnd";

interface ITaskProps {
    task: ITask;
    index: number;
}

const Task: React.FC<ITaskProps> = (props: ITaskProps) => {
    return (
        <Droppable direction="horizontal" droppableId={props.task.id}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="task__item"
                >
                    <h3>{props.task.taskName}</h3>
                    <p>{props.task.taskDescription}</p>
                    <ul className="employee__list">{props.task.assignedFor.map((e, i) => <Employee employee={e} key={e.id} index={i} />)}
                        {provided.placeholder}
                    </ul>
                </div>
            )}
        </Droppable>
    );
};

export default Task;