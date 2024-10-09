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
    "type": "service_account",
    "project_id": "nabeel-5d247",
    "private_key_id": "5196028934469cd72282155c8ee13a548b6e22fe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsdBXsp1aZCwYM\nYQiTwTJu84TPVzIzhz+dq4zoA/erq/bamfo+3Lk5hikb84T16KBimAZqkXy8bWCZ\nEy4RnIwHSoZIhl3gsW5gdZviOhEGOMUvHiWTR+9b0j8nxCDt4Wc5YWSJ8ENMR/yb\ni1WVFx9e986NSxdtsbVvCvQ4c1uLyu0hkrpBMcFHfFPR3QfXmpWqLh71gHh0P0bn\nOohw0YQoqSoKEEOAWgWapHmT3vbq1ENB74PKO1XmqRQiJucmPC+0ozxhyf9x/znU\nj69ymNtSFi/NyF9b2WBuhJvUmTkSIdTBufsjjU/KyEkKeFb2fvfqcjSnHTTgpPjf\n0Sh01eXhAgMBAAECggEAMc2SmVYYQbl3xTJupjEYrgcgtzpQ0qW//vpQhp7Cs27F\nqwrlxKq8yTqP+7T/lH7adq69x5/9fHM//uUVnFtv6xkgH6jCSsYjALNmUdaAHSJe\n+8UCh/6xxvw4ZfUTp289fso8HUPoQ4rUjl0WWaikVCpPmelyOikkow1wSy8xZHS8\nMjylUI2QnYnMvYaPwNXPQnlMxLcyqLYNZcoo4WD02TsLGnQr6HMWGTBoXycNPDV2\nnadNGOJs0c1iI6G9oqb5IVXCGtjAyUEkfmlBHcbRg08ZAp/PM92Dy1gxWy1btSyW\nTKlUPnbQ6E2TVKQL502WI03R53te5uMUdDEPKLjXOwKBgQDdO42Zq+K9tperdoRh\nK4/47mM2uGAfhmIuNIMs7deShlfoKVGXaHQFg14bfy4qLOmSDy/8QODJtx+WAppC\nxREPWMuZVP7+n3EX5OcMqu9evU8WfwymIRsjRnrSVVPJRTf6nZbStXRASwUCuUBV\ndMXwHp1n1gRQJkMOAiS6ZJ+aZwKBgQDHjhbu/oP8e9WXuOGeUHnuFPgBojaj0uq/\n3/ytC78tVByKvhgfIWMTIAM5PDN9VXrSKNdrdDuHmqPZUL0DpsWW7+ZHle9i6bnp\ns3it1IvlA4U6ycZrD2/JL7GyPa5DzMY0ZZg/Qgy0zjo2vTgGjBV2E0M+bmF2Sp4J\nM3nBuz3gdwKBgBoAwPD6AgmYZ5VQtdiR/TceFe09mJa7/dg+ddiXEAp53eU8zglE\nzrZDLZF/zlZItx9ix5oXqhQrgPvpzGXisdGi9zNLiTk2Vl2fmwSjJsV07NHRFxSD\nuaPYyeDlBJcYmq7LTQnxJ/vSlYEvcv9YXVeO0aN9xT4CcUk5OUXrQ9MrAoGAbvzG\nIJKKEglF2KbJRWX5CsO61B3GSgNq8ODBBfW8lJdtcHUdsWK+Wcq6QEENWi4Kq4xv\nk6IH4fnOG3XeSoOc7b/r0fDAPcFE14gsHHJUhEEa/oFuy+jAAaN3L21C2Q6xRj8j\nGDvCGWWB1yQSXwHWhd9czQJTTpldoDxzAZ8EYS0CgYEAtUrDCjDk6V/aGW/JaSUo\nTMi7Ve69UmkYmPAjyc7JinrqQObuWnp3diZmeYemRfu6UG2iW/JrMVQGNZBCg2Wy\n35fIOIJ+HGZ9cSUhboqXuNs3jJMNswPt3JuAu1W47JErnBazQMVAuAnZ6XCabiCj\nENlulPcZAYTixlNMRqY/MYU=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-o6ych@nabeel-5d247.iam.gserviceaccount.com",
    "client_id": "112540963791518217449",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o6ych%40nabeel-5d247.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }),
  databaseURL: "https://nabeel-5d247-default-rtdb.asia-southeast1.firebasedatabase.app"
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
