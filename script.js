
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0nY1i34KvrgPIUPygQPlJGKA3DNBGTa0",
  authDomain: "aniversario-sthe2.firebaseapp.com",
  projectId: "aniversario-sthe2",
  storageBucket: "aniversario-sthe2.firebasestorage.app",
  messagingSenderId: "104274841847",
  appId: "1:104274841847:web:120448b49dfe4c2cdf83f2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Countdown target (21 Sep of current year 13:00 local)
const now = new Date();
const year = now.getFullYear();
const target = new Date(`${year}-09-21T13:00:00`);
if (target < now) {
  target.setFullYear(year + 1);
}
function updateCountdown(){
  const diff = target - new Date();
  if (diff <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('mins').textContent = '0';
    document.getElementById('secs').textContent = '0';
    return;
  }
  const s = Math.floor(diff/1000);
  const days = Math.floor(s/86400);
  const hours = Math.floor((s%86400)/3600);
  const mins = Math.floor((s%3600)/60);
  const secs = s%60;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('mins').textContent = mins;
  document.getElementById('secs').textContent = secs;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Form logic
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const form = document.getElementById("rsvp-form");
const nameInput = document.getElementById("guest-name");
const itemSelect = document.getElementById("guest-item");
const submitBtn = document.getElementById("submit-rsvp");
const thanks = document.getElementById("thanks-msg");
const initialButtons = document.getElementById("initial-buttons");

btnYes.addEventListener("click", () => {
  form.classList.remove("hidden");
  initialButtons.classList.add("hidden");
  nameInput.focus();
});
btnNo.addEventListener("click", () => {
  alert("Que pena 😢 Obrigado por responder. Se mudar de ideia, nos avise!");
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const item = itemSelect.value;
  if (!name) {
    alert("Por favor, preencha seu nome.");
    return;
  }
  try {
    await addDoc(collection(db, "confirmados"), {
      name,
      item,
      timestamp: serverTimestamp()
    });
    thanks.classList.remove("hidden");
    thanks.textContent = `Obrigado, ${name}! Sua presença está confirmada 🎉 Você levará: ${item}.`;
    const previews = JSON.parse(localStorage.getItem("rsvp_preview") || "[]");
    previews.unshift({name, item, at: new Date().toISOString()});
    localStorage.setItem("rsvp_preview", JSON.stringify(previews));
    setTimeout(() => {
      form.classList.add("hidden");
      initialButtons.classList.remove("hidden");
      nameInput.value = "";
      itemSelect.selectedIndex = 0;
      thanks.classList.add("hidden");
      alert("Confirmação enviada com sucesso!");
    }, 1200);
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar. Verifique sua conexão e as configurações do Firebase.");
  }
});
