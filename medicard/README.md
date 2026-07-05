# Medicard Full-Stack Application

The Medicard system is a fully structured and professional medical portal.
It utilizes a **React + Vite** frontend and a **Java Spring Boot** backend.

## Project Structure
- `src/` - React frontend code (Tailwind, Vite, Axios setup)
- `medicard-backend/` - Spring Boot server (Java 21, JPA, MySQL, WebSockets)
- `tools/` - Required dependencies (JDK 21, Maven)
- `legacy_backends/` - Previously deprecated NodeJS mock endpoints

## How to Run the App

1. **Start the Frontend**
   Run the following in your terminal to start the React UI on `http://localhost:5173`:
   ```bash
   npm install
   npm run dev
   ```

2. **Start the Backend**
   Instead of running the old Node.js backend, you must launch the Spring Boot server. To guarantee it runs correctly with the right JDK version without manual setup, simply double-click the `start-backend.bat` script provided in this repository root. The backend runs on `http://localhost:8080`.

**Note:** The application uses Vite's secure API proxy routing, meaning frontend calls automatically route through the Spring Boot backend correctly.
