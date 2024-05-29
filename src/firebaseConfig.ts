import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// export const firebaseConfig = {
//   apiKey: "AIzaSyCFXRYqJQQ2t6nG9nsxjrSVw8SW6URGC2c",
//   authDomain: "gilus-rent-prod.firebaseapp.com",
//   projectId: "gilus-rent-prod",
//   storageBucket: "gilus-rent-prod.appspot.com",
//   messagingSenderId: "77866513584",
//   appId: "1:77866513584:web:b547c495aa10d2e7513775"
// };


// export const firebaseConfigDev = {
//   apiKey: "AIzaSyCBlXacWvQEO7RYsxacauUk_BuVcmKq4Jw",
//   authDomain: "gilus-rent.firebaseapp.com",
//   databaseURL:
//     "https://gilus-rent-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "gilus-rent",
//   storageBucket: "gilus-rent.appspot.com",
//   messagingSenderId: "210211478251",
//   appId: "1:210211478251:web:bc73d961be62d85852fcae",
// };


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
