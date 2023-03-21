import { database } from "./firebase";
import { ref, set, update, child, get, onValue } from "firebase/database";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("dold");
  } else {
    const user = auth.currentUser;
    const timeSpent = ref(database, "users/" + user.uid + "/dateSeconds");
    onValue(timeSpent, (snapshot) => {
      const dateTime = snapshot.val();
      const timeDiff = Date.now() - dateTime;
      if (timeDiff > 100) {
        console.log(timeDiff);
      } else {
        console.log("inte dags än");
      }
    });
  }
});

const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      updateUserData(uid, 1);
      readData(uid);
    } else {
      window.location.href = "/startpage.html";
    }
  });
});

function readData(userId) {
  const starCountRef = ref(database, "users/" + userId + "/dateSeconds");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
  });
}

async function updateUserData(userID, newDate) {
  const userRef = ref(database, "users/" + userID);
  update(userRef, {
    clickedButton: [
      ...((await get(child(userRef, "clickedButton"))).val() || []),
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
