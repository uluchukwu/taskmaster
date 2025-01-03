# TaskMaster

TaskMaster is a web-based task management application designed to help users organize, prioritize, and keep track of their tasks. It allows users to log in, manage tasks, filter by priority or deadlines, and perform CRUD operations on their task list.

---

## Features

- **User Authentication**: Signup, login, and logout functionality with secure JWT-based authentication.
- **Task Management**: Create, read, update, and delete tasks.
- **Prioritization**: Filter tasks based on priority levels (`low`, `medium`, `high`) or due dates.
- **Dynamic UI**: Responsive interface with toast notifications for feedback.
- **Secure Operations**: Uses HTTP-only cookies for secure authentication.

---

## Technologies Used

### Frontend
- HTML, CSS, JavaScript
- Toast notifications for user feedback

### Backend
- Node.js, Express.js
- MongoDB with Mongoose for database management

### Authentication
- JWT (JSON Web Tokens)
- Secure cookies for session management

---

## Installation

### Prerequisites
1. Node.js and npm installed on your system.
2. MongoDB installed and running locally or a MongoDB Atlas connection URI.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/taskmaster.git

3. Navigate to the project directory:
    ```bash
    cd taskmaster

2. Install dependencies:
    ```bash
    npm install

4. Create a .env file in the root directory and configure the environment variables:
    ```bash
    PORT=your_port
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=your_environment

5. Start the backend server:
    ```bash
    npm run dev

#### Usage

1. Running the Application
    
2. Open the index.html file in your browser to access the dashboard.

3. Use the following endpoints for authentication and tasks:

**Authentication:**
    
- POST /api/auth/signup - Sign up a new user
- POST /api/auth/login - Log in an existing user
- POST /api/auth/logout - Log out the current user

**Tasks:**
- GET /api/taskmanager/tasks - Get all tasks
- POST /api/taskmanager/tasks - Create a new task
- PUT /api/taskmanager/tasks/:id - Update a task
- DELETE /api/taskmanager/tasks/:id - Delete a task

**Task Operations:**
- Create a task using the Create New Task modal.
- Edit or delete tasks using the buttons provided in the task cards.
- Filter tasks by priority or deadlines using the dropdowns and date picker.


