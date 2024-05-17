import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle } from "./firebaseConfig";
import HomeOrdersComponent from "./components/HomeOrdersComponent/HomeOrdersComponent";
import OrderDetailsComponent from "./components/OrderDetailsComponet/OrderDetailsComponet";

const App: React.FC = () => {
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<
    "loading" | "logged" | "loggedout"
  >("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn("logged");
      } else {
        setIsLoggedIn("loggedout");
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
        <Routes>
          <Route path="/" element={<HomeOrdersComponent />} />
          <Route
            path={"/details/:orderId"}
            element={<OrderDetailsComponent />}
          />
        </Routes>
      ) : (
        <button
          className="login-with-google-btn"
          onClick={() => signInWithGoogle()}
        >
          Sign In With Google
        </button>
      )}
    </div>
  );
};

export default App;
