// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRZOiqbQ3kQKiZKR1KXPSLp-iTdAmye5I",
  authDomain: "lost-and-found-9340e.firebaseapp.com",
  projectId: "lost-and-found-9340e",
  storageBucket: "lost-and-found-9340e.firebasestorage.app",
  messagingSenderId: "807891961072",
  appId: "1:807891961072:web:d3b0b122e64db10b2b6e35",
  measurementId: "G-H0V52XWPS8"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML Elements
const itemForm = document.getElementById("itemForm");
const lostList = document.getElementById("lostList");
const foundList = document.getElementById("foundList");
const searchInput = document.getElementById("searchInput");

let items = [];

// Display Items
function displayItems() {

  lostList.innerHTML = "";
  foundList.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.location.toLowerCase().includes(search)
  );

  filteredItems.forEach(item => {

    const card = document.createElement("div");
    card.className = "item-card";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const type = document.createElement("p");
    type.textContent = "Type: " + item.type;

    const location = document.createElement("p");
    location.textContent = "Location: " + item.location;

    const contact = document.createElement("p");
    contact.textContent = "Contact: " + item.contact;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Item";

    deleteButton.onclick = async () => {

      if (!confirm("Delete this item?")) return;

      try {
        await deleteDoc(doc(db, "items", item.id));
      } catch (error) {
        alert("Delete failed!");
        console.error(error);
      }
    };

    card.append(title, type, location, contact, deleteButton);

    if (item.type === "Lost") {
      lostList.appendChild(card);
    } else {
      foundList.appendChild(card);
    }

  });

  if (lostList.children.length === 0) {
    lostList.innerHTML = "<p>No lost items found.</p>";
  }

  if (foundList.children.length === 0) {
    foundList.innerHTML = "<p>No found items available.</p>";
  }
}

// Real-time Database Updates
onSnapshot(collection(db, "items"), snapshot => {

  items = snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }));

  displayItems();

}, error => {
  console.error(error);
  alert("Database loading failed!");
});

// Submit Item
itemForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  const newItem = {

    name: document.getElementById("itemName").value.trim(),

    type: document.getElementById("itemType").value,

    location: document.getElementById("location").value.trim(),

    contact: document.getElementById("contact").value.trim(),

    createdAt: serverTimestamp()

  };

  try {

    await addDoc(collection(db, "items"), newItem);

    itemForm.reset();

    alert("Item reported successfully!");

  } catch (error) {

    console.error(error);

    alert("Error submitting item!");

  }

});

// Search Items
searchInput.addEventListener("input", displayItems);