
import "./Aktivitet.css";
import React, { useState, useEffect } from 'react';
import { useDogProfiles } from './DogProfilesContext';
import { Link } from 'react-router-dom';

const ActivitetsSchema = () => {
  const { profiles } = useDogProfiles();

  const initialDogsState = {
    "Måndag 18.00-19.00": [],
    "Tisdag 18.00-19.00": [],
    "Onsdag 18.00-19.00": [],
  };

  const [selectedDogs, setSelectedDogs] = useState(() => {
    const savedSelection = localStorage.getItem('selectedDogs');
    return savedSelection ? JSON.parse(savedSelection) : initialDogsState;
  });

  useEffect(() => {
    localStorage.setItem('selectedDogs', JSON.stringify(selectedDogs));
  }, [selectedDogs]);

  const handleSelectDog = (timeSlot, dogId) => {
    setSelectedDogs(prevSelected => {
      const updatedSelection = { ...prevSelected };
      const currentSelection = updatedSelection[timeSlot];
      if (!currentSelection.includes(dogId)) {
        updatedSelection[timeSlot] = [...currentSelection, dogId];
      } else {
        updatedSelection[timeSlot] = currentSelection.filter(id => id !== dogId);
      }
      return updatedSelection;
    });
  };

  return (
    <div className="aktiviteter-container">
      <h2 className="aktivitetsrubrik">Agility</h2>
      <div className="aktivitetsdag-container">
        {Object.keys(selectedDogs).map(timeSlot => (
          <div key={timeSlot} className="aktivitetsdag">
            <h3>{timeSlot}</h3> {/* tiden visas  som en del i rubriken */}
            <select onChange={(e) => handleSelectDog(timeSlot, e.target.value)} value="">
              <option value="">Välj hund</option>
              {profiles.map(profile => (
                <option key={profile._id} value={profile._id}>
                  {profile.name}
                </option>
              ))}
            </select>
            <div>
              Valda hundar:
              <ul>
                {selectedDogs[timeSlot].map(dogId => {
                  const dog = profiles.find(profile => profile._id === dogId);
                  return (
                    <li key={dogId}>
                      {dog ? dog.name : 'Okänd hund'}
                      <button onClick={() => handleSelectDog(timeSlot, dogId)}>Ta bort</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitetsSchema;
