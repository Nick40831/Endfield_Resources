import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2uKKIErs1fZnwIFEkVkN651eK1IhTvSI",
  authDomain: "nl-web-6b15e.firebaseapp.com",
  databaseURL: "https://nl-web-6b15e-default-rtdb.firebaseio.com",
  projectId: "nl-web-6b15e",
  storageBucket: "nl-web-6b15e.firebasestorage.app",
  messagingSenderId: "258523564341",
  appId: "1:258523564341:web:08d9835dfb436e6ebb647c",
  measurementId: "G-R39TPYBE1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export { app, database }

// https://firebase.google.com/docs/web/learn-more#available-libraries