// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 設定（用你的專案資訊）
const firebaseConfig = {
  apiKey: "AIzaSyCFObBS7xpcJsp4rQsqvLLvD1SJ-6y4o4k",
  authDomain: "travel-flight-5ba69.firebaseapp.com",
  projectId: "travel-flight-5ba69",
  storageBucket: "travel-flight-5ba69.appspot.com",
  messagingSenderId: "225700601197",
  appId: "1:225700601197:web:889e51055a57eb1477ce64",
  measurementId: "G-LFWZ863Y1F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UI 元件
const homePage = document.getElementById('homePage');
const addFlightPage = document.getElementById('addFlightPage');

document.getElementById('addFlightBtn').addEventListener('click', () => {
  homePage.style.display = 'none';
  addFlightPage.style.display = 'block';
});

document.getElementById('flightForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const flightData = {
    flightNumber: document.getElementById('flightNumber').value,
    departure: document.getElementById('departure').value,
    destination: document.getElementById('destination').value,
    airline: document.getElementById('airline').value,
    tripType: document.getElementById('tripType').value
  };

  await addDoc(collection(db, "flights"), flightData);

  alert('航班資料已送出！');
  this.reset();

  homePage.style.display = 'block';
  addFlightPage.style.display = 'none';
  loadFlights();
});

async function loadFlights() {
  const outboundList = document.getElementById('outboundList');
  const returnList = document.getElementById('returnList');
  outboundList.innerHTML = '';
  returnList.innerHTML = '';

  const querySnapshot = await getDocs(collection(db, "flights"));
  querySnapshot.forEach((docSnap) => {
    const flight = docSnap.data();
    const listItem = document.createElement('li');
    listItem.textContent = `航班：${flight.flightNumber}，起飛：${flight.departure}，目的地：${flight.destination}，航空公司：${flight.airline}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', async () => {
      await deleteDoc(doc(db, "flights", docSnap.id));
      loadFlights();
    });

    listItem.appendChild(deleteBtn);

    if (flight.tripType === '去程') {
      outboundList.appendChild(listItem);
    } else if (flight.tripType === '回程') {
      returnList.appendChild(listItem);
    }
  });
}

loadFlights();
