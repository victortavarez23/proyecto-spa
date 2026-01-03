import React, { useState } from 'react';
import axios from 'axios';
import './WeatherSection.css'; 

const WeatherSection = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const API_KEY = process.env.REACT_APP_API_KEY;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;
        setError('');
        setWeather(null);

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            );
            setWeather(response.data);
        } catch (err) {
            // Agregamos esto para ver el error REAL en la consola
            console.error("Error de API:", err.response ? err.response.data : err);
            
            setError('Ciudad no encontrada');
        }
    };

    return (
        <div className="weather-section-container">
            <div className="weather-content">
                <h2>☁️ Monitor de Clima (API Externa)</h2>
                
                <div className="weather-controls">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Ej: Madrid..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <button type="submit">Ver Clima</button>
                    </form>

                    {/* Mostramos el resultado AQUI MISMO, al lado o abajo */}
                    {weather && (
                        <div className="weather-badge">
                            <img 
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
                                alt="icon" 
                            />
                            <span>{weather.name}: <strong>{weather.main.temp}°C</strong></span>
                        </div>
                    )}
                    
                    {error && <span className="weather-error">{error}</span>}
                </div>
            </div>
        </div>
    );
};

export default WeatherSection;