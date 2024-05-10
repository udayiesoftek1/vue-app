// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAxGnUkikWs0aIvt6zu9wOB_Ja7NHmHAo8",
    authDomain: "vue-proj-6f4a8.firebaseapp.com",
    projectId: "vue-proj-6f4a8",
    storageBucket: "vue-proj-6f4a8.appspot.com",
    messagingSenderId: "48164468510",
    appId: "1:48164468510:web:9eb75477d3992050ed7b0f",
    measurementId: "G-KRXREQJ3GM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;