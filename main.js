import { database } from "./firebase";
import { ref, set, update, child, get } from "firebase/database";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const form = document.querySelector("form");
const nameInput = document.querySelector("#nameInput");
const passwordInput = document.querySelector("#password");
// const submitButton = document.querySelector("#submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value;
  const password = passwordInput.value;
  login(name, password);
});

// app
async function register(name, password) {
  //validation
  createUserWithEmailAndPassword(auth, name, password)
    .then(function () {
      const user = auth.currentUser;
      const userID = user.uid;
      writeUserData(name, userID);
    })
    .catch(function (error) {
      var error_code = error.code;
      var error_message = error.message;
      alert(error_message);
    });
}

function writeUserData(name, userID) {
  set(ref(database, "users/" + userID), {
    username: name,
    dateLoggedIn: Date(),
  })
    .then(() => {
      // redirect to info.html after data is inserted into the database
      window.location.href = "/info.html";
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateUserData(userID, newDate) {
  const userRef = ref(database, "users/" + userID);
  update(userRef, {
    dateLoggedIn: [
      ...((await get(child(userRef, "dateLoggedIn"))).val() || []),
      newDate,
    ],
  })
    .then(() => {
      console.log("Data added successfully!");
    })
    .catch((error) => {
      console.log("Error adding data:", error);
    });
}

function login(name, password) {
  signInWithEmailAndPassword(auth, name, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const userID = user.uid;
      updateUserData(userID, { date: Date() });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}
