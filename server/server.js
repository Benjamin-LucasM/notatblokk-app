const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

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
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      // Returnerer det nye notatet med ID
      res.json({
        id: this.lastID,
        title,
        content,
      });
    },
  );
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

// viser hvilken port serveren kjører på
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
