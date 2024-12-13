import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { API_BASE_URL } from './config';


const UserDropdown = ({ onUserSelect }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('JWT token not found');
                }

                const response = await fetch(`$API_BASE_URL/api/auth/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const userData = await response.json();

                const userOptions = userData.map(user => ({
                    value: user.UserID,
                    label: user.name
                }));

                setOptions(userOptions);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <Select
            options={options}
            isLoading={loading}
            onChange={onUserSelect}
            placeholder="Select a user..."
            isSearchable
        />
    );
};

export default UserDropdown;
