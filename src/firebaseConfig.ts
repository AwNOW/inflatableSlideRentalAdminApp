import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCBlXacWvQEO7RYsxacauUk_BuVcmKq4Jw",
  authDomain: "gilus-rent.firebaseapp.com",
  databaseURL:
    "https://gilus-rent-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gilus-rent",
  storageBucket: "gilus-rent.appspot.com",
  messagingSenderId: "210211478251",
  appId: "1:210211478251:web:bc73d961be62d85852fcae",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      name
        ? localStorage.setItem("name", name)
        : localStorage.setItem("name", "");
      email
        ? localStorage.setItem("email", email)
        : localStorage.setItem("email", "");
    })
    .catch((error) => {
      console.log(error);
    });
};
