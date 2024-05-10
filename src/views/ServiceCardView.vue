<template>
  <div>
    <button @click="signIn" v-if="!isLoggedIn">Sign In</button>
    <h1 v-if="isLoggedIn">Logged in..</h1>
  </div>
</template>

<script>
import { ref } from 'vue' // Import ref from Vue 3

// Import Firebase authentication functions
import firebase from '../firebaseConfig.js'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export default {
  setup() {
    // Define a reactive data property to track the user's authentication status
    const isLoggedIn = ref(false)

    const signIn = () => {
      // Sign in with Google
      const provider = new GoogleAuthProvider()
      const auth = getAuth()

      // Start the sign-in process
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log('User signed in:', result.user)
          // Set isLoggedIn to true when the user is signed in successfully
          isLoggedIn.value = true
        })
        .catch((error) => {
          console.error('Error signing in:', error)
        })
    }

    return {
      signIn,
      isLoggedIn // Expose the isLoggedIn property to the template
    }
  }
}
</script>

<style>
/* Add your styles here */
</style>
