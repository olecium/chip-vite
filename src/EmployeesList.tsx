import React from "react";
import Employee from "./Emloyee";
import { IEmployee } from "./common/interfaces";
// import { Droppable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./common/StrictModeDroppable";

interface IEmployeesListProps {
    employees: IEmployee[];
}

const EmployeesList: React.FC<IEmployeesListProps> = (props: IEmployeesListProps): React.ReactElement => {
    return (
        <section className="employees">
            <h2>Employees</h2>
            <StrictModeDroppable direction="horizontal" droppableId={'employees'} key={'employeeList'}>
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        <ul
                            className={'employee__list'}
                        >
                            {
                                props.employees.map((e, index) => {
                                    return (
                                        <Employee employee={e} key={e.id} index={index} />
                                    )
                                })
                            }
                            {provided.placeholder}
                        </ul>
                    </div>
                )}
            </StrictModeDroppable>
        </section>
    );
};

export default EmployeesList;
