import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreativitiesPage from './pages/CreativitiesPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta para el inicio de sesión */}
                <Route path="/login" element={<LoginPage />} />
                {/* Ruta para creatividades */}
                <Route path="/creativities" element={<CreativitiesPage />} />
                {/* Ruta para la raíz ("/") */}
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
