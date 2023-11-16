// Hook for child components to get the auth object ...
// ... and re-render when it changes.
import { User, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
// import { IUserInfoType } from "../../common/interfaces/IUserInfo";
import { auth } from "../../firebase";
import { isUndefinedOrNull } from "../../common/utils/typeGuard";
import { useAppDispatch } from "../../redux/hooks";
import { addMessage } from "../../redux/commonSlice";
import { MessageType } from "../../common/interfaces";

export type IUserType = null | undefined | User;
export type ISignInType = (email: string, password: string) => Promise<IUserType>;
export type ISignOutType = () => Promise<void>;

export interface IAuthContext {
    user: IUserType;
    signin: ISignInType;
    signout: ISignOutType;
}

type DefaultValue = undefined;
export type AuthContextValue = IAuthContext | DefaultValue;

const AuthContext = createContext<AuthContextValue>(undefined);

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
type ContainerProps = {
    children: React.ReactNode;
};

export const AuthProvider: React.FC<ContainerProps> = (props: ContainerProps) => {
    const authContext = useAuthProvider();
    return <AuthContextProvider value={authContext}>{props.children}</AuthContextProvider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context;
};

// Provider hook that creates auth object and handles state
function useAuthProvider(): IAuthContext {
    const [user, setUser] = useState<IUserType>(null);
    const dispatch = useAppDispatch();

    const signin = async (email: string, password: string): Promise<IUserType> => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);

            if (response.user !== null) {
                setUser(response.user);
                return response.user as IUserType;
            } else {
                return null;
            }
        } catch (error) {
            dispatch(addMessage({ type: MessageType.error, text: error as string }));
            throw error;
        }
    };

    const signout = async (): Promise<void> => {
        await auth.signOut();
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (isUndefinedOrNull(user)) {
                setUser(null);
            }
        });

        return function cleanup() {
            unsubscribe();
        };

    }, []);

    // Return the user object and auth methods
    return {
        user,
        signin,
        signout,
    } as const;
}
