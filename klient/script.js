document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const form = document.getElementById('noteForm');
    const todosContainer = document.getElementById('todosContainer');
    const todoForm = document.getElementById('todoForm');
    const fetchNotesBtn = document.getElementById('fetchNotesBtn');
    const fetchTodosBtn = document.getElementById('fetchTodosBtn');

    function hentOgVisNotater() {
        fetch('http://192.168.20.83:3000/notes')
            .then(res => res.json())
            .then(data => {
                notesContainer.innerHTML = '';
                data.forEach(note => {
                    const div = document.createElement('div');
                    div.className = 'note';
                    div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
                    notesContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Feil ved henting av notater:', error);
            });
    }

    function hentOgVisTodos() {
        fetch('http://192.168.20.83:3000/todos')
            .then(res => res.json())
            .then(data => {
                todosContainer.innerHTML = '';
                data.forEach(todo => {
                    const div = document.createElement('div');
                    div.className = 'note';
                    div.innerHTML = `<h3>${todo.title}</h3> <div class="checkbox"> <input type="checkbox"></input> <p>${todo.content || ''}</p> </div>`;
                    todosContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Feil ved henting av todos:', error);
            });
    }

    fetchNotesBtn.addEventListener('click', hentOgVisNotater);
    fetchTodosBtn.addEventListener('click', hentOgVisTodos);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        console.log("Sending post");
        fetch('http://192.168.20.83:3000/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(newNote => {
            console.log("POST successful")
            addNoteToDOM(newNote);
            form.reset();
        });
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('todoTitle').value;
        const content = document.getElementById('todoContent').value;

        fetch('http://192.168.20.83:3000/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(newTodo => {
            addTodoToDOM(newTodo);
            todoForm.reset();
        });
    });

    function addNoteToDOM(note) {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
        notesContainer.appendChild(div);
    }

    function addTodoToDOM(todo) {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `<h3>${todo.title}</h3><p>${todo.content || ''}</p>`;
        todosContainer.appendChild(div);
    }
});
