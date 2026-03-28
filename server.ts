import express from "express";
import path from "path";
import admin from "firebase-admin";

// Initialize Firebase Admin
let isFirebaseInitialized = false;
try {
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountStr) {
    const serviceAccount = JSON.parse(serviceAccountStr);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isFirebaseInitialized = true;
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not set. Firebase Admin is not initialized.");
  }
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT. It looks like you might have entered your email or an invalid string instead of the actual JSON service account key.");
  console.error("Please ensure FIREBASE_SERVICE_ACCOUNT contains the full JSON string from your Firebase service account key file.");
  console.error("Firebase Admin will not be initialized.");
}

const app = express();
app.use(express.json());

// Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();
