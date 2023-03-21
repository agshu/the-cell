document.querySelector("#app").innerHTML = `
  <div class="name">
    <form>
      <input type="text" id="nameInput" />
      <button type="submit" id="submitButton">Add user</button>
      <button type="counter" id="counterButton">Clicked</button>
    </form>
  </div>
`;

const form = document.querySelector("form");
const nameInput = document.querySelector("#nameInput");
const submitButton = document.querySelector("#submitButton");
const counterButton = document.querySelector("#counterButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value;
  const clicked = counterButton.value;

  const response = await fetch("http://localhost:8080/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, clicked }),
  });

  const newUser = await response.json();
  console.log(newUser);
});
