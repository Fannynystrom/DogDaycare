//DogProfilesContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DogProfilesContext = createContext();

export const DogProfilesProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //loading och error states för att hantera fel o dataladdning

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/DogProfiles');
                setProfiles(response.data);
                setError(null); 
            } catch (err) {
                console.error('Failed to fetch profiles:', err);
                setError(err);
            } finally {
                setLoading(false); // false när datan är hämtad
            }};
        fetchProfiles();
    }, []); 

    return (
        <DogProfilesContext.Provider value={{ profiles, setProfiles, loading, error }}>
            {children}
        </DogProfilesContext.Provider>
    );
};

export const useDogProfiles = () => useContext(DogProfilesContext);

