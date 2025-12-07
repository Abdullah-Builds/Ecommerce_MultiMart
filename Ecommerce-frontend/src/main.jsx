// import React from "react"
// import ReactDOM from "react-dom/client"
// import "./index.css"
// import App from "./App.jsx"
// import { Provider } from "react-redux"
// import { store } from "./app/store.js"
// import reportWebVitals from "./reportWebVitals.js"
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { AuthProvider } from "./context/AuthContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   // <React.StrictMode>
//   //   <Provider store={store}>
//   //     <App />
//   //   </Provider>
//   // </React.StrictMode>
//    <ReduxProvider store={store}>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </ReduxProvider>
// )

// reportWebVitals()


import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import reportWebVitals from "./reportWebVitals.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);

reportWebVitals();
