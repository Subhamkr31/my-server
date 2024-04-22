// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');
// const User = require('./userModel');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Connection URI
// const uri = 'mongodb+srv://azadkhan12323287:8PRjf7iObZweQHNG@cluster0.w8sfsn6.mongodb.net/';
// // Database Name
// const dbName = 'your_database_name';
 

// // Connect to MongoDB
// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//   if (err) {
//     console.error('Failed to connect to MongoDB:', err);
//     return;
//   }
//   console.log('Connected to MongoDB');
//   // db = client.db(dbName);
// });



const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./userModel'); // Import the User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://azadkhan12323287:8PRjf7iObZweQHNG@cluster0.w8sfsn6.mongodb.net/users';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Signup API
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({ username, password: hashedPassword });

    // Send the token and signup success message in the response
    return res.status(201).json({ message: 'Signup successful',  });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
     
    if (!user) {
      return res.status(401).json({ error: 'Invalid username ' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
   
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'avshjkljjjldhbv', { expiresIn: '1h' });

    // Send the token in the response
    return res.status(200).json({ message: 'Login successful', token });   
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user/list', async (req, res) => {
   
  try {
  
    const user = await User.find( );
    return res.status(200).json({ message: 'User list',user });   
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

  
app.get('/',(req, res)=> {
  return res.status(200).json({ message: 'Server Running' });
})
    
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);    
});
