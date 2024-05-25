const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 4000; // Read port from environment variable

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
// Enable Mongoose debugging
mongoose.set('debug', true);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/voting")
  .then(() => {
    console.log('Connection successful');
  })
  .catch((err) => {
    console.log('No connection', err);
  });

// Define Mongoose schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  birthDate: { type: Date, required: true },
  voterID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  registerAs: { type: String, required: true }
});

// Create Mongoose model
const User = mongoose.model('User', userSchema);

// Serve static files
app.use(express.static('public'));

// Handle form submission for registration
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, birthDate, voterID, password, gender, registerAs } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      birthDate,
      voterID,
      password: hashedPassword,
      gender,
      registerAs
    });

    await newUser.save();
    res.send('Registration successful!');
  } catch (error) {
    console.error('Error saving data:', error); // Log error for debugging
    res.status(400).send('Error saving data');
  }
});

// Handle form submission for login
app.post('/login', async (req, res) => {
    console.log('Request body:', req.body);
    // Rest of your code
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
