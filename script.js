// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 YOUR Firebase config (from screenshot)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDttFri6fQvt6X7X0N9YwSZ36Z-XF7UueQ",
    authDomain: "myfirstproject-55473.firebaseapp.com",
    projectId: "myfirstproject-55473",
    storageBucket: "myfirstproject-55473.firebasestorage.app",
    messagingSenderId: "654375158908",
    appId: "1:654375158908:web:ea967a3f75aa7ef3b235f9",
    measurementId: "G-01N3QBB50Z"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML elements
const form = document.getElementById("songForm");
const playlist = document.getElementById("playlist");
const clearBtn = document.getElementById("clearBtn");

// Firestore collection
const songsRef = collection(db, "songs");

// Render songs
function renderSongs(songs) {
  if (!songs.length) {
    playlist.innerHTML = `<div class="empty">No songs yet</div>`;
    return;
  }

  playlist.innerHTML = songs.map((song, index) => `
    <div class="song">
      <div class="song-rank">#${index + 1}</div>
      <div>${song.name}</div>
      <div>${song.artist}</div>
      <div>${song.score}/10</div>
      <button class="delete-btn" data-id="${song.id}">Remove</button>
    </div>
  `).join("");
}

// 🔴 REAL-TIME LISTENER (this is the magic)
const q = query(songsRef, orderBy("score", "desc"), orderBy("time", "desc"));

onSnapshot(q, (snapshot) => {
  const songs = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
  renderSongs(songs);
});

// Add song
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("songName").value;
  const artist = document.getElementById("artistName").value;
  const score = parseInt(document.getElementById("rankScore").value);

  await addDoc(songsRef, {
    name,
    artist,
    score,
    time: Date.now()
  });

  form.reset();
});

// Delete song
playlist.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  await deleteDoc(doc(db, "songs", btn.dataset.id));
});

// Clear all songs
clearBtn.addEventListener("click", async () => {
  const snapshot = await getDocs(songsRef);
  snapshot.forEach(async (d) => {
    await deleteDoc(doc(db, "songs", d.id));
  });
});