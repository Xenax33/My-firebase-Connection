const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "nabeel-5d247",
    private_key_id: "69b02b8d7117e60f900a87587c33383d822488c2",
    private_key: process.env.FIREBASE_PRIVATE_KEY, // Use environment variable
    client_email: "firebase-adminsdk-o6ych@nabeel-5d247.iam.gserviceaccount.com",
    client_id: "112540963791518217449",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o6ych%40nabeel-5d247.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }),
  databaseURL: "https://anti-rip-system-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
const collectionName = "Nabeel"; // Replace with your collection name

// 1. API to Add Data
app.post('/add-data', async (req, res) => {
  console.log('Received request to add data:', req.body); // Log request
  try {
    const { LicenseKey, ComputerKey } = req.body;

    if (!LicenseKey || !ComputerKey) {
      return res.status(400).json({ error: 'LicenseKey and ComputerKey are required.' });
    }

    const docRef = await db.collection(collectionName).add({ LicenseKey, ComputerKey });
    res.status(200).json({ message: 'Data added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding data:', error); // Log error
    res.status(500).json({ error: 'Failed to add data' });
  }
});

// 2. API to Check if Data Exists
app.post('/check-data', async (req, res) => {
  console.log('Received request to check data:', req.body); // Log request
  try {
    const { LicenseKey, ComputerKey } = req.body;

    if (!LicenseKey || !ComputerKey) {
      return res.status(400).json({ error: 'LicenseKey and ComputerKey are required.' });
    }

    const querySnapshot = await db.collection(collectionName)
      .where('LicenseKey', '==', LicenseKey)
      .where('ComputerKey', '==', ComputerKey)
      .get();

    if (querySnapshot.empty) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    console.error('Error checking data:', error); // Log error
    res.status(500).json({ error: 'Failed to check data' });
  }
});

// 3. API to Get Data
app.get('/get-data', async (req, res) => {
  console.log('Fetching data...'); // Log request
  try {
    const snapshot = await db.collection(collectionName).get();
    console.log('Snapshot:', snapshot); // Log snapshot

    if (snapshot.empty) {
      return res.status(200).json({ message: 'No data found' });
    }

    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error); // Log error
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Default to 3000 if not set
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
