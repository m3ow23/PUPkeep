import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyCqZAvRslBmLDZfmNPptcmfjSVqLoml2kw",
    authDomain: "pupkeep-7753c.firebaseapp.com",
    projectId: "pupkeep-7753c",
    storageBucket: "pupkeep-7753c.appspot.com",
    messagingSenderId: "629389224588",
    appId: "1:629389224588:web:8eedc3169313292f06e9a9",
    measurementId: "G-DPYLH962F0"
};

initializeApp(firebaseConfig)

const auth = getAuth()

document.getElementById("enter-button").onclick = function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
    .then(function() {
        window.location.href = 'dashboard.html';
    })
    .catch(function(error) {
        alert('Invalid Credentials!');
    });
}