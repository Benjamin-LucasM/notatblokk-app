document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notesContainer");
  const form = document.getElementById("noteForm");
  const todosContainer = document.getElementById("todosContainer");
  const todoForm = document.getElementById("todoForm");
  const fetchNotesBtn = document.getElementById("fetchNotesBtn");
  const fetchTodosBtn = document.getElementById("fetchTodosBtn");

  function hentOgVisNotater() {
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

  function hentOgVisTodos() {
    fetch("http://192.168.20.83:6767/todos")
      .then((res) => res.json())
      .then((data) => {
        todosContainer.innerHTML = "";
        data.forEach((todo) => {
          const div = document.createElement("div");
          div.className = "todo-box";
          div.innerHTML = `
                        <div class="todo-header">
                            <h3>${todo.title}</h3>
                        </div>
                        <div class="todo-items" data-todo-id="${todo.id}">
                            ${todo.content ? `<div class="todo-item"><input type="checkbox"></input> <p>${todo.content}</p> <button class="delete-item-btn">×</button></div>` : ""}
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

  form.addEventListener("submit", (e) => {
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

  todoForm.addEventListener("submit", (e) => {
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

    addLineBtn.addEventListener("click", () => {
      const newItem = document.createElement("div");
      newItem.className = "todo-item";
      newItem.innerHTML = `<input type="checkbox"></input> <input type="text" class="todo-line-input" placeholder="Ny linje..."></input> <button class="delete-item-btn">×</button>`;
      todosItemsDiv.appendChild(newItem);

      // Focus på input-feltet
      newItem.querySelector(".todo-line-input").focus();

      // Legg til delete-funksjonalitet
      newItem
        .querySelector(".delete-item-btn")
        .addEventListener("click", () => {
          newItem.remove();
        });
    });

    // Legg til delete-funksjonalitet for eksisterende items
    container.querySelectorAll(".delete-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.target.closest(".todo-item").remove();
      });
    });
  }

  function addTodoToDOM(todo) {
    const div = document.createElement("div");
    div.className = "todo-box";
    div.innerHTML = `
            <div class="todo-header">
                <h3>${todo.title}</h3>
            </div>
            <div class="todo-items" data-todo-id="${todo.id}">
                ${todo.content ? `<div class="todo-item"><input type="checkbox"></input> <p>${todo.content}</p> <button class="delete-item-btn">×</button></div>` : ""}
            </div>
            <button class="add-line-btn" data-todo-id="${todo.id}">+ Legg til linje</button>
        `;
    todosContainer.insertBefore(div, todosContainer.firstChild);
    attachTodoEventListeners(div, todo.id);
  }
});
