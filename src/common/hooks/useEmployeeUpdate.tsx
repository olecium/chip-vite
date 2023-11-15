import React, { useState, useEffect, useContext, createContext } from "react";
import { IEmployee } from "../interfaces";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../Login/hooks/useAuth";
import { useNavigate } from "react-router";
import { FS_EMPLOYEES_PATH } from "../constants/FireStorePaths";

interface IEmployeeUpdateContext {
    employees: IEmployee[];//Map;
    errorEmployee: Error | undefined;
}

interface Props {
    children?: React.ReactNode;
}

const EmployeeUpdateContextValue = createContext<IEmployeeUpdateContext>({} as IEmployeeUpdateContext);
export const EmployeeUpdateValueProvider = EmployeeUpdateContextValue.Provider;
export const EmployeeUpdateValueConsumer = EmployeeUpdateContextValue.Consumer;

export const EmployeeUpdateProvider: React.FC<Props> = (props: Props) => {
    const Context = useEmployeeUpdateProvider();
    return <EmployeeUpdateValueProvider value={Context}>{props.children}</EmployeeUpdateValueProvider>
}

export const useEmployeeUpdate = () => {
    const Context = useContext(EmployeeUpdateContextValue);
    if (Context === undefined) {
        throw new Error(`useEmployeeUpdate must be used within a EmployeeUpdateProvider`);
    }
    return Context;
}

type IUnsubscribe = () => void;

function useEmployeeUpdateProvider(): IEmployeeUpdateContext {
    const [employees, setEmployees] = useState<IEmployee[]>([]);//<IEmployeeMap>({});
    const [errorEmployee, setError] = useState<Error | undefined>(undefined);
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

                const q = query(collection(db, FS_EMPLOYEES_PATH), where("active", "==", true));
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        const d = change.doc.data();
                        const t = change.type;

                        switch (t) {
                            case "added":
                            case "modified": {
                                const employee: IEmployee = {
                                    id: d.id,
                                    name: d.name,
                                    surname: d.surname,
                                    photo: d.photo,
                                    active: d.active,
                                };
                                if (isMounted) {
                                    setEmployees(prevState => {

                                        const newEmp = [...prevState];
                                        newEmp.push(employee);
                                        return newEmp;
                                    });
                                    // setEmployees(prevState => ({ ...prevState, employee })) //[employee.id]: 
                                }
                                break;
                            }
                            case "removed": {
                                if (isMounted) {
                                    setEmployees(prevState => {
                                        const newEmp = [...prevState];
                                        const updatedList = newEmp.filter(x => x.id !== d.id);
                                        return updatedList;
                                    });
                                }
                                console.log(`Employee was removed`);
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

    const result: IEmployeeUpdateContext = {
        employees,
        errorEmployee
    };

    return result;
}
