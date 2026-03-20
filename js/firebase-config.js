import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDlGagOQXCVGB-Z7TYR859YFBO2juaO_N4",
  authDomain:        "anafotos-f945f.firebaseapp.com",
  projectId:         "anafotos-f945f",
  messagingSenderId: "879604780673",
  appId:             "1:879604780673:web:abd355e474b448ff884780"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
