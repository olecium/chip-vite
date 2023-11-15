import { useAuth } from './Login/hooks/useAuth';
import EmployeesList from './EmployeesList';
import Login from './Login/Login';
import TasksList from './TasksList';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useEmployeeUpdate } from './common/hooks/useEmployeeUpdate';
import React from 'react';
import { IEmployee, ITask } from './common/interfaces';
import { useTaskUpdate } from './common/hooks/useTaskUpdate';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const DaySchedule: React.FC = (): JSX.Element => {
    const { user } = useAuth();

    const { employees } = useEmployeeUpdate();
    const { tasks } = useTaskUpdate();

    const [employeeProps, setEmployeeProps] = React.useState<IEmployee[]>([]);
    const [tasksProps, setTasksProps] = React.useState<ITask[]>([]);

    React.useEffect(() => {
        const assignedEmployees = tasks.map(x => x.assignedFor).flat().map(x => x.id).flat();
        const notAssignedEmployees: IEmployee[] = [];
        employees.forEach(e => {
            if (assignedEmployees.includes(e.id) === false) {
                notAssignedEmployees.push(e);
            }
        });

        setEmployeeProps(notAssignedEmployees);
    }, [employees, tasks]);

    React.useEffect(() => {
        if (tasks) {
            console.log('tasks', tasks)
            setTasksProps(tasks);
        }
    }, [tasks]);

    const updateTask = async (docId: string, task: ITask) => {
        const documentRef = doc(db, "tasks", docId);
        await updateDoc(documentRef, { ...task });
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        // console.log('destination', destination);
        // console.log('source', source);
        // console.log('draggableId', draggableId);

        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newTasks = JSON.parse(JSON.stringify(tasksProps)) as ITask[];
        const sourceTask = source.droppableId !== 'employees' ? newTasks.filter(t => t.id === source.droppableId)[0] : undefined;
        const destinationTask = newTasks.filter(t => t.id === destination.droppableId)[0];
        // const draggedEmployeeObj = sourceTask ? sourceTask.assignedFor.filter(x => x.id === draggableId)[0] : employees.filter(x => x.id === draggableId)[0];
        const draggedEmployeeObj = employees.filter(x => x.id === draggableId)[0];

        if (sourceTask) {
            const indexOfDraggedEmployee = sourceTask.assignedFor.findIndex(x => x.id === draggableId);
            // remove dragged item from assignedFor from the task where it used to be        
            sourceTask.assignedFor.splice(indexOfDraggedEmployee, 1);
            // update newTasks with updated sourceTask 
            // newTasks.map(obj => sourceTask.id === obj.id ? sourceTask : obj);
            // save task to DB
            updateTask(sourceTask.id, sourceTask);
        } else {
            const newEmployees = employeeProps.filter(x => x.id !== draggableId);
            setEmployeeProps(newEmployees);
        }

        if (destination.droppableId === 'employees') {
            const newEmployees = [...employeeProps];
            newEmployees.push(draggedEmployeeObj);
            setEmployeeProps(newEmployees);
        } else {
            // add draggedEmployee to destination task
            destinationTask.assignedFor.push(draggedEmployeeObj);
            // update newTasks with destinationTask 
            // newTasks.map(obj => destinationTask.id === obj.id ? destinationTask : obj);
            // save task to DB
            updateTask(destinationTask.id, destinationTask);
        }
        // update tasks
        // setTasksProps(newTasks);
    }

    return (
        <>
            {!user && <Login />}
            {user &&
                <>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <section className="day_schedule">
                            <EmployeesList employees={employeeProps} />
                            <TasksList tasks={tasksProps} />
                        </section>
                    </DragDropContext>
                </>
            }
        </>
    )
}

export default DaySchedule;
