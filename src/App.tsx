import "./App.css";
import React, { useState, useEffect } from "react";
// import { Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle } from "./firebaseConfig";
import HomeOrdersComponent from "./components/HomeOrdersComponent/HomeOrdersComponent";

const App: React.FC = () => {
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<
    "loading" | "logged" | "notlogged"
  >("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn("logged");
      } else {
        setIsLoggedIn("notlogged");
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div className="App">
      {isLoggedIn === "loading" ? (
        <p>Loading...</p>
      ) : isLoggedIn === "logged" ? (
        <HomeOrdersComponent />
      ) : (
        <button
          className="login-with-google-btn"
          onClick={handleSignIn}
        >
          Sign In With Google
        </button>
      )}
    </div>
  );
};

export default App;
