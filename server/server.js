const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.db")

// Opprette tabellen for notater
db.run(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
`)

// Opprette tabellen for todo
db.run(`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
)
`)

// Opprette tabellen for tasks
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_id INTEGER,
    text TEXT,
    done INTEGER
)
`)

const app = express()

app.use(cors())
app.use(express.json())

// Henter alle notater fra databasen
app.get("/notes", (req, res) => {
    db.all("SELECT * FROM notes", [], (err, rows) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(rows)
    })
})

// Legger til et nytt notat i databasen
app.post("/notes", (req, res) => {
    const { title, content } = req.body
    db.run(
        "INSERT INTO notes (title, content) VALUES (?, ?)",
        [title, content],
        function (err) {
            if (err) {
                return res.status(500).json(err)
            }
            // Returnerer det nye notatet med ID
            res.json({
                id: this.lastID,
                title,
                content
            })
        }
    )
})

// Henter alle todos
app.get("/todos", (req, res) => {
    res.json(todos)
})

// Legger til en ny oppgave i lista
app.post("/todos", (req, res) => {
    todos.push(req.body)
    res.json({ message: "Oppgave lagret" })
})

// Serveren starter på port 3000 
app.listen(3000, () => {
    console.log("Server kjører på port 3000")
})