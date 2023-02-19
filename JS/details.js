import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
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

// get caseID variable from local storage
const caseID = JSON.parse(localStorage.getItem('caseID'))
if(!caseID) {
    window.location.href = 'dashboard.html';
    process.exit()
}

// real-time database listener
const database = getDatabase()
const starCountRef = ref(database, 'users/' + /* auth['user']['uid'] */ '0001' + '/cases/' + caseID)
onValue(starCountRef, (snapshot) => {
    displayUpdates(snapshot.val())
})

function displayUpdates(specificCase) {
    document.getElementById('main-case-container')
    .innerHTML = '' 

    var status = ''
    switch (specificCase['status']) {
        case 'new':
            status = '<img class="main-case-status-img" src="../assets/dashboard/new.png">'
            break;
        case 'ongoing':
            status =  '<img class="main-case-status-img" src="../assets/dashboard/processing.png">'
            break;
        case 'finished':
            status =  '<img class="main-case-status-img" src="../assets/dashboard/completed.png">'
            break;
    }

    document.getElementById('main-case-container')
    .innerHTML += 
        '<div class="main-case-image">' +
            '<img src="' + specificCase['photos'][0]+ '" alt="Photo submitted by user">' + 
        '</div>' +
        '<div class="main-case-image">' +
            '<img src="' + specificCase['photos'][1]+ '" alt="Photo submitted by user">' + 
        '</div>' +
        '<div class="main-case-image">' +
            '<img src="' + specificCase['photos'][2]+ '" alt="Photo submitted by user">' + 
        '</div>' +
        '<div class="main-case-info">' +
            '<p class="main-case-info-label">Case ID:</p><p class="main-case-info-value">' + caseID + '</p>' + 
            '<p class="main-case-info-label">Submitted On:</p><p class="main-case-info-value">' + specificCase['submitted_on'] + '</p>' + 
            '<p class="main-case-info-label">Submitted By:</p><p class="main-case-info-value">' + specificCase['submitted_by'] + '</p>' + 
            '<p class="main-case-info-label">Location:</p><p class="main-case-info-value">' + specificCase['location'] + '</p>' + 
            '<p class="main-case-info-label">Urgency Level:</p><p class="main-case-info-value">' + specificCase['urgency'] + '</p>' + 
            '<p class="main-case-info-label">Status:</p><p class="main-case-info-value">' + status + '</p>' + 
        '</div>' +
        '<div class="main-case-details">' +
            '<p class="main-case-details-label">Details:</p>' + 
            '<p class="main-case-details-value">' + specificCase['details'] + '</p>' + 
        '</div>'

    for (const updateID in specificCase['updates']) {
        const update = specificCase['updates'][updateID]

        document.getElementById('main-case-container')
        .innerHTML += 
            '<div class="main-case-updates">' +
                '<p class="main-case-updates-label">Updates:</p>' + 
                '<div class="main-case-updates-container">' + 
                    '<p class="main-case-updates-sender">' + update['sender'] + '</p>' + 
                    '<p class="main-case-updates-date">' + update['date'] + '</p>' + 
                    '<p class="main-case-updates-value">' + update['message'] + '</p>' + 
                '</div>' +
            '</div>'
    }
}

// go back to dashboard function
document.getElementById("header-left-content").addEventListener("click", function() {
    localStorage.removeItem('caseID')
    window.location.href = 'dashboard.html';
})

function sendUpdate() {
    // send update to database given by maintenance dept. personnel
}

function setStatus() {
    // set the case's status according to maintenance dept. personnel
}

// logout function
// document.getElementById("logout-button").onclick = function login() {
//     const auth = getAuth();
//     signOut(auth).then(() => {
//         localStorage.clear()
//         window.location.href = 'login.html';
//     }).catch(function() {
//         alert('Unexpected Error Occured!');
//     });
// }