
//Staff.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Staff.css'; 
import { useDogProfiles } from './DogProfilesContext'; 
import ActivitetsSchema from './Aktivitet';


const DogProfileForm = () => {
  const { profiles, setProfiles } = useDogProfiles(); 
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    owner: '',
    isNeutered: '',
    friends: [],
    description: ''
  });
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [editProfileId, setEditProfileId] = useState(null);
  const [visibleProfileId, setVisibleProfileId] = useState(null);
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
// Hantera markerade hundar i "Hundar inne idag", usestate = om de finns i localstorage ska de synas markerade, om icke så syns dem inte markerade.
  const [markedDogs, setMarkedDogs] = useState(() => {
    const storedMarkedDogs = localStorage.getItem('markedDogs');
    return storedMarkedDogs ? JSON.parse(storedMarkedDogs) : [];
  });
  //useEffect uppdaterar bara när de ändras, dvs markerade eller inte
  useEffect(() => {
    localStorage.setItem('markedDogs', JSON.stringify(markedDogs));
  }, [markedDogs]);

  // Beroenden [setProfiles] tillagt för att följa rekommendationer och undvika varningar
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/DogProfiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('gick inte att hämta profilen:', error);
      } };
    fetchProfiles();
  }, [setProfiles]);


  // Funktion för att hämta profiler från servern.
  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/DogProfiles');
      setProfiles(response.data);
    } catch (error) {
      console.error('gick ej att hämta profilen:', error);
    }
  };

{/* ///////////////////////////////////////////Handlefunktioner/////////////////////////////////////////////////////////////////////////////////////////////////// */}
// handleSubmit för skapandet och uppdatering av ny profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append('image', image);
    for (const key in formData) {
      if (key === 'friends') {
        formData.friends.forEach(friend => {
          formDataWithImage.append('friends', friend);
        }); } else {
        formDataWithImage.append(key, formData[key]);
      }} try {
      let response;
      if (editProfileId) {
        // Om editProfileId är satt, uppdatera befintlig profil
        response = await axios.put(`http://localhost:5000/api/edit/DogProfiles/${editProfileId}`, formDataWithImage, {
          headers: {
            'Content-Type': 'multipart/form-data'} });
      } else {
        // Annars, skapa en ny profil
        response = await axios.post('http://localhost:5000/api/DogProfiles', formDataWithImage, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }});
      } 
      if(response.status === 200 || response.status === 201) {

      fetchProfiles();
      // Återställer formuläret efter inlämning
      setFormData({
        name: '',
        age: '',
        owner: '',
        isNeutered: '',
        friends: [],
        description: ''
      });
      setImage(null);
      setEditProfileId(null); 

    } else {
      console.error('Unexpected response status:', response.status);
    }
  } catch (error) {
    console.error('Failed to submit profile:', error);
  }
};

//kod för uåppdatering av vänlista i en profil
const handleFriendChange = (e) => {
  const { value } = e.target;
  console.log('nu ändrar du ngt i vänlistan:', formData.friends);
if (formData.friends.includes(value)) {
    // Ta bort vännen från listan
    setFormData((prevFormData) => {
      const updatedFriends = prevFormData.friends.filter((friendId) => friendId !== value);
      console.log('Uppdaterad vännlista med ny vän:', updatedFriends);
      return { ...prevFormData, friends: updatedFriends };
    });
  } else {
    // Lägg till vännen i listan
    setFormData((prevFormData) => {
      const updatedFriends = [...prevFormData.friends, value];
      console.log('Uppdaterad vänlista  med ny vän:', updatedFriends);
      return { ...prevFormData, friends: updatedFriends };
    });
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSearch = () => {
  const searchTerm = formData.search.toLowerCase();
  const filtered = profiles.filter(profile => profile.name.toLowerCase().includes(searchTerm));
  filteredProfiles(filtered);
};
  // Funktion för att hantera ändring av bild.
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

//FÖRBEREDER profilen för redigering, hämtar all info osv
  const handleEdit = async (profileId) => {    
    const profileToEdit = profiles.find(profile => profile._id === profileId);
    if (!profileToEdit) {
      console.error('Profilen hittades inte');
      return;
    } console.log(profileToEdit)
    setFormData({
      name: profileToEdit.name,
      age: profileToEdit.age,
      owner: profileToEdit.owner,
      isNeutered: profileToEdit.isNeutered,
      friends: profileToEdit.friends,
      description: profileToEdit.description
    });
    setEditProfileId(profileId);
  };

    // RADERA EN PROFIL
    const handleDelete = async (profileId) => {
      try {
        console.log('Trying to delete profile with ID:', profileId);
        await axios.delete(`http://localhost:5000/api/DogProfiles/${profileId}`);
        console.log('profilen är raderad');
        fetchProfiles(); // Hämta profiler igen för att uppdatera listan
      } catch (error) {
        console.error('kunde inte radera profilen:', error);
      }
    };


///////////////////////////////////////////////////////////Hundar inne på dagiset idag//////////////////////////////////////// 
//Datum
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('sv-SE', options);

  const toggleDogInToday = (profileId) => {
    if (markedDogs.includes(profileId)) {
      setMarkedDogs((prevMarkedDogs) => prevMarkedDogs.filter((id) => id !== profileId));
    } else {
      setMarkedDogs((prevMarkedDogs) => [profileId, ...prevMarkedDogs]);
    }};
  
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (markedDogs.includes(a._id) && !markedDogs.includes(b._id)) {
      return -1;
    } else if (!markedDogs.includes(a._id) && markedDogs.includes(b._id)) {
      return 1;
    } else {
      return 0;
    }});

  /* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    // Funktion för att växla synlighet för profilens detaljer
    const toggleProfileVisibility = (profileId) => {
      setVisibleProfileId(profileId === visibleProfileId ? null : profileId);
    };
    const filteredProfiles = profiles.filter(profile =>
      profile.name && profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );




/* ///////////////////////////////////////////////////RETURN///////////////////////////////////////////////////////////////////////*/

  return (
    <div>
 {/* SÖK efter en hund*/}
        <h2>Hundprofiler:</h2>
    <input
      type="text"
      placeholder="Sök profiler..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className='sökfält'
    />
    <button onClick={handleSearch} className="search-button">Sök</button>

{/* PROFIL-CONTAINER */}
    <div className='Allcontent'>
    <div className="profiles-container">
      {filteredProfiles.map(profile => (
        <div key={profile._id} className="profile">
          <h2 className='hundrubrik'>{profile.name}</h2>
          <img src={`http://localhost:5000/${profile.image}`} alt={profile.name} className="profile-image" />

          {visibleProfileId === profile._id && (
            <div className="profile-details">
              <p className="detail"><span className="bold">Ålder:</span> {profile.age}</p>
              <p className="detail"><span className="bold">Ägare:</span> {profile.owner}</p>
              <p className="detail"><span className="bold">Kastrerad:</span> {profile.isNeutered}</p>
              <p className="detail"><span className="bold">Vänner:</span> 
          
            {profile.friends.length > 0?  profile.friends.map(friendId => {
             const friend = profiles.find(profile => profile._id === friendId);
            return friend? friend.name : '';
            })
            .filter(name => name).join(', ') : 'Inga vänner'}</p>
              <p className="detail"><span className="bold">Beskrivning:</span> {profile.description}</p>
            </div>)}

{/* /////////////////////////////BUTTON-CONTAINER FÖR PROFIL//////////////////////////////////////// */}
          <div className="buttons-container">
            <button className="ProfilKnapp" onClick={() => toggleProfileVisibility(profile._id)}>
              {visibleProfileId === profile._id ? 'Dölj profil' : 'Visa profil'}
            </button>
            <div className="edit-delete-container">
              <button className='ProfilKnapp' onClick={() => handleEdit(profile._id)}>Redigera profil</button>
              <button className="ProfilKnapp" onClick={() => handleDelete(profile._id)}>Ta bort</button>
            </div>
          </div>
        </div>
      ))}
    </div>


{/* ////////////////////////////////////HUNDAR INNE PÅ DAGISET IDAG//////////////////////////////////////////////////// */}
<div className='side'>
<div className="dogs-in-today">
  <h2>Hundar på dagiset idag idag  <br /> <span className="date">{formattedDate}:</span></h2>
  <div className="dog-list">
  {profiles.map((profile) => (
            <label key={profile._id}>
              <input
                type="checkbox"
                checked={markedDogs.includes(profile._id)} 
                onChange={() => toggleDogInToday(profile._id)}
              />
          {profile.name}
        </label>
        ))}
      </div>
  </div>

{/* ///////////////////////////SKAPA HUNDPROFIL//////////////////////////////////////////////// */}
<div className='createdog'>
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Lägg till en Hund: </h2>
  {/* Välj Namn */}
  <input 
  type="text" 
  name="name" 
  value={formData.name} 
  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
  className="input-field" 
  placeholder="Namn" 
/>    
{/* Välj Ålder */}
<input 
  type="number" 
  name="age" 
  value={formData.age} 
  onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
  className="input-field" 
  placeholder="Ålder" 
/>
{/* Välj Ägare */}
<input 
  type="text" 
  name="owner" 
  value={formData.owner} 
  onChange={(e) => setFormData({ ...formData, owner: e.target.value })} 
  className="input-field" 
  placeholder="Ägare" 
/>
{/* Välj Kastreringsstatus */}
<select 
  name="isNeutered" 
  value={formData.isNeutered} 
  onChange={handleChange} 
  className="input-field"
>
   <option value="">Välj kastreringsstatus</option>
  <option value="Kastrerad">Kastrerad</option>
  <option value="Ej kastrerad">Ej kastrerad</option>
  <option value="Kemiskt kastrerad">Kemiskt kastrerad</option>
</select>

{/* Välj vänner */}
 <h3>Välj vänner</h3>
{profiles.map((profile) => (
    <div key={profile._id}>
    <input
      type="checkbox"
      id={profile._id}
      value={profile._id}
      checked={formData.friends ? formData.friends.includes(profile._id) : false}
      onChange={handleFriendChange}
    />
    <label htmlFor={profile._id}>{profile.name}</label>
  </div>
))}

{/* Välj Bild */}
<input type='file' accept='image/*' onChange={handleImageChange} className='input-field' />
    <input 
  type="text" 
  name="description" 
  value={formData.description} 
  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
  className="input-field" 
  placeholder="Beskrivning av hund" 
/>
  <button type="submit" className="submit-button">{editProfileId ? 'Uppdatera profil' : 'Skapa profil'}</button>
    </form>
  </div>
  </div>
  </div>
  </div>
);
      }

      const Staff = () => {
        return (
          <div>
              <Route path="/Staff" component={DogProfileForm} />
              <Route path="/Aktivitet" component={ActivitetsSchema} /> 
      
      
          </div>
        );
      };
      export default DogProfileForm;
      
      
      
      


