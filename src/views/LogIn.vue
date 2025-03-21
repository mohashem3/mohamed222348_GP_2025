<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase/firebaseConfig' // Import Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/') // Redirect to homepage after successful login
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="title">Login Form</div>
    <form @submit.prevent="login">
      <div class="field">
        <input v-model="email" type="email" required />
        <label>Email Address</label>
      </div>
      <div class="field">
        <input v-model="password" type="password" required />
        <label>Password</label>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="field">
        <input type="submit" value="Login" />
      </div>
      <div class="signup-link">
        Not a member? <router-link to="/signup">Signup now</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Keep your existing styles */
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* Center the form in the page */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f2f2f2;
}

.wrapper {
  width: 380px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1);
}

.wrapper .title {
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  line-height: 100px;
  color: #fff;
  user-select: none;
  border-radius: 15px 15px 0 0;
  background: linear-gradient(-135deg, #c850c0, #4158d0);
}

.wrapper form {
  padding: 10px 30px 50px 30px;
}

.wrapper form .field {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  position: relative;
}

.wrapper form .field input {
  height: 100%;
  width: 100%;
  outline: none;
  font-size: 17px;
  padding-left: 20px;
  border: 1px solid lightgrey;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.wrapper form .field input:focus,
.wrapper form .field input:valid {
  border-color: #4158d0;
}

.wrapper form .field label {
  position: absolute;
  top: 50%;
  left: 20px;
  color: #999999;
  font-weight: 400;
  font-size: 17px;
  pointer-events: none;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

.wrapper form .field input:focus ~ label,
.wrapper form .field input:valid ~ label {
  top: 0%;
  font-size: 16px;
  color: #4158d0;
  background: #fff;
  transform: translateY(-50%);
}

form .content {
  display: flex;
  width: 100%;
  height: 30px;
  font-size: 16px;
  align-items: center;
  justify-content: space-around;
}

form .content .checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

form .content input {
  width: 15px;
  height: 15px;
  background: red;
}

form .content label {
  color: #262626;
  user-select: none;
  padding-left: 5px;
}

form .field input[type='submit'] {
  color: #fff;
  border: none;
  padding-left: 0;
  margin-top: -10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(-135deg, #c850c0, #4158d0);
  transition: all 0.3s ease;
}

form .field input[type='submit']:active {
  transform: scale(0.95);
}

form .signup-link {
  color: #262626;
  margin-top: 20px;
  text-align: center;
}

form .pass-link a,
form .signup-link a {
  color: #4158d0;
  text-decoration: none;
}

form .pass-link a:hover,
form .signup-link a:hover {
  text-decoration: underline;
}
</style>
