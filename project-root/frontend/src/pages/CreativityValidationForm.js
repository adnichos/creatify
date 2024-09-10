import React, { useState } from 'react';
import axios from 'axios';

const CreativityValidationForm = () => {
    const [media, setMedia] = useState('');  // Medio de comunicación (ej. La Vanguardia)
    const [position, setPosition] = useState('');  // Posición (ej. Roba)
    const [deviceType, setDeviceType] = useState('desktop');  // Desktop o Mobile
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState({ width: 0, height: 0, size: 0 });

    // Manejar la carga de la imagen y obtener las dimensiones
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setImageData({
                    width: img.width,
                    height: img.height,
                    size: Math.round(file.size / 1024),  // Convertir a kilobytes (KB)
                });
            };
        }
    };

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
                deviceType,  // Enviar si es desktop o mobile
                width: imageData.width,  // En píxeles
                height: imageData.height,  // En píxeles
                size: imageData.size  // En kilobytes (KB)
            };

            const res = await axios.post('/api/creativity/validate', data, config);
            alert(res.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert('Error: ' + error.response.data.message);  // Mostrar mensaje detallado del backend
            } else {
                alert('Failed to validate creativity.');
            }
            console.error('Error validating creativity:', error);
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
                placeholder="Position (e.g. Billboard)"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
            />
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
            </select>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
            />
            <p>Width: {imageData.width}px, Height: {imageData.height}px, Size: {imageData.size} KB</p>
            <button type="submit">Validate Creativity</button>
        </form>
    );
};

export default CreativityValidationForm;
