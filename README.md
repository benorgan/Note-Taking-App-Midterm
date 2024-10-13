# Note-Taking App Midterm

This is a Note-Taking App created for a midterm project. The app allows users to register, log in, create, view, and delete notes. It uses MongoDB for data storage, Express.js for the backend, and a simple frontend with HTML, CSS, and JavaScript. 


## Features
- User registration
- User login with session management
- Create, view, and delete notes
- Secure password storage using `crypto.pbkdf2`

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Passport.js**
- **Crypto module**
- **connect-mongo**
- **HTML, CSS, JavaScript**

## Installation

Clone the repository:

```bash
git clone https://github.com/kylehadam/Note-Taking-App-Midterm.git
cd Note-Taking-App-Midterm
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory of the project and add the following:

```env
MONGO_URI=mongodb://localhost:27017/note-taking-app
PORT=3000
SESSION_SECRET=your_random_secret_key
```

Start the server:

```bash
npm start
```

## How to Use the App

### Register a New User
1. Open your browser and navigate to `http://127.0.0.1:3000`.
2. Fill in the Username and Password fields in the registration form and click on the **Register** button.
3. A message will appear confirming your registration. You can now log in.

### Log In with an Existing User
1. After registering, you will be redirected to the login form.
2. Enter your Username and Password and click on the **Login** button.
3. Upon successful login, you will be redirected to the note-taking interface.

### Create a New Note
1. Once logged in, you will see the note-taking interface.
2. Fill in the Title and Content fields and click on the **Add Note** button.
3. Your new note will appear in the list of notes.

### View Notes
1. All notes created by the logged-in user will be displayed in the note list.
2. You can view the title and content of each note.

### Delete a Note
1. Each note in the list will have a **Delete** button.
2. Click the **Delete** button to remove the note from the list and the database.

### Log Out
1. Click the **Logout** button to log out of the application.
2. You will be redirected to the login page.

## API Endpoints

### Authentication

#### Register User
- **Endpoint:** `POST /auth/register`
- **Request Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response:**
    ```json
    {
        "msg": "You are now registered and can log in"
    }
    ```

#### Login User
- **Endpoint:** `POST /auth/login`
- **Request Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
- **Response:**
    ```json
    {
        "msg": "You are logged in",
        "user": {
            "id": "user_id",
            "username": "your_username"
        }
    }
    ```

#### Logout User
- **Endpoint:** `GET /auth/logout`
- **Response:**
    ```json
    {
        "msg": "You are logged out"
    }
    ```

### Notes

#### Get All Notes
- **Endpoint:** `GET /api/notes`
- **Response:**
    ```json
    [
        {
            "_id": "note_id",
            "title": "Note title",
            "content": "Note content",
            "tags": ["tag1", "tag2"],
            "priority": "Low"
        }
    ]
    ```

#### Create Note
- **Endpoint:** `POST /api/notes`
- **Request Body:**
    ```json
    {
        "title": "Note title",
        "content": "Note content",
        "tags": ["tag1", "tag2"],
        "priority": "Low"
    }
    ```
- **Response:**
    ```json
    {
        "_id": "note_id",
        "title": "Note title",
        "content": "Note content",
        "tags": ["tag1", "tag2"],
        "priority": "Low",
        "user": "user_id",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
    ```

#### Delete Note
- **Endpoint:** `DELETE /api/notes/:id`
- **Response:**
    ```json
    {
        "msg": "Note removed"
    }
    ```

## Usage

1. **Register a new user** using the registration form.
2. **Log in** with the registered user credentials.
3. **Create new notes** after logging in.
4. **View all notes** associated with the logged-in user.
5. **Delete notes** as needed.

## Testing

### Setup

Install the testing dependencies:

```bash
npm install mocha chai chai-as-promised sinon mongoose --save-dev
```

Create the following files in your test directory:

- `setup.js`
- `register.test.js`
- `login.test.js`
- `addNote.test.js`
- `retrieveNotes.test.js`

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

### Test Descriptions

- **User Registration Test**
  - **File:** `test/register.test.js`
  - **Description:** Tests the user registration functionality by creating a new user and verifying the saved user details.

- **User Login Test**
  - **File:** `test/login.test.js`
  - **Description:** Tests the user login functionality by logging in with an existing user and verifying the logged-in user details.

- **Add Note Test**
  - **File:** `test/addNote.test.js`
  - **Description:** Tests the note creation functionality by adding a note for an existing user and verifying the saved note details.

- **Retrieve Notes Test**
  - **File:** `test/retrieveNotes.test.js`
  - **Description:** Tests the note retrieval functionality by fetching notes for an existing user and verifying the retrieved notes.

## Additional Information

The app uses `passport-local` for local authentication and `crypto.pbkdf2` for secure password hashing. Sessions are managed using `express-session` and stored in MongoDB using `connect-mongo`.

## License

This project is licensed under the MIT License.
