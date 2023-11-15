import './App.css';
import Tooltip from './Tooltip';
import Login from './Login/Login';
import SignUp from './SignUp';
import {
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";
import Home from './Home';
import { useAppSelector } from './redux/hooks';
import { useAuth } from './Login/hooks/useAuth';
import LogoutButton from './Login/LogoutButton';
import { EmployeeUpdateProvider } from './common/hooks/useEmployeeUpdate';
import AddTaskForm from './AddTaskForm';
import AddEmployee from './AddEmployee';
import { TaskUpdateProvider } from './common/hooks/useTaskUpdate';

function App() {
    const auth = useAuth();

    const message = useAppSelector(state => state.common.message);

    const location = useLocation();
    // const user = auth.currentUser;

    return (
        <>

            <div>
                {auth.user && <LogoutButton />}
                <nav className="main-nav">
                    <ul>
                        {location.pathname !== '/' &&
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        }
                        {auth.user && <li>
                            <Link to="/add-task">Add Task</Link>
                        </li>
                        }
                        {auth.user && <li>
                            <Link to="/add-employee">Add Employee</Link>
                        </li>
                        }
                        {!auth.user && <li>
                            <Link to="/signup">SignUp</Link>
                        </li>
                        }
                    </ul>
                </nav>
                {message && <Tooltip message={message.text} type={message.type} />}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <TaskUpdateProvider>
                                <EmployeeUpdateProvider>
                                    <Home />
                                </EmployeeUpdateProvider>
                            </TaskUpdateProvider>
                        }
                    />
                    <Route
                        path="/add-task"
                        element={
                            <TaskUpdateProvider>
                                <EmployeeUpdateProvider>
                                    <AddTaskForm />
                                </EmployeeUpdateProvider>
                            </TaskUpdateProvider>
                        }
                    />
                    <Route
                        path="/add-employee"
                        element={
                            <EmployeeUpdateProvider>
                                <AddEmployee />
                            </EmployeeUpdateProvider>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>

        </>
    )
}

export default App;
