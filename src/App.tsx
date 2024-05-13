
import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { signInWithGoogle } from "./firebaseConfig";
import  HomeOrdersComponet  from "./components/HomeOrdersComponent/HomeOrdersComponent"
import OrderDetailsComponet from "./components/OrderDetailsComponet/OrderDetailsComponet"

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // State to track authentication status

  // Function to handle sign-in
  const handleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        setIsLoggedIn(true); // Update authentication status
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<HomeOrdersComponet />} />
          <Route path="/details" element={<OrderDetailsComponet />} />
        </Routes>
      ) : (
        <button className="login-with-google-btn" onClick={handleSignIn}>
          Sign In With Google
        </button>
      )}
    </div>
  );
};

export default App;
