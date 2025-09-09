import axios from "axios";
import { useState } from "react";

const Profile = () => {
    const VITE_URL = import.meta.env.VITE_API_URL;
    const [newName, setNewName] = useState("");
    const [newPW, setNewPW] = useState("");
    const [openName, setOpenName] = useState(false);
    const [openPW, setOpenPW] = useState(false);

    const updateName = async () => {
        let response;

        try {
            response = await axios.patch(`${VITE_URL}/updatename/${encodeURIComponent(localStorage.getItem('user'))}/${encodeURIComponent(newName)}`,{ 
                withCredentials: true
            });

            localStorage.setItem('user', newName);
            setNewName("");
            setOpenName(false);
        } catch (error) {
            console.log(error);
        }
    }

    const updatePassword = async () => {
        let response;

        try {
            response = await axios.patch(`${VITE_URL}/updatepw/${encodeURIComponent(localStorage.getItem('user'))}/${encodeURIComponent(newPW)}`, {
                withCredentials: true
            });

            setNewPW("");
            setOpenPW(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {openName ? (
                <div style={{ display: "flex", flexDirection: "row" }}>
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
                <div style={{ display: "flex", flexDirection: "row" }}>
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
        </div>
    );
}

export default Profile;