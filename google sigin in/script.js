// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyA-_k9vzh_fEe9DXQ3oouozVUOIsCOYxTQ",

    authDomain: "singin-18deb.firebaseapp.com",

    databaseURL:
        "https://singin-18deb-default-rtdb.firebaseio.com",

    projectId: "singin-18deb",

    storageBucket:
        "singin-18deb.firebasestorage.app",

    messagingSenderId:
        "464084430227",

    appId:
        "1:464084430227:web:115204279c465bcf4fcc66",

    measurementId:
        "G-PLX8PXK1W4"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

firebase.initializeApp(firebaseConfig);


// Firebase Authentication
const auth = firebase.auth();


// Firebase Realtime Database
const database = firebase.database();


// ==========================================
// HTML ELEMENTS
// ==========================================

const loginPage =
    document.getElementById("loginPage");

const landingPage =
    document.getElementById("landingPage");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const emailLoginBtn =
    document.getElementById("emailLoginBtn");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const resetBtn =
    document.getElementById("resetBtn");

const message =
    document.getElementById("message");


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(text, type = "error") {

    message.textContent = text;

    message.className =
        "message " + type;
}


// ==========================================
// LOADING BUTTONS
// ==========================================

function setLoading(status) {

    emailLoginBtn.disabled = status;

    googleLoginBtn.disabled = status;

    signupBtn.disabled = status;

    resetBtn.disabled = status;
}


// ==========================================
// SAVE USER IN REALTIME DATABASE
// ==========================================

async function saveUserToDatabase(user, provider) {

    if (!user) {
        return;
    }


    const userData = {

        uid: user.uid,

        email: user.email || "",

        name: user.displayName || "User",

        photoURL: user.photoURL || "",

        provider: provider,

        lastLogin:
            new Date().toISOString()

    };


    await database
        .ref("users/" + user.uid)
        .update(userData);
}


// ==========================================
// GOOGLE LOGIN
// ==========================================

async function SignLogin() {

    setLoading(true);

    showMessage("");


    try {

        const provider =
            new firebase.auth.GoogleAuthProvider();


        provider.setCustomParameters({

            prompt: "select_account"

        });


        const result =
            await auth.signInWithPopup(provider);


        // Save Google user
        // in Realtime Database

        await saveUserToDatabase(
            result.user,
            "Google"
        );


        // Open landing page

        showLandingPage();

    }

    catch (error) {

        console.error(
            "Google Login Error:",
            error
        );


        showMessage(
            getFirebaseError(error)
        );

    }

    finally {

        setLoading(false);

    }
}


// ==========================================
// GMAIL / EMAIL LOGIN
// ==========================================

async function emailLogin() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            "Please enter Gmail and password."
        );

        return;
    }


    setLoading(true);

    showMessage("");


    try {

        const result =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );


        // Save Gmail user
        // in Realtime Database

        await saveUserToDatabase(
            result.user,
            "Email/Gmail"
        );


        // Open landing page

        showLandingPage();

    }

    catch (error) {

        console.error(
            "Gmail Login Error:",
            error
        );


        showMessage(
            getFirebaseError(error)
        );

    }

    finally {

        setLoading(false);

    }
}


// ==========================================
// CREATE GMAIL ACCOUNT
// ==========================================

async function createAccount() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            "Enter Gmail and password first."
        );

        return;
    }


    if (password.length < 6) {

        showMessage(
            "Password must contain at least 6 characters."
        );

        return;
    }


    setLoading(true);

    showMessage("");


    try {

        const result =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );


        // Save new user
        // in Realtime Database

        await saveUserToDatabase(
            result.user,
            "Email/Gmail"
        );


        // Open landing page

        showLandingPage();

    }

    catch (error) {

        console.error(
            "Create Account Error:",
            error
        );


        showMessage(
            getFirebaseError(error)
        );

    }

    finally {

        setLoading(false);

    }
}


// ==========================================
// FORGOT PASSWORD
// ==========================================

async function resetPassword() {

    const email =
        emailInput.value.trim();


    if (!email) {

        showMessage(
            "Enter your Gmail first."
        );

        return;
    }


    setLoading(true);


    try {

        await auth.sendPasswordResetEmail(
            email
        );


        showMessage(
            "Password reset email sent to your Gmail.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Password Reset Error:",
            error
        );


        showMessage(
            getFirebaseError(error)
        );

    }

    finally {

        setLoading(false);

    }
}


// ==========================================
// SHOW LANDING PAGE
// ==========================================

function showLandingPage() {

    loginPage.style.display = "none";

    landingPage.style.display = "block";

}


// ==========================================
// LOGOUT
// ==========================================

async function logout() {

    try {

        await auth.signOut();


        landingPage.style.display =
            "none";


        loginPage.style.display =
            "block";


        emailInput.value = "";

        passwordInput.value = "";

        showMessage("");

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }
}


// ==========================================
// CHECK LOGIN STATE
// ==========================================

auth.onAuthStateChanged(function(user) {

    if (user) {

        showLandingPage();

    }

    else {

        landingPage.style.display =
            "none";

        loginPage.style.display =
            "block";

    }

});


// ==========================================
// FIREBASE ERROR MESSAGES
// ==========================================

function getFirebaseError(error) {

    switch (error.code) {

        case "auth/invalid-email":

            return "Please enter a valid Gmail address.";


        case "auth/user-not-found":

            return "No account found with this Gmail.";


        case "auth/wrong-password":

        case "auth/invalid-credential":

            return "Gmail or password is incorrect.";


        case "auth/email-already-in-use":

            return "This Gmail is already registered. Please login.";


        case "auth/weak-password":

            return "Password must contain at least 6 characters.";


        case "auth/popup-closed-by-user":

            return "Google login was cancelled.";


        case "auth/popup-blocked":

            return "Google popup was blocked. Please allow popups.";


        case "auth/operation-not-allowed":

            return "This login method is not enabled in Firebase Console.";


        case "auth/network-request-failed":

            return "Network error. Check your internet connection.";


        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }
}