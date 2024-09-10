import React, { useState } from 'react';
import axios from 'axios';

const CreativityForm = () => {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [agency, setAgency] = useState('');
    const [deviceType, setDeviceType] = useState('desktop');  // Nuevo estado para deviceType

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            const res = await axios.post('/api/creativity', { name, size, height, width, agency, deviceType }, config);
            alert('Creativity uploaded successfully!');
        } catch (error) {
            console.error('Error uploading creativity:', error);
            alert('Failed to upload creativity.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Agency"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                required
            />
            {/* Campo para seleccionar si es mobile o desktop */}
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
            </select>
            <button type="submit">Upload Creativity</button>
        </form>
    );
};

export default CreativityForm;
