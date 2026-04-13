document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notesContainer");
  const form = document.getElementById("noteForm");
  const todosContainer = document.getElementById("todosContainer");
  const todoForm = document.getElementById("todoForm");
  const fetchNotesBtn = document.getElementById("fetchNotesBtn");
  const fetchTodosBtn = document.getElementById("fetchTodosBtn");

  function hentOgVisNotater() { //henter notatene og viser sender de til html
    fetch("http://192.168.20.83:6767/notes")
      .then((res) => res.json())
      .then((data) => {
        notesContainer.innerHTML = "";
        data.forEach((note) => {
          const div = document.createElement("div");
          div.className = "note";
          div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
          notesContainer.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Feil ved henting av notater:", error);
      });
  }

  function hentOgVisTodos() { //henter todos fra databasen og sender til html
    fetch("http://192.168.20.83:6767/todos")
      .then((res) => res.json())
      .then((data) => {
        todosContainer.innerHTML = "";
        data.forEach((todo) => {
          const div = document.createElement("div");
          div.className = "todo-box";

          const lines = todo.content
            ? todo.content.split("\n").filter((line) => line.trim())
            : [];

          let itemsHTML = lines
            .map(
              (line) =>
                `<div class="todo-item"><input type="checkbox"></input> <p>${line}</p> <button class="delete-item-btn">×</button></div>`
            )
            .join("");

          div.innerHTML = `
                        <div class="todo-header">
                            <h3>${todo.title}</h3>
                        </div>
                        <div class="todo-items" data-todo-id="${todo.id}">
                            ${itemsHTML}
                        </div>
                        <button class="add-line-btn" data-todo-id="${todo.id}">+ Legg til linje</button>
                    `;
          todosContainer.appendChild(div);
          attachTodoEventListeners(div, todo.id);
        });
      })
      .catch((error) => {
        console.error("Feil ved henting av todos:", error);
      });
  }

  fetchNotesBtn.addEventListener("click", hentOgVisNotater);
  fetchTodosBtn.addEventListener("click", hentOgVisTodos);

  form.addEventListener("submit", (e) => { //knappen til henting av notater
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    fetch("http://192.168.20.83:6767/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        addNoteToDOM(newNote);
        form.reset();
      });
  });

  todoForm.addEventListener("submit", (e) => { //knappen til henting av todos
    e.preventDefault();
    const title = document.getElementById("todoTitle").value;
    const content = document.getElementById("todoContent").value;

    fetch("http://192.168.20.83:6767/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        addTodoToDOM(newTodo);
        todoForm.reset();
      });
  });

  function addNoteToDOM(note) {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
    notesContainer.appendChild(div);
  }

  function attachTodoEventListeners(container, todoId) {
    const addLineBtn = container.querySelector(".add-line-btn");
    const todosItemsDiv = container.querySelector(".todo-items");

    const saveTodoLines = () => {
      const lines = [];
      todosItemsDiv.querySelectorAll(".todo-item").forEach((item) => {
        const pTag = item.querySelector("p");
        if (pTag) {
          lines.push(pTag.textContent);
        }
      });

      const title = container.querySelector(".todo-header h3").textContent;
      const content = lines.join("\n");

      fetch(`http://192.168.20.83:6767/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }).catch((error) => {
        console.error("Feil ved lagring av todo-linjer:", error);
      });
    };

    addLineBtn.addEventListener("click", () => {
      const newItem = document.createElement("div");
      newItem.className = "todo-item";
      newItem.innerHTML = `<input type="checkbox"></input> <input type="text" class="todo-line-input" placeholder="Ny linje..."></input> <button class="delete-item-btn">×</button>`;
      todosItemsDiv.appendChild(newItem);

      const inputField = newItem.querySelector(".todo-line-input");

      inputField.focus();

      const saveLine = () => {
        const text = inputField.value.trim();
        if (text) {
          // bytter til <p>
          const p = document.createElement("p");
          p.textContent = text;
          inputField.replaceWith(p);
          saveTodoLines();
        } else {
          // Hvis tomt fjernes alt
          newItem.remove();
          saveTodoLines();
        }
      };

      // Lagre når Enter trykkes
      inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          saveLine();
        }
      });

      // Lagre når man klikker bort
      inputField.addEventListener("blur", saveLine);

      // slett
      newItem.querySelector(".delete-item-btn").addEventListener("click", () => {
        newItem.remove();
        saveTodoLines();
      });
    });

    // slett knapp
    container.querySelectorAll(".delete-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.target.closest(".todo-item").remove();
        saveTodoLines();
      });
    });
  }

  function addTodoToDOM(todo) {
    const div = document.createElement("div");
    div.className = "todo-box";

    const lines = todo.content
      ? todo.content.split("\n").filter((line) => line.trim())
      : [];

    let itemsHTML = lines
      .map(
        (line) =>
          `<div class="todo-item"><input type="checkbox"></input> <p>${line}</p> <button class="delete-item-btn">×</button></div>`
      )
      .join("");

    div.innerHTML = `
            <div class="todo-header">
                <h3>${todo.title}</h3>
            </div>
            <div class="todo-items" data-todo-id="${todo.id}">
                ${itemsHTML}
            </div>
            <button class="add-line-btn" data-todo-id="${todo.id}">+ Legg til linje</button>
        `;
    todosContainer.insertBefore(div, todosContainer.firstChild);
    attachTodoEventListeners(div, todo.id);
  }
});
