document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const form = document.getElementById('noteForm');
    const todosContainer = document.getElementById('todosContainer');
    const todoForm = document.getElementById('todoForm');
    const fetchNotesBtn = document.getElementById('fetchNotesBtn');
    const fetchTodosBtn = document.getElementById('fetchTodosBtn');
    const addDescriptionBtn = document.getElementById('addDescriptionBtn');
    const descriptionInput = document.getElementById('todoContent');
    const descriptionList = document.getElementById('descriptionList');
    const todoTitleInput = document.getElementById('todoTitle');

    let descriptions = [];

    // Hent og vis notater
    function hentOgVisNotater() {
        fetch('http://192.168.20.83:6767/notes')
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

    // Hent og vis todos
    function hentOgVisTodos() {
        fetch('http://192.168.20.83:6767/todos')
            .then(res => res.json())
            .then(data => {
                todosContainer.innerHTML = '';
                data.forEach(todo => {
                    const div = document.createElement('div');
                    div.className = 'note';
                    div.innerHTML = `<h3>${todo.title}</h3> <div class="checkbox"> <input type="checkbox" ${todo.completed ? 'checked' : ''}> <p>${todo.content || ''}</p> </div>`;
                    todosContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Feil ved henting av todos:', error);
            });
    }

    fetchNotesBtn.addEventListener('click', hentOgVisNotater);
    fetchTodosBtn.addEventListener('click', hentOgVisTodos);

    // Legg til notat
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        fetch('http://192.168.20.83:6767/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(newNote => {
            addNoteToDOM(newNote);
            form.reset();
        });
    });

    // Lagre todo med beskrivelser
    document.querySelector('#todoForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = todoTitleInput.value.trim();
        if (!title) return;

        const todo = {
            title: title,
            descriptions: descriptions.map(d => ({ text: d.text, completed: d.checkbox.checked }))
        };

        fetch('http://192.168.20.83:6767/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        })
        .then(res => res.json())
        .then(newTodo => {
            addTodoToDOM(newTodo);
            // Nullstill form og beskrivelser
            document.getElementById('todoForm').reset();
            descriptions = [];
            descriptionList.innerHTML = '';
        });
    });

    // Legg til beskrivelse
    addDescriptionBtn.addEventListener('click', () => {
        const descText = descriptionInput.value.trim();
        if (descText === '') return;

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

    // Funksjoner for å legge til elementer i DOM
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