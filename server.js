const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./models'); 

// Now you can use models.Citizen and models.TitleTransfer
const Citizen = models.Citizen;
const TitleTransfer = models.TitleTransfer;

const app = express();
const PORT = process.env.PORT || 3800;

// MongoDB connection setup (replace YOUR_MONGO_URI with your MongoDB connection string)
mongoose.connect('mongodb+srv://SamueShuruma:sam1998sam@cluster0.nv2gn3g.mongodb.net/BLB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Event listener for successful MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB (BLB) successfully');
});

// Event listener for MongoDB connection error
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Express middleware setup
app.use(bodyParser.urlencoded({ extended: true }));

// Express routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to register a citizen
app.post('/register-citizen', async (req, res) => {
  try {
    const newCitizen = new Citizen(req.body);
    await newCitizen.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to perform a title transfer
app.post('/perform-title-transfer', async (req, res) => {
  try {
    // Extract data from the request body
    const { citizenId, titleTransferData } = req.body;

    // Validate the input data
    if (!citizenId || !titleTransferData) {
      return res.status(400).json({ success: false, message: 'Invalid input data.' });
    }

    // Find the citizen by ID
    const citizen = await Citizen.findById(citizenId);

    // Check if the citizen exists
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Citizen not found.' });
    }

    // Create a new title transfer instance
    const titleTransfer = new TitleTransfer({
      ...titleTransferData,
      newOwnerName: citizen.fullName, // Assuming you want to associate the title transfer with the citizen
    });

    // Save the title transfer to the database
    await titleTransfer.save();

    // Update the citizen with the title transfer details
    citizen.titleTransfer = titleTransfer._id; // Assuming you have a 'titleTransfer' field in your Citizen schema
    await citizen.save();

    // Respond with a success message and the title transfer details
    res.json({ success: true, message: 'Title transfer successful.', data: titleTransfer });
  } catch (error) {
    console.error('Error performing title transfer:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route to fetch all citizens
app.get('/get-citizens', async (req, res) => {
  try {
    const allCitizens = await Citizen.find();
    res.json(allCitizens);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to fetch all title transfers
app.get('/get-title-transfers', async (req, res) => {
  try {
    const allTitleTransfers = await TitleTransfer.find();
    res.json(allTitleTransfers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
