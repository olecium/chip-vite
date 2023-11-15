import React, { useEffect, useState } from 'react';
import './App.css';
import { useTaskUpdate } from './common/hooks/useTaskUpdate';
import TasksList from './TasksList';
import { ITask } from './common/interfaces';
import Login from './Login/Login';
import { useAuth } from './Login/hooks/useAuth';

const AllTasks: React.FC = (): JSX.Element => {
    const { user } = useAuth();
    const { tasks } = useTaskUpdate();
    const [tasksProps, setTasksProps] = useState<ITask[]>([]);


    // const currentDate = new Date();
    // const currentFullYear = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth();
    // const currentDay = currentDate.getDate();

    useEffect(() => {
        setTasksProps(tasks);
    }, [tasks]);

    return (
        <>
            {!user && <Login />}
            {user &&
                <TasksList tasks={tasksProps} />
            }
        </>
    )
}

export default AllTasks;
