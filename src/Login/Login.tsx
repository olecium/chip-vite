import { useState } from 'react';
import { getAuth, User, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../redux/hooks';
import { addMessage } from '../redux/commonSlice';
import { MessageType } from '../common/interfaces';
import { useAuth } from './hooks/useAuth';

interface ILoginProps {
    // handleLogin: (user: User) => void;
}

const Login: React.FC<ILoginProps> = (props: ILoginProps): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = useAuth();

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const password = e.target.value;

        if (password.length > 0) {
            setPassword(password);
        }
    };

    const onLogin = async (): Promise<void> => {
        try {
            const result = await auth.signin(email, password);
            if (result !== null) {
                navigate("/");
            }
        }
        catch (err) {
            console.log(err);
            dispatch(addMessage({ type: MessageType.error, text: err as string }));
        }
    }

    return (
        <>
            <input type="text" name="username" onChange={onEmailChange} value={email} />
            <input type="password" name="password" onChange={onPasswordChange} value={password} />
            <button onClick={onLogin}>Log in</button>
        </>
    );
};

export default Login;
