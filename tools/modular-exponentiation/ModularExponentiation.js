// Navigation
const navigation = document.getElementById("nav");

// Form
const inputForm = document.querySelector("#input");

// The submit button.
const submitButton = document.querySelector("#submit");

function menuClick() {
  if (navigation.className === "closed") {
    navigation.className = "open";
  } else {
    navigation.className = "closed";
  }
}

computerModularExponentiation = () =>
{
    console.log("Hello");
}

// Prevents the submit button from being automatically clicked when the
// page is loaded.
inputForm.addEventListener("submit", (event) => {event.preventDefault();});

// Clicking the submit button will call computerLinearRegression.
submitButton.addEventListener("click", computerModularExponentiation);

