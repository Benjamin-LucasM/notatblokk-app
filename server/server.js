const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

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
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  console.log(`IP: ${req.ip} - Posted:`, { title, content });
  db.run(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
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
  console.log(`IP: ${req.ip} - Posted:`, { title, content });
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

// Oppdaterer en eksisterende todo
app.put("/todos/:id", (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;
  console.log(`IP: ${req.ip} - Updated todo ${id}:`, { title, content });
  db.run(
    "UPDATE todos SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        id,
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
