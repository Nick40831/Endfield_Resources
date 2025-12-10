import { app } from "./firebase.js"
import { getAuth, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const auth = getAuth(app)

export async function userLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
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
    updateProfile(userCredential.user, { displayName: username})
    return true;
  } catch (error) {
    console.error('Sign Up Error:', error.message);
    alert('Sign Up failed: ' + error.message);
    return false;
  }
}

export function checkUser() {
  return auth.currentUser ? auth.currentUser.displayName : "Guest";
}
