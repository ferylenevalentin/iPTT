import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';
import './AddUser.css';
import { Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

function AddUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:1337/fetchusers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="Buttons">
                <Typography variant="h2">VIEW USERS</Typography>
                <hr />
                {loading && <Typography>Loading users...</Typography>}

                <div className="view">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <Card key={index}>
                                <CardContent>
                                    <h3>User ID: {user.userId}</h3>
                                    <p>Last Name: {user.lastName}</p>
                                    <p>First Name: {user.firstName}</p>
                                    <p>Middle Name: {user.middleName}</p>
                                    <p>Email: {user.email}</p> {/* Changed from username to email */}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No users available</Typography>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddUser;