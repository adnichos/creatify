import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CreativityValidationForm from './CreativityValidationForm';
import CriteriaForm from './CriteriaForm';  // Importa el formulario de criterios

const CreativitiesPage = () => {
    const [creativities, setCreativities] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Obtener el token JWT del localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Decodificar el token para obtener el rol
            const decoded = jwtDecode(token);  // Cambia a jwtDecode
            setIsAdmin(decoded.role === 'Admin'); // Verificar si el usuario es admin
        }

        // Obtener la lista de creatividades
        const fetchCreativities = async () => {
            const res = await axios.get('/api/creativities');
            setCreativities(res.data);
        };
        fetchCreativities();
    }, []);

    return (
        <div>
            <h2>Creativities</h2>
            <ul>
                {creativities.map(creativity => (
                    <li key={creativity._id}>
                        {creativity.name} - {creativity.size} bytes
                    </li>
                ))}
            </ul>

            {/* Mostrar formulario de criterios solo si el usuario es admin */}
            {isAdmin && (
                <div>
                    <h3>Add Criteria</h3>
                    <CriteriaForm />
                </div>
            )}

            {/* Mostrar formulario de validación de creatividades */}
            <div>
                <h3>Validate Creativity</h3>
                <CreativityValidationForm />
            </div>
        </div>
    );
};

export default CreativitiesPage;
