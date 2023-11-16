import React from "react";
import { useAuth } from "./hooks/useAuth";

const LogoutButton: React.FC = (): JSX.Element => {
    const { signout } = useAuth();

    return (
        <button onClick={() => signout()} className="btn">
            Log Out
        </button>
    );
};

export default LogoutButton;