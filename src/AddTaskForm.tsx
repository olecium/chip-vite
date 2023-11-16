import React, { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router';
import { useEmployeeUpdate } from './common/hooks/useEmployeeUpdate';
import { IEmployee, ITask } from './common/interfaces';

interface IEmployeeProps extends IEmployee {
    assigned: boolean;
}

const AddTaskForm: React.FC = (): JSX.Element => {
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [assignedFor, setAssignedFor] = useState<IEmployeeProps[]>([]);
    const navigate = useNavigate();
    const { employees } = useEmployeeUpdate();

    React.useEffect(() => {
        if (employees && Object.keys(employees).length > 0) {

            const result: IEmployeeProps[] = [];

            for (const k in employees) {
                const e = employees[k];
                const ep: IEmployeeProps = {
                    ...e,
                    assigned: false
                };
                result.push(ep);
                setAssignedFor(result);
            }
        }
    }, [employees]);

    const onTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTaskName(e.target.value);
    };

    const onTaskDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setTaskDescription(e.target.value);
    };

    const onAssignedForChange = async (_: React.ChangeEvent<HTMLInputElement>, employee: IEmployeeProps): Promise<void> => {
        const prevAssigned = [...assignedFor].map(el => (el.id === employee.id ? { ...el, assigned: true } : el));
        setAssignedFor(prevAssigned);
    }

    const onTaskAdd = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        const currentDate = new Date().getTime();


        try {
            const document = await addDoc(collection(db, "tasks"), {});

            const taskData = {
                id: document.id,
                date: currentDate,
                taskName: taskName,
                taskDescription: taskDescription,
                assignedFor: assignedFor.filter(x => x.assigned === true)
            } as ITask;
            console.log('taskData', taskData)

            const documentRef = doc(db, "tasks", document.id);
            await updateDoc(documentRef, { ...taskData });

            console.log("Document written with ID: ", document.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        navigate('/');
    };

    return (
        <>
            <h1>Add Task</h1>
            <div className="fieldset">
                <label htmlFor="taskName">Task name</label>
                <input type="text" name="taskName" onChange={onTaskNameChange} value={taskName} />
            </div>
            <div className="fieldset">
                <label htmlFor="taskDescription">Task Description</label>
                <textarea name="taskDescription" id="taskDescription" cols={30} rows={10} onChange={onTaskDescriptionChange}></textarea>
            </div>
            <div className="fieldset">
                <label>Assign for:</label>
                {assignedFor.map((employee, i) =>
                    <div className="fieldset_checkboxes" key={i}>
                        <input type="checkbox" name={"assignedFor"} id={employee.id} value={employee.id} onChange={(event) => onAssignedForChange(event, employee)} />
                        <label htmlFor={employee.id}>{employee.name} {employee.surname}</label>
                    </div>)}
            </div>
            <button onClick={onTaskAdd} className="btn">Add Task</button>
        </>
    );
};

export default AddTaskForm;
