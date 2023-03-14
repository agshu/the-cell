const form = document.querySelector("form");
const nameInput = document.querySelector("#nameInput");
const submitButton = document.querySelector("#submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value;

  const response = await fetch("http://localhost:8080/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  //const newUser = await response.json();
  window.location.href = "/info.html";
});
