const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
//filen där bilderna hamnar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB-databas 
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('ihopkopplad med MongoDB'))
.catch(err => console.error('fel på mongoDB - ingen connection:', err));

// Multer konfiguration för filuppladdning
// Sparar uppladdade bilder i 'uploads' - alltså man laddar upp o den sparas i servern o läggs i uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Unikt filnamn
  }
});

const upload = multer({
  storage: storage // Använder den anpassade storage-konfigurationen
});


// schema för hundprofiler
const dogProfileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  owner: String,
  isNeutered: String,
  friends: [String],
  image: String,
  description: String
});

// modellen för hundprofiler
const DogProfile = mongoose.model('DogProfile', dogProfileSchema);

// Schema för recenssioner
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  rating: Number, 

  createdAt: { type: Date, default: Date.now } 
});
const BlogPost = mongoose.model('BlogPost', blogPostSchema);


// HUNDPROFILER
app.get('/api/DogProfiles', async (req, res) => {
  try {
    const profiles = await DogProfile.find();
    res.json(profiles);
  } catch (error) {
    console.error('kan inte hämta datan:', error);
    res.status(500).json({ error: 'Kan inte hämta datan' });
  }
});


// Rutt för att skapa en ny hundprofil med bilduppladdning
app.post('/api/DogProfiles', upload.single('image'), async (req, res) => {
  try {
    let { name, age, owner, isNeutered, friends, description } = req.body;
    // sparar sökvägen till bilden 
    const imagePath = req.file ? req.file.path : ''; 

    // Konvertera friends till en array om det är en sträng
    if (typeof friends === 'string') {
      try {
        friends = JSON.parse(friends);
      } catch (error) {
        console.error('kunde inte para ihop vänner:', error);
        friends = [];
      }
    }
    if (!Array.isArray(friends)) {
      console.error('Friends must be an array');
      return res.status(400).json({ error: 'vänner måste va en Array' });
    }
    // skapar den nya profilen
    const newProfile = await DogProfile.create({
      name,
      age,
      owner,
      isNeutered,
      image: imagePath,
      friends,
      description,
    });

    //uppdaterar vänlistor på de andras profiler, lägger till vän
    await Promise.all(friends.map(async (friendId) => {
      await DogProfile.findByIdAndUpdate(friendId, {
        $push: { friends: newProfile._id.toString() } // använder $push för att lägga till den nya profilen i vänlistan hos dem andra
      });
    }));

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('kunde inte skapa en ny profil:', error);
    res.status(500).json({ error: 'kunde inte skapa en ny profil' });
  }
});



// uppdaterar profiler
app.put('/api/edit/DogProfiles/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, age, owner, isNeutered, friends, description } = req.body;
    const imagePath = req.file ? req.file.path : ''; 

    // hittar profil - id
    const profileToUpdate = await DogProfile.findById(req.params.id);
    if (!profileToUpdate) {
      return res.status(404).json({ error: 'Profilen hittades inte tyvärr' });
    }
    profileToUpdate.name = name;
    profileToUpdate.age = age;
    profileToUpdate.owner = owner;
    profileToUpdate.isNeutered = isNeutered;
    profileToUpdate.friends = friends;
    // använder befintlig bild om ingen ny bild ges
    profileToUpdate.image = imagePath || profileToUpdate.image; 
    profileToUpdate.description = description;
    // spara den uppdaterade profilen i databasen
    const updatedProfile = await profileToUpdate.save();

    res.json(updatedProfile);
  } catch (error) {
    console.error('kunde inte uppdatera profilen:', error);
    res.status(500).json({ error: 'kunde inte uppdatera profilen' });
  }
});


// tar bort en hundprofil
app.delete('/api/DogProfiles/:id', async (req, res) => {
  try {
    const deletedProfile = await DogProfile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ error: 'hittaded inte profilen' });
    }
    res.json({ message: 'Profilen är nu radeeeeerad' });
  } catch (error) {
    console.error('de gick inte att radera profilen:', error);
    res.status(500).json({ error: 'de gick inte att radera profilen' });
  }
});

//hämtar recenssioner från databasen
app.get('/api/BlogPosts', async (req, res) => {
  try {
    // sorterar recenssionerna så att se senaste kommer först
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 }); 
    res.json(blogPosts);
  } catch (error) {
    console.error('Kunde inte hämta recenssioner:', error);
    res.status(500).json({ error: 'Kunde inte hämta reenssioner' });
  }
});

//skapa ett nytt blogginlägg
app.post('/api/BlogPosts', async (req, res) => {
  try {
    const { title, content, author, rating } = req.body;
    const newPost = await BlogPost.create({
      title,
      content,
      author,
      rating
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Det gick inte att skapa en recenssion:', error);
    res.status(500).json({ error: 'Det gick inte att skapa en recenssion' });
  }
});

//ta bort ett blogginlägg
app.delete('/api/BlogPosts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Recenssionen hittades inte!' });
    }
    res.json({ message: 'Nu är inlägget raderat!' });
  } catch (error) {
    console.error('De gick inte att radera recenssionen:', error);
    res.status(500).json({ error: 'De gick inte att radera recenssionen' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

