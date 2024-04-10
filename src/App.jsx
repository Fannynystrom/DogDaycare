 // App.jsx

 import React, { useState, useEffect } from 'react';
 import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
 import Calendar from 'react-calendar';
import "./style.css"; //css för app.jsx
import Staff from './Staff'; 
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import Pricelist from './Price'
import ActivitetsSchema from './Aktivitet'; 
import MyGallery from './Bilder';
import { DogProfilesProvider } from './DogProfilesContext.jsx';
 import DogProfileForm from './Staff'; 

 const Header = () => (
  <div className="header">
    <img src="/img/Hunddagis1.png" alt="Logo" />
  </div>
);

 const Navbar = () => (
  <nav className="navbar">
    <ul>
      <li><Link to="/">Startsida</Link></li>
      <li><Link to="/about">Om oss</Link></li>
      <li><Link to="/staff/*">För personal</Link></li>
      <li><Link to="/price">Prislista och Tjänster</Link></li>
      <li><Link to="/bilder">Bilder</Link></li>
      <li><Link to="/aktivitet">Aktiviteter</Link></li>
    </ul>
  </nav>
);

const Content = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  //hårdkordade events
  const [activities, setActivities] = useState([
    { date: "2024-04-04", title: "Testa på agility", description: "Testa på en kurs i agility klockan 17.00, ring dagisetför att anmäla dig", price: 0 },
    { date: "2024-04-10", title: "Föreläsning om hundars tänder", description: "Föreläsning med Malin om hundars tandhälsa klockan 19.30, ring till dagiset för anmälan", price: 250 },
    { date: "2024-04-15", title: "Träna hundmöten med din hund", description: "Har du svårt för hundmöten? Tillsammans med hundtränaren Elin kommer ni med era hundar få gå en hundpromenad och lära er massor. Vi ses i klubbstugan 19.00", price: 100 },
    { date: "2024-04-20", title: "Öppet hus", description: "Välkommen på öppet hus, från 11.00-17.00. Drop in gäller och håll din hund kopplad. Anmäl dig i receprionen när du kommer.", price: 0 }
  ]);

  //visar händelsen på datumen med röd prick
  const handleShowActivityDetails = (date) => {
    setSelectedDate(new Date(date));
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  //Hämtar recenssioner
  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/BlogPosts');
      setBlogPosts(response.data);
      setError(null); //rensar fel vis uppdatering
    } catch (error) {
      setError("Det gick inte att hämta blogginläggen. Försök igen.");
      console.error('Gcik inte att hämta blogginlägg:', error);
    }
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  const handleAddPost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/BlogPosts', {
        title: title,
        content: content,
        author: author,
        rating: rating 

      });
      const createdPost = response.data;
      setBlogPosts([createdPost, ...blogPosts]);
      setTitle('');
      setContent('');
      setAuthor('');
      setRating(0); // återställer till 0 stjärnor
    } catch (error) {
      console.error('gick inte att lägga till recenssion:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/BlogPosts/${id}`);
      setBlogPosts(blogPosts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };



  return (
    <div className="content">
      <div className="main-column">
        <div className='content1'>
          {/* CONTAINER - Recenssioner */}
          <h2>Recensioner</h2>
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div key={post._id} className="blog-post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p><strong>Skapad av:</strong> {post.author}</p>
                <p><strong>Skapad:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                <Rating
                  count={5}
                  value={post.rating}
                  size={24}
                  edit={false} //kan inte ändra stjärnor när de laddats
                />
                <button onClick={() => handleDeletePost(post._id)}>Radera</button>
              </div>
            ))
          ) : (
            <p>Inga blogginlägg hittades.</p>
          )}

          {/* SKAPA RECENSSION */}
          <div className="blog-form">
            <input type="text" value={title} onChange={handleTitleChange} placeholder="Skriv in titeln..." />
            <textarea value={content} onChange={handleContentChange} placeholder="Skriv din recenssion här..." />
            <input type="text" value={author} onChange={handleAuthorChange} placeholder="Skriv ditt namn här..." />
            {error && <div className="error-message">{error}</div>}

            <Rating
              count={5}
              onChange={setRating}
              size={24}
              activeColor="#ffd700"
            />
            <button onClick={handleAddPost}>Lägg till inlägg</button>
          </div>
        </div>
      </div>


      {/* KALENDER */}
      <div className="side-column">
        <h2>Kommande händelser:</h2>
        <Calendar 
          className="content-calendar" 
          value={selectedDate} 
          tileContent={({ date }) => {
            const dateString = date.toLocaleDateString();
            return activities.find(activity => activity.date === dateString) ? <div className="red-dot"></div> : null;
          }}
          onClickDay={(date) => handleShowActivityDetails(date.toLocaleDateString())}
        />
        {selectedDate && (
          <div>
            <h3>{selectedDate.toLocaleDateString()}</h3>
            {activities.find(activity => activity.date === selectedDate.toLocaleDateString()) && (
              <div>
                <h4>{activities.find(activity => activity.date === selectedDate.toLocaleDateString()).title}</h4>
                <p>{activities.find(activity => activity.date === selectedDate.toLocaleDateString()).description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  return ( 
    <div>
      <h2>Om oss</h2>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore est repudiandae maiores hic itaque ad atque voluptas pariatur rem culpa. Possimus ducimus sit ex repellendus nulla asperiores corrupti consectetur rem?</p>
    </div>
  );
};




const App = () => {
  return (
    <DogProfilesProvider>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/about" element={<About />} />
          <Route path="/staff/*" element={<DogProfileForm />} />
          <Route path="/price" element={<Pricelist />} />
          <Route path="/aktivitet" element={<ActivitetsSchema />} />
          <Route path="/bilder" element={<MyGallery />} />
        </Routes>
    </DogProfilesProvider>
  );
};

export default App;

 
 