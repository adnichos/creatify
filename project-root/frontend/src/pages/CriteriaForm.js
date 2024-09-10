import React, { useState } from 'react';
import axios from 'axios';

const CriteriaForm = () => {
    const [media, setMedia] = useState('');
    const [position, setPosition] = useState('');
    const [deviceType, setDeviceType] = useState('desktop');
    const [maxWeight, setMaxWeight] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No authentication token found. Please log in.');
                return;
            }

            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };

            const data = {
                media,
                position,
                deviceType,
                maxWeight: parseFloat(maxWeight), // Asegurarnos de que el peso sea un número
                width: parseInt(width),  // Convertir a número entero
                height: parseInt(height), // Convertir a número entero
            };

            const res = await axios.post('/api/criteria', data, config);
            alert('Criteria added successfully!');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert('Error: ' + error.response.data.message);  // Mostrar mensaje detallado del backend
            } else {
                alert('Failed to add criteria.');
            }
            console.error('Error adding criteria:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Media (e.g. La Vanguardia)"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Position (e.g. Roba)"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
            />
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
            </select>
            <input
                type="number"
                placeholder="Max Weight (KB)"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Width (in pixels)"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Height (in pixels)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
            />
            <button type="submit">Add Criteria</button>
        </form>
    );
};

export default CriteriaForm;
