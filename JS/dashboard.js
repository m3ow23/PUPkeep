import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"
import { getDatabase, ref, onValue  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

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

// check if user is valid
const auth = JSON.parse(localStorage.getItem('auth'))
if(!auth) {
    window.location.href = 'login.html';
    process.exit()
}

// real-time database listener
const database = getDatabase()
const starCountRef = ref(database, 'users')
onValue(starCountRef, (snapshot) => {
    displayCases(snapshot.val())
});

// display the table values
function displayCases(users) {
    //console.clear()

    document.getElementById('main-order-tables-container')
    .innerHTML = '' 

    for (const userID in users) {
        const user = users[userID]['cases']

        console.log('user ' + userID)
        
        for (const caseID in user) {
            const eachCase = user[caseID]

            console.log('> case ' + caseID)

            var status = ''
            switch (eachCase['status']) {
                case 'new':
                    status = '<img class="main-order-img" src="../assets/dashboard/new.png">'
                    break;
                case 'ongoing':
                    status =  '<img class="main-order-img" src="../assets/dashboard/processing.png">'
                    break;
                case 'finished':
                    status =  '<img class="main-order-img" src="../assets/dashboard/completed.png">'
                    break;
            }

            document.getElementById('main-order-tables-container')
            .innerHTML += 
                '<div class="main-order-tables-element-container" id="view-details" data-value="'+ caseID +'">' +
                    '<div class="main-order-column-name-case-id">' +
                        '<p class="main-order-column-name" id="main-order-column-name">' + caseID + '</p>' + 
                    '</div>' +
                    '<div class="main-order-column-name-submitted-on">' + 
                        '<p class="main-order-column-name" id="main-order-column-name">' + eachCase['submitted_on'] + '</p>' + 
                    '</div>' + 
                    '<div class="main-order-column-name-submitted-by">' + 
                        '<p class="main-order-column-name" id="main-order-column-name">' + eachCase['submitted_by'] + '</p>' + 
                    '</div>' +
                    '<div class="main-order-column-name-location">' + 
                        '<p class="main-order-column-name" id="main-order-column-name">' + eachCase['location'] + '</p>' + 
                    '</div>' +
                    '<div class="main-order-column-name-urgency">' + 
                        '<p class="main-order-column-name" id="main-order-column-name">' + eachCase['urgency'] + '</p>' + 
                    '</div>' +
                    '<div class="main-order-column-name-status">' +
                        status +
                    '</div>' +
                '</div>'
        }
    }

    // go to details function
    document.getElementById("view-details").addEventListener("click", function() {
        const caseID = document.querySelector('.main-order-tables-element-container').dataset.value

        localStorage.setItem('caseID', JSON.stringify(caseID));
        window.location.href = 'details.html';
    })
}

// logout function
document.getElementById("logout-button").onclick = function login() {
    const auth = getAuth();
    signOut(auth).then(() => {
        localStorage.clear()
        window.location.href = 'login.html';
    }).catch(function() {
        alert('Unexpected Error Occured!');
    });
}