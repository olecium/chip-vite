import React from "react";
import { IEmployee } from "./common/interfaces";
import { Draggable } from "react-beautiful-dnd";

interface IEmployeeProps {
    employee: IEmployee;
    index: number;
}

const Employee: React.FC<IEmployeeProps> = (props: IEmployeeProps) => {
    return (
        <Draggable draggableId={props.employee.id} key={props.employee.id} index={props.index} >
            {(provided) => (
                <li
                    className={"employee__item"}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <picture className="employee__item-image">
                        <img src={props.employee.photo} width="150" alt="" />
                    </picture>
                    <p className="employee__item-name">
                        <span>
                            {props.employee.name}
                        </span>
                        <span>
                            {props.employee.surname}
                        </span>
                    </p>
                </li>
            )}
        </Draggable>
    );
};

export default Employee;