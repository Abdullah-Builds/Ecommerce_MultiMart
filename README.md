# Ecommerce MultiMart

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![React Version](https://img.shields.io/badge/react-latest-blue)
![MySQL](https://img.shields.io/badge/MySQL-Relational%20DB-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)

Ecommerce MultiMart is a full-stack marketplace built with a React frontend and a Node.js + MySQL backend. It includes modular components for product listings, authentication, carts, and order management. Both the frontend and backend operate as separate apps within the repository.

---

## Techniques Used

- **Client-side rendering with React** using functional components and hooks.  
  https://react.dev/reference/react

- **REST API architecture** using Express routing and middleware.  
  https://expressjs.com/en/guide/routing.html

- **React state lifecycle** with hooks like `useState` and `useEffect`.  
  MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

- **Async operations** built with `async` / `await`.  
  https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

- **MySQL relational modeling** for users, products, and orders.  
  https://dev.mysql.com/doc/

- **CORS configuration** for secure browser–server communication.  
  https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

- **Middleware pattern** for authentication, validation, and request processing.

- **Environment-based configuration** using `.env` variables.

---

## Libraries and Tools of Interest

- **React** (UI components)  
  https://react.dev/

- **Node.js + Express** (backend HTTP service)  
  https://expressjs.com/

- **MySQL2** (Node SQL driver)  
  https://github.com/sidorares/node-mysql2

- **Axios** (HTTP client)  
  https://axios-http.com/

- **jsonwebtoken** (JWT authentication)  
  https://github.com/auth0/node-jsonwebtoken

- **bcryptjs** (password hashing)  
  https://github.com/dcodeIO/bcrypt.js

- **dotenv** (environment loader)  
  https://github.com/motdotla/dotenv

- **Tailwind CSS** (if used in the frontend)  
  https://tailwindcss.com/

- **Google Fonts** (if used)  
  https://fonts.google.com/

---

## Project Structure

```txt
Ecommerce_MultiMart/
│
├── Ecommerce-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
│
├── Ecommerce-backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── package.json
│   └── .env.example
│
└── README.md
