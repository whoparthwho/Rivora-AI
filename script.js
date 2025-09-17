// Working with Gemini API
import { GoogleGenAI } from "https://esm.sh/@google/genai";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDcWb0Op-nViQ9OmWYqGPaB0P8njnmdWDs",
});

async function callGemini(query) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });
    return response.text;
  } catch (error) {
    return "Sorry!! There was an error generating a response.";
  }
}



//Handling the Slide Bar
let slide_info = true;
let slider_btn = document.querySelector(".slider-btn");
let slider_btn_icon = document.querySelector(".slider-btn-icon");
slider_btn.addEventListener("click", () => {
  const slider = document.querySelector(".slider");
  slider.classList.toggle("slide");
  slider_btn_icon.classList.toggle("rotateIcon");
});

//Handling Form for Input
let userForm = document.getElementById("user-input");
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

const input = document.getElementById("question");
input.addEventListener("focus", () => {
  setTimeout(() => {
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
});

// Listen for some key press on the whole page
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (e.key === "Escape" || e.key === "Tab" || e.key.startsWith("F")) return;
  if (document.activeElement !== input) {
    input.focus();
  }
});
//Handle Data and Input
async function sendMessage() {
  //Acquiring the Message from From
  const formData = new FormData(userForm);
  const userInput = Object.fromEntries(formData);
  const query = userInput.userQuery;
  
  if (query.trim() == "") return;
  
  console.log(query);

  //remove the Welcome Mesaage
  const welcome_box = document.querySelector("#welcome-box");
  welcome_box.style.display = "none";

  //Append User Message on Right
  appendMessage(query, "right");
  document.getElementById("question").value = "";

  getLoading();
  //Getting Response
  const response = await callGemini(query);
  stopLoading();

  //Appending Response from Gemini on Left
  appendMessage(response, "left");

  console.log(response);
}

//Loading The Getting Response
let interval;
let loadingBar;
function stopLoading() {
  clearInterval(interval);
  loadingBar.remove();
  loadingBar = null;
}

function getLoading() {
  loadingBar = document.createElement("div");
  loadingBar.className = "message-left";
  document.querySelector(".message-area").appendChild(loadingBar);
  setTimeout(() => {}, 1000);
  let dots = 0;
  let interval = setInterval(() => {
    dots = (dots + 1) % 4;
    loadingBar.innerHTML = "Getting you a response" + ".".repeat(dots);
    console.log(loadingBar.innerHTML);
  }, 1500);
}

//Appending Message Function
function appendMessage(text, classname) {
  const div = document.createElement("div");
  div.className = "message-" + classname;
  div.innerHTML = text;
  document.querySelector(".message-area").appendChild(div);
}



