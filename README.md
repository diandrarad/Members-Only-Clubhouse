# Members Only Clubhouse

This project is an exclusive clubhouse where members can write anonymous posts. Inside the clubhouse, members can see who the author of a post is, but outside they can only see the story and wonder who wrote it. This project uses Express.js, MongoDB, and Tailwind CSS.

## Features

- User sign-up and login with Passport.js
- Membership status management
- Ability for logged-in users to create anonymous posts
- Only members can see the author's name and post date
- Admin functionality to delete and edit posts

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- EJS (Embedded JavaScript templates)
- Tailwind CSS
- bcrypt for password hashing
- connect-flash for flash messages
- dotenv for environment variables

## Installation

1. **Clone the repository**:

   ```
   git clone https://github.com/yourusername/members-only.git
   cd members-only
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:

   ```env
   MONGO_URI=your_mongodb_connection_string
   SECRET=your_session_secret
   ```

4. **Build Tailwind CSS**:

   ```
   npm run build:css
   ```

5. **Populate the database with sample data** (optional):

   ```
   node populateDB.js
   ```

6. **Start the server**:

   ```
   npm start
   ```

7. **Visit the application**:
   Open your browser and go to `http://localhost:3000`.

## Usage

### Sign Up

1. Visit `/signup` to create a new user account.
2. Fill out the form and submit.

### Login

1. Visit `/login` to log in.
2. Fill out the form and submit.

### Join the Club

1. Visit `/join` and enter the secret passcode to become a member.

### Create a New Message

1. Once logged in, visit `/new-message` to create a new post.

### Admin Functionality

1. Admin users can see a delete button next to each post to remove unwanted messages.
2. To make a user an admin, update their `isAdmin` field in the database or visit `/admin` and enter the secret passcode to become an admin.

## Project Structure

- `app.js`: Main application file.
- `models/`: Contains Mongoose schemas for User and Message.
- `routes/`: Contains route definitions for the application.
- `views/`: Contains EJS templates for rendering the UI.
- `public/css/`: Contains Tailwind CSS files.
- `populateDB.js`: Script to populate the database with sample data.

## Acknowledgements

This project is part of The Odin Project curriculum. For more information, visit [The Odin Project](https://www.theodinproject.com/lessons/nodejs-members-only).
