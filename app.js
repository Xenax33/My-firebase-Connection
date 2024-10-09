const express = require('express');
const admin = require('firebase-admin');
const cors = require("cors");
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library'); // Import Google Auth Library
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "nabeel-5d247",
    "private_key_id": "69b02b8d7117e60f900a87587c33383d822488c2",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRbHE1hvLUD2sO\nvA82tu9nuKvTT/YnqqLuIJxCJZPrL37+9RuUjkqkMesMNidycgDXOV/gE0WAnM+V\ntiPuqnbSv5T0YVjOcJymmFf0DQD/wx55e1VSIIdPKjfLPqJ8D7effrv3A3FqdcRw\nKpB3vDiFTXgx/m+85Nhu35JfbXyr/GCs6hVh1se9z8XpHTbFq1Y2N9oWfDtGMT4U\nTy/ffrBByQDgwfnZXjbeuc7u+hKxppelRxWRhXF/3sEJEGnXEZQNwEnzvCvmfK60\n7sCz1ylqwtSpnp8EO7n/oxNyQ4OTsm6l3EOgSWC/tovTj4/sTBj77IGOErjfTyAX\neT5S8Xr3AgMBAAECggEANafaDYPIvUpB/KF0KGmQRvvKkjZfc+RFIEucnVnxXwVp\nPTthWJtoRk8/0H4jdy/8RSg/BzMI0J3clZf39tMX5IEPUdmLHkE98XUAu9eFFQJR\n0YAm6QbKhB7l8p3WlYCVZDjdQblRGpyXusE9CGBh/s1NaUmuKTBcv3NqliaAFbP6\nC6SD7dYrIR0tfQx54VfhibYCC412U5ZEz5cAoQLn1i+v2teBtrpcoFIsT1eTQDtj\n/RNUD7O42ZRWeotniZDHKy65W7QmYGoSxmCML7FpZq5N6LJVrUXsjhLxXxHOiB4M\n3flZje5Gzjli1tUBOSNEYCmxxrbxwPYyCutWQznkmQKBgQDrFJDgziGfpPog3i25\nCjoGr9QnG7gMPssPue5JnmAQRCNgqEyB4jbhu+0sXxZnP7JSDLzwJ3wWnkVHdzS8\nay5aTIXtYMZmLRTz7W1Oa1kT+8ZYQNIiYkXikG4Xb7nUIFMQC2hlzpVKWm19WtQU\nI8q4aPN93qeMGv2cS/8LF+02BQKBgQDkD2H6f6Re+rAhNG+2mn/EEthOaBrUfu+e\nvEMqd0gNJxQNzXhnFZGb3kFV5WB7WJro/4neoBZ9JnbJ61r/apJVPpGy/6SVtIT/\n4j4gJdvwM2SjsvAJEmw/I7cS8KqflJm7g4DwkVoAV4fDcQE/5MuDEeGsXRfU53JT\nIIPk2y0hywKBgQC+fZHQuPhCFzuguqkuUn0mwgAWGL4RHikJ+05+VVnelHhecMJe\nVWLHlLLhy8OpstHa7vuDV1uUMHhPKueO7wNGpM+5xTu/vDRIXVK/wvkR2mmlRhGB\nT0T2DLdJQn3AyNjGHZhhNv9+mrwyYhGMqFwzBsiYbH40aAKuTl7DLIZJyQKBgGjo\nVpbHjpIOWWT83QKvsWQ9kvkGVIk5Vvq6+V6YfjFmr4fl46PvvQppQ77ChA5ZZPEX\nU5FwLMgnIG+j7zkdCfFild00Ub53ytJ2fUOGhtTIn1vaHSbfLaIhyL5SrPo5fjpO\ntMp04mTT3uTdn8iHc8J4QEpsjGDokqOAiouE8w7fAoGALZt0NyriSzIcbollnPm7\n6sFYJ3aE8cRnX+s9w2GTd17Z8HvbNMx7mhMTNOmhkTEHbgUtevWY5eYWFbbu3Lxz\nzcf1YPf3YnYl1dOeuOA5gCYjEraIkF7J5k1XV6caOVIV2rLMT8OTiCIKy9tTjO9f\n8XYkJWM/xlSwsNGrOIPrmKk=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-o6ych@nabeel-5d247.iam.gserviceaccount.com",
    "client_id": "112540963791518217449",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o6ych%40nabeel-5d247.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }),
  databaseURL: "https://anti-rip-system-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
const collectionName = "Nabeel"; // Replace with your collection name

// Initialize Google Auth Client
const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. API to Add Data
app.post('/add-data', async (req, res) => {
  try {
    const { LicenseKey, ComputerKey } = req.body;

    if (!LicenseKey || !ComputerKey) {
      return res.status(400).json({ error: 'LicenseKey and ComputerKey are required.' });
    }

    const docRef = await db.collection(collectionName).add({ LicenseKey, ComputerKey });
    res.status(200).json({ message: 'Data added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Failed to add data' });
  }
});

// 2. API to Check if Data Exists
app.post('/check-data', async (req, res) => {
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
    console.error('Error checking data:', error);
    res.status(500).json({ error: 'Failed to check data' });
  }
});

// 3. API to Get All Data
app.get('/get-data', async (req, res) => {
  try {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      return res.status(200).json({ message: 'No data found' });
    }

    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// Middleware to verify Google OAuth Token
async function verifyGoogleToken(token) {
  const ticket = await oauth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

// 4. API to Check Validity of Google Token
app.post('/check-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const payload = await verifyGoogleToken(token);
    res.status(200).json({ valid: true, payload });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ valid: false });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
