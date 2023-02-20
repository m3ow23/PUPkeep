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

var URGENCY_FIILTER = 'All'
var STATUS_FILTER = 'All'
var USERS = null

// real-time database listener
const database = getDatabase()
// new sortedCases
const starCountRef = ref(database, 'users')
onValue(starCountRef, (snapshot) => {
    const element = document.getElementById("footer-emergency-container")       
    element.classList.remove("footer-emergency-container")
    element.classList.add("footer-emergency-container-off")

    USERS = snapshot.val()
    var emergencyCase = displayCases()

    if (emergencyCase) {
        const element = document.getElementById("footer-emergency-container")
                
        element.classList.remove("footer-emergency-container-off")
        element.classList.add("footer-emergency-container")

        if ("Notification" in window) {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    // Create a new notification
                    new Notification("There is an active emergency case!")
                }
            });
        }
    }
});

// display the table values
function displayCases() {

    document.getElementById('main-table-tables-container')
    .innerHTML = '' 

    var emergencyCase = false

    for (const userID in USERS) {
        const user = USERS[userID]['cases']

        console.log('user ' + userID)

        // filter by urgency
        var urgencyfilteredCases = []
        var urgencyfilteredCasesIDs = []
        for (const caseID in user) {
            if (user[caseID]['urgency'] === 'Emergency'
            && user[caseID]['status'] !== 'Finished') {
                emergencyCase = true
            }
            if (URGENCY_FIILTER === 'All') {
                urgencyfilteredCases.push(user[caseID])
                urgencyfilteredCasesIDs.push(caseID)
            } else if (user[caseID]['urgency'] === URGENCY_FIILTER) {
                urgencyfilteredCases.push(user[caseID])
                urgencyfilteredCasesIDs.push(caseID)
            }
        }
        // filter by status
        var filteredCases = []
        var filteredCasesIDs = []
        for (const caseID in urgencyfilteredCases) {
            if (STATUS_FILTER === 'All') {
                filteredCases.push(urgencyfilteredCases[caseID])
                filteredCasesIDs.push(urgencyfilteredCasesIDs[caseID])
            } else if (urgencyfilteredCases[caseID]['status'] === STATUS_FILTER) {
                filteredCases.push(urgencyfilteredCases[caseID])
                filteredCasesIDs.push(urgencyfilteredCasesIDs[caseID])
            }
        }

        // sort by status: new, ongoing, finished
        var sortedCases = []
        var casesIDs = []
        for (const caseID in filteredCases) {
            if (filteredCases[caseID]['status'] === 'New') {
                sortedCases.push(filteredCases[caseID])
                casesIDs.push(filteredCasesIDs[caseID])
            }
        }
        for (const caseID in filteredCases) {
            if (filteredCases[caseID]['status'] === 'Ongoing') {
                sortedCases.push(filteredCases[caseID])
                casesIDs.push(filteredCasesIDs[caseID])
            }
        }
        for (const caseID in filteredCases) {
            if (filteredCases[caseID]['status'] === 'Finished') {
                sortedCases.push(filteredCases[caseID])
                casesIDs.push(filteredCasesIDs[caseID])
            }
        }
        
        // table elements
        for (const caseID in sortedCases) {
            const eachCase = sortedCases[caseID]

            console.log('- case ' + casesIDs[caseID])

            var status = ''
            
            switch (eachCase['status']) {
                case 'New':
                    status = '<img class="main-table-img" src="../assets/dashboard/new.png">'
                    break;
                case 'Ongoing':
                    status =  '<img class="main-table-img" src="../assets/dashboard/processing.png">'
                    break;
                case 'Finished':
                    status =  '<img class="main-table-img" src="../assets/dashboard/completed.png">'
                    break;
            }

            document.getElementById('main-table-tables-container')
            .innerHTML += 
                '<div class="main-table-tables-element-container" id="view-details" data-value1="' + userID+ '" data-value2="'+ casesIDs[caseID] +'">' +
                    '<div class="main-table-column-name-category">' +
                            '<p class="main-table-column-name" id="main-table-column-name">' + eachCase['category'] + '</p>' + 
                    '</div>' +
                    '<div class="main-table-column-name-case-id">' +
                        '<p class="main-table-column-name" id="main-table-column-name">' + casesIDs[caseID] + '</p>' + 
                    '</div>' +
                    '<div class="main-table-column-name-submitted-on">' + 
                        '<p class="main-table-column-name" id="main-table-column-name">' + formatDate(eachCase['submitted_on']) + '</p>' + 
                    '</div>' + 
                    '<div class="main-table-column-name-submitted-by">' + 
                        '<p class="main-table-column-name" id="main-table-column-name">' + eachCase['submitted_by'] + '</p>' + 
                    '</div>' +
                    '<div class="main-table-column-name-location">' + 
                        '<p class="main-table-column-name" id="main-table-column-name">' + eachCase['location'] + '</p>' + 
                    '</div>' +
                    '<div class="main-table-column-name-urgency">' + 
                        '<div class="main-' + eachCase['urgency'] + '-container">' +
                            '<p class="main-table-column-name" id="main-table-column-name">' + eachCase['urgency'] + '</p>' + 
                        '</div>' +
                    '</div>' +
                    '<div class="main-table-column-name-status">' +
                        status +
                    '</div>' +
                '</div>'
        }
    }

    // view case details function
    const elements = document.querySelectorAll("#view-details")
    elements.forEach((element) => {
        element.addEventListener("click", function viewCaseDetails() {
            const userID = element.dataset.value1
            const caseID = element.dataset.value2
    
            localStorage.setItem('userID', JSON.stringify(userID));
            localStorage.setItem('caseID', JSON.stringify(caseID));
            window.location.href = 'details.html';
        })
    });

    return emergencyCase
}

function formatDate(unixTimestamp) {
    var date = new Date(unixTimestamp);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // zero-based month
    var day = ('0' + date.getDate()).slice(-2);
    return day + '/' + month + '/' + year;
}

document.getElementById("urgency-menu").addEventListener("change", (event) => {
    URGENCY_FIILTER = event.target.value;
    console.log('Urgency was set to ' + URGENCY_FIILTER)
    displayCases()
});

document.getElementById("status-menu").addEventListener("change", (event) => {
    STATUS_FILTER = event.target.value;
    console.log('Status was set to ' + STATUS_FILTER)
    displayCases()
});

// logout function
document.getElementById("logout-button").onclick = function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        localStorage.clear()
        window.location.href = 'login.html';
    }).catch(function() {
        alert('Unexpected Error Occured!');
    });
}