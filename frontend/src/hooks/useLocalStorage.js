import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // 1. Inicialización "Perezosa" (Lazy Initialization):
  // Pasamos una función a useState para que solo lea el localStorage una vez (al inicio),
  // evitando leer el disco en cada renderizado.
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. Efecto de Sincronización:
  // Cada vez que 'key' o 'value' cambien, guardamos el nuevo valor en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]); // Dependencias obligatorias

  return [value, setValue];
};

export default useLocalStorage;