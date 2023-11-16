import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router';

const SignUp: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const auth = getAuth();

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const password = e.target.value;

        if (password.length > 0) {
            setPassword(password);
        }
    };

    const onSignUp = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                if (user !== null) {
                    navigate("/");
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorCode);
                console.error(errorMessage);
            });


    };



    return (
        <>
            <h1>Sign Up</h1>
            <div className="fieldset">
                <label htmlFor="username">E-mail</label>
                <input type="text" name="username" onChange={onEmailChange} value={email} />
            </div>
            <div className="fieldset">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={onPasswordChange} value={password} />
            </div>
            <button onClick={onSignUp} className="btn">Sign Up</button>
        </>
    );
};

export default SignUp;
