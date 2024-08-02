document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const editNoteForm = document.getElementById('edit-note-form');
  const noteList = document.getElementById('note-list');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const noteApp = document.getElementById('note-app');
  const userSection = document.getElementById('user-section');
  const errorDisplay = document.createElement('div'); // Element to display errors
  const homeSection = document.getElementById('home-section');
  const addNoteSection = document.getElementById('add-note-section');
  const editNoteSection = document.getElementById('edit-note-section');
  const myNotesSection = document.getElementById('my-notes-section');
  const homeLink = document.getElementById('home-link');
  const addNoteLink = document.getElementById('add-note-link');
  const myNotesLink = document.getElementById('my-notes-link');

  errorDisplay.style.color = 'red';
  userSection.appendChild(errorDisplay);

  function sanitizeInput(input) {
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  }

  function showSection(section) {
    homeSection.style.display = 'none';
    addNoteSection.style.display = 'none';
    editNoteSection.style.display = 'none';
    myNotesSection.style.display = 'none';
    section.style.display = 'block';
  }

  homeLink.addEventListener('click', () => showSection(homeSection));
  addNoteLink.addEventListener('click', () => showSection(addNoteSection));
  myNotesLink.addEventListener('click', () => {
    showSection(myNotesSection);
    fetchNotes();
  });

  async function fetchNotes() {
    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to fetch notes: ${errorMsg}`);
      }
      const notes = await response.json();
      noteList.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
          <h2>${note.title}</h2>
          <p>${note.content}</p>
          <div class="meta">
            <span>Created: ${new Date(note.createdAt).toLocaleString()}</span>
            <span>Modified: ${new Date(note.updatedAt).toLocaleString()}</span>
          </div>
          <div class="meta">
            <span>Tags: ${note.tags.join(', ')}</span>
            <span>Priority: ${note.priority}</span>
          </div>
          <div class="actions">
            <button onclick="editNote('${note._id}')">Edit</button>
            <button onclick="deleteNote('${note._id}')">Delete</button>
            <button onclick="copyAndEdit('${note._id}')">Copy and Edit</button>
          </div>
        `;
        noteList.appendChild(noteElement);
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      errorDisplay.textContent = 'Error fetching notes: ' + error.message;
    }
  }

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = sanitizeInput(document.getElementById('title').value);
    const content = sanitizeInput(document.getElementById('content').value);
    const tags = sanitizeInput(document.getElementById('tags').value).split(',').map(tag => tag.trim());
    const priority = sanitizeInput(document.getElementById('priority').value);

    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, tags, priority }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to create note: ${errorMsg}`);
      }
      fetchNotes(); // Fetch notes after adding a new one
      showSection(myNotesSection); // Redirect to My Notes section
      noteForm.reset();
    } catch (error) {
      console.error('Error creating note:', error);
      errorDisplay.textContent = 'Error creating note: ' + error.message;
    }
  });

  editNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = sanitizeInput(document.getElementById('edit-title').value);
    const content = sanitizeInput(document.getElementById('edit-content').value);
    const tags = sanitizeInput(document.getElementById('edit-tags').value).split(',').map(tag => tag.trim());
    const priority = sanitizeInput(document.getElementById('edit-priority').value);
    const noteId = editNoteForm.dataset.noteId;

    try {
      const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, tags, priority }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to update note: ${errorMsg}`);
      }
      fetchNotes(); // Fetch notes after updating
      showSection(myNotesSection); // Redirect to My Notes section
      editNoteForm.reset();
      delete editNoteForm.dataset.noteId; // Clear the noteId to reset form state
    } catch (error) {
      console.error('Error updating note:', error);
      errorDisplay.textContent = 'Error updating note: ' + error.message;
    }
  });

  window.deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to delete note: ${errorMsg}`);
      }
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      errorDisplay.textContent = 'Error deleting note: ' + error.message;
    }
  };

  window.editNote = async (id) => {
    const note = await fetchNoteById(id);
    if (note) {
      showSection(editNoteSection);
      document.getElementById('edit-title').value = note.title;
      document.getElementById('edit-content').value = note.content;
      document.getElementById('edit-tags').value = note.tags.join(', ');
      document.getElementById('edit-priority').value = note.priority;
      editNoteForm.dataset.noteId = id; // Store note ID for update
    }
  };

  window.copyAndEdit = async (id) => {
    const note = await fetchNoteById(id);
    if (note) {
      showSection(addNoteSection);
      document.getElementById('title').value = note.title;
      document.getElementById('content').value = note.content;
      document.getElementById('tags').value = note.tags.join(', ');
      document.getElementById('priority').value = note.priority;
      delete noteForm.dataset.noteId; // Ensure new note is created
    }
  };

  async function fetchNoteById(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to fetch note: ${errorMsg}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching note:', error);
      errorDisplay.textContent = 'Error fetching note: ' + error.message;
      return null;
    }
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('register-username').value);
    const password = sanitizeInput(document.getElementById('register-password').value);

    if (username === "" || password === "") {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg.msg || 'Failed to register');
      }
      alert('Registration successful. Please login.');
    } catch (error) {
      console.error('Error registering user:', error);
      errorDisplay.textContent = 'Error registering user: ' + error.message;
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = sanitizeInput(document.getElementById('login-username').value);
    const password = sanitizeInput(document.getElementById('login-password').value);
  
    if (username === "" || password === "") {
      errorDisplay.textContent = 'Username and password cannot be empty';
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg.msg || 'Failed to login');
      }
      userSection.style.display = 'none';
      noteApp.style.display = 'flex';
      showSection(homeSection); // Show home section on login
    } catch (error) {
      console.error('Error logging in:', error);
      errorDisplay.textContent = 'Error logging in: ' + error.message;
    }
  });
  
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        credentials: 'include' // Ensure cookies are included in requests
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to logout: ${errorMsg}`);
      }
      userSection.style.display = 'block';
      noteApp.style.display = 'none';
    } catch (error) {
      console.error('Error logging out:', error);
      errorDisplay.textContent = 'Error logging out: ' + error.message;
    }
  });

  // Only fetch notes if the user is logged in
  if (document.cookie.includes('connect.sid')) {
    userSection.style.display = 'none';
    noteApp.style.display = 'flex';
    showSection(homeSection); // Show home section on initial load if logged in
  }
});
