import { app, database } from "./firebase.js"
import { ref, set, get, child} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const auth = getAuth(app)

export async function userLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    getUsername(userCredential.user.uid)
    return true;
  } catch (error) {
    console.error('Login Error:', error.message);
    alert('Login failed: ' + error.message);
    return false;
  }
}

export async function userSignup(email, username, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    writeUsername(userCredential.user.uid, username);
    return true;
  } catch (error) {
    console.error('Sign Up Error:', error.message);
    alert('Sign Up failed: ' + error.message);
    return false;
  }
}

function getUsername(userId) {
  get(child(ref(database), `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      document.getElementById("user-menu").textContent = snapshot.val().username;
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function writeUsername(userId, name) {
  set(ref(database, 'users/' + userId), {
    username: name,
  });
}