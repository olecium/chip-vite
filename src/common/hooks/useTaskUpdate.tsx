import React, { useState, useEffect, useContext, createContext } from "react";
// import { useAuth } from "../../Login/hooks/useAuth";
import { ITask, ITaskMap } from "../interfaces";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../Login/hooks/useAuth";
import { useNavigate } from "react-router";
import { FS_TASKS_PATH } from "../constants/FireStorePaths";

interface ITaskUpdateContext {
    tasks: ITask[];//Map;
    errorTask: Error | undefined;
}

interface Props {
    children?: React.ReactNode;
}

const TaskUpdateContextValue = createContext<ITaskUpdateContext>({} as ITaskUpdateContext);
export const TaskUpdateValueProvider = TaskUpdateContextValue.Provider;
export const TaskUpdateValueConsumer = TaskUpdateContextValue.Consumer;

export const TaskUpdateProvider: React.FC<Props> = (props: Props) => {
    const Context = useTaskUpdateProvider();
    return <TaskUpdateValueProvider value={Context}>{props.children}</TaskUpdateValueProvider>
}

export const useTaskUpdate = () => {
    const Context = useContext(TaskUpdateContextValue);
    if (Context === undefined) {
        throw new Error(`useTaskUpdate must be used within a TaskUpdateProvider`);
    }
    return Context;
}

type IUnsubscribe = () => void;

function useTaskUpdateProvider(): ITaskUpdateContext {
    const [tasks, setTasks] = useState<ITask[]>([]);//<ITaskMap>({});
    const [errorTask, setError] = useState<Error | undefined>(undefined);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user]);

    useEffect(() => {
        let unsubscribe: IUnsubscribe | undefined = undefined;
        let isMounted: boolean = true;

        const getData = async (): Promise<void> => {
            try {
                if (user === undefined || user === null || unsubscribe !== undefined) return;

                const q = query(collection(db, FS_TASKS_PATH));
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        const d = change.doc.data();
                        const t = change.type;

                        switch (t) {
                            case "added": {
                                const task: ITask = {
                                    id: d.id,
                                    date: d.date,
                                    taskName: d.taskName,
                                    taskDescription: d.taskDescription,
                                    assignedFor: d.assignedFor
                                };
                                if (isMounted) {
                                    setTasks(prevState => {
                                        const newTask = [...prevState];
                                        newTask.push(task);
                                        return newTask;
                                    });
                                }
                                break;
                            }
                            case "modified": {
                                const task: ITask = {
                                    id: d.id,
                                    date: d.date,
                                    taskName: d.taskName,
                                    taskDescription: d.taskDescription,
                                    assignedFor: d.assignedFor
                                };
                                if (isMounted) {
                                    setTasks(prevState => {
                                        const tasksCopy = JSON.parse(JSON.stringify(prevState)) as ITask[];
                                        const newState = tasksCopy.map(obj => task.id === obj.id ? task : obj);
                                        return newState;
                                    });
                                }
                                break;
                            }
                            case "removed": {
                                console.log(`Task was removed`);
                                break;
                            }
                        }
                    })

                });

            }
            catch (err: unknown) {
                if (isMounted) {
                    setError(err as Error);
                }
            }
        }

        getData();
        return function cleanup() {
            isMounted = false;
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [user]);

    const result: ITaskUpdateContext = {
        tasks,
        errorTask
    };

    return result;
}
