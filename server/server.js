const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database("./database.db");
const addDescriptionBtn = document.getElementById('addDescriptionBtn');
const descriptionInput = document.getElementById('todoContent');
const descriptionList = document.getElementById('descriptionList');
const todoTitleInput = document.getElementById('todoTitle');

let descriptions = [];

// Opprette tabellen for notater
db.run(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
`);

// Opprette tabellen for todos
db.run(`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
`);

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "klient")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "klient", "index.html"));
});

// Henter alle notater fra databasen
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// Legger til et nytt notat i databasen
addDescriptionBtn.addEventListener('click', () => {
  const descText = descriptionInput.value.trim();
  if (descText === '') return;

  // Opprett en ny linje med checkbox og beskrivelse
  const div = document.createElement('div');
  div.className = 'description-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const span = document.createElement('span');
  span.textContent = descText;

  div.appendChild(checkbox);
  div.appendChild(span);
  descriptionList.appendChild(div);

  // Legg til i listen av beskrivelser
  descriptions.push({ text: descText, completed: false, element: div, checkbox: checkbox });

  // Nullstill input-feltet
  descriptionInput.value = '';
});

document.querySelector('#todoForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = todoTitleInput.value.trim();
  if (!title) return;

  // Lagre todo med tittel og beskrivelse-liste
  const todo = {
    title: title,
    descriptions: descriptions.map(d => ({ text: d.text, completed: d.checkbox.checked }))
  };

  // Send til server eller lagre lokalt
  console.log('Lagre todo:', todo);

  // Nullstill form
  todoTitleInput.value = '';
  descriptionInput.value = '';
  descriptionList.innerHTML = '';
  descriptions = [];
});

// Henter alle todos fra databasen
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// Legger til en ny todo i databasen
app.post("/todos", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO todos (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      // Returnerer den nye todoen med ID
      res.json({
        id: this.lastID,
        title,
        content,
      });
    },
  );
});

const PORT = process.env.PORT || 6767;

// viser hvilken port serveren kjører på
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on ${PORT}`);
});
