import './App.css';
import { useAuth } from './Login/hooks/useAuth';
import Login from './Login/Login';
import DaySchedule from './DaySchedule';
// import AllTasks from './AllTasks';

const Home: React.FC = (): JSX.Element => {
    const { user } = useAuth();
    return (
        <>
            {!user && <Login />}
            {user &&
                <>
                    {/* <AllTasks /> */}
                    <DaySchedule />
                </>
            }
        </>
    )
}

export default Home;
