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

                    // Lag checkbox-elementet
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';

                    // Legg til event listener for checkbox
                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) {
                            // Hvis ønskelig, gjør noe når den er sjekket
                            div.classList.add('completed'); // for eksempel
                        } else {
                            // Når den avkrysset
                            div.classList.remove('completed');
                        }
                    });

                    // Opprett innholdet med tittel og beskrivelse
                    div.innerHTML = `<h3>${todo.title}</h3> <div class="checkbox"></div>`;
                    // Sett inn checkbox i denne div-en
                    const checkboxContainer = div.querySelector('.checkbox');
                    checkboxContainer.appendChild(checkbox);

                    // Legg til teksten for beskrivelse
                    const p = document.createElement('p');
                    p.textContent = todo.content || '';
                    div.appendChild(p);

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
