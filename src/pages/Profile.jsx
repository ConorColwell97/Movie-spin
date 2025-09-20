import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const VITE_URL = import.meta.env.VITE_API_URL;
    const [newName, setNewName] = useState("");
    const [newPW, setNewPW] = useState("");
    const [openName, setOpenName] = useState(false);
    const [openPW, setOpenPW] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const updateName = async () => {
        setError(null);

        try {
            await axios.patch(`${VITE_URL}/updatename/${encodeURIComponent(localStorage.getItem('user'))}`,
                { newName }, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            });

            localStorage.setItem('user', newName);
            setNewName("");
            setOpenName(false);
        } catch (err) {

            if (err.status === 401) {
                alert("You are not authorized to make this request");
                localStorage.clear();
                navigate("/");
            } else {
                setError("An error occurred");
            }
        }
    }

    const updatePassword = async () => {
        setError(null);

        try {
            await axios.patch(`${VITE_URL}/updatepw/${encodeURIComponent(localStorage.getItem('user'))}`,
                { newPW }, {
                headers: {
                    "Content-Type": "application/json"
                }, withCredentials: true
            });

            setNewPW("");
            setOpenPW(false);
        } catch (err) {

            if (err.status === 401) {
                alert("You are not authorized to make this request");
                localStorage.clear();
                navigate("/");
            } else {
                setError("An error occurred");
            }
        }
    }

    const deleteAccount = async () => {
        setError(null);

        try {
            await axios.delete(`${VITE_URL}/delete/${encodeURIComponent(localStorage.getItem('user'))}/${encodeURIComponent(password)}`,
                { withCredentials: true }
            );
            localStorage.clear();
            navigate("/");
        } catch (err) {

            if (err.status === 401) {
                alert("You are not authorized to make this request");
                localStorage.clear();
                navigate("/");
            } else {
                setError("An error occurred");
            }
        }
    }

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2em" }}>
            {openName ? (
                <div style={{ display: "flex" }}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter new username"
                    />
                    <button onClick={updateName} disabled={newName.length === 0}>Submit</button>
                </div>

            ) : (
                <button onClick={() => setOpenName(true)}>Change Username</button>
            )}

            {openPW ? (
                <div style={{ display: "flex" }}>
                    <input
                        type="password"
                        value={newPW}
                        onChange={(e) => setNewPW(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <button onClick={updatePassword} disabled={newPW.length < 8}>Submit</button>
                </div>

            ) : (
                <button onClick={() => setOpenPW(true)}>Change Password</button>
            )}

            {openDel ? (
                <div style={{ display: "flex" }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    <button onClick={() => {
                        const confirmed = window.confirm(`Delete account? This action cannot be undone. You will be returned to the log in page upon deletion of your account`);
                        if (confirmed) {
                            deleteAccount();
                        }
                    }} disabled={password.length < 8}>Delete</button>
                </div>
            ) : (
                <button onClick={() => setOpenDel(true)}>Delete account</button>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </div>
    );
}

export default Profile;