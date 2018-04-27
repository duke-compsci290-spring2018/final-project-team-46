import Firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAXJHWZ5Lk6Qn8-6JqHFxykQr-5h3CkuUw",
    authDomain: "hikeadvisor.firebaseapp.com",
    databaseURL: "https://hikeadvisor.firebaseio.com",
    projectId: "hikeadvisor",
    storageBucket: "hikeadvisor.appspot.com",
    messagingSenderId: "223377885130"
  };
  
var fireApp=Firebase.initializeApp(config);

export const db = fireApp.database()

export const storageRef = fireApp.storage().ref()

export const usersRef = db.ref('users')
export const userActRef = db.ref('userActivity')
export const searchActRef = db.ref('searchActivity')
export const tripRef = db.ref('hikeadvisor')