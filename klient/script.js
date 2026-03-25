document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const form = document.getElementById('noteForm');

    // Funksjon for å hente og vise notater
    function hentOgVisNotater() {
        fetch('http://localhost:3000/notes')
            .then(res => res.json())
            .then(data => {
                // Tøm containeren før vi legger til nye notater
                notesContainer.innerHTML = '';

                // Loop gjennom data og legg til i DOM
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

    // Ikke kall hentOgVisNotater() når siden lastes
    // bare lag knappen for å hente notater
    const fetchBtn = document.createElement('button');
    fetchBtn.textContent = 'Hent notater';
    document.body.insertBefore(fetchBtn, notesContainer);

    fetchBtn.addEventListener('click', () => {
        hentOgVisNotater();
    });

    // Når du sender inn skjemaet for å legge til et nytt notat
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        fetch('http://localhost:3000/notes', {
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

    function addNoteToDOM(note) {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
        notesContainer.appendChild(div);
    }
});