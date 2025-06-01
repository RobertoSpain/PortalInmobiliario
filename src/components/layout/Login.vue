<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile 
} from 'firebase/auth';

const email = ref('');
const password = ref('');
const name = ref('');
const showPassword = ref(false);
const isRegister = ref(false);
const router = useRouter();

const handleSubmit = () => {
  if (isRegister.value) {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((userCredential) => {
        if (name.value) {
          return updateProfile(userCredential.user, { displayName: name.value })
            .then(() => userCredential);
        }
        return userCredential;
      })
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  } else {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  }
};

const loginWithGoogle = () => {
  signInWithPopup(getAuth(), new GoogleAuthProvider())
    .then(() => {
      router.push('/');
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
};

// Alterna la visibilidad de la contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  name.value = '';
  email.value = '';
  password.value = '';
};
</script>

<template>
  <div class="login-container">
    <h1>{{ isRegister ? 'Sign Up' : 'Welcome Back!' }}</h1>
    <form @submit.prevent="handleSubmit">
      <div v-if="isRegister" class="input-field">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M16 8v-2a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"></path>
          </svg>
        </span>
        <input v-model="name" type="text" placeholder="Name" required />
      </div>
      <div class="input-field">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div class="input-field">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
        <input 
          v-model="password" 
          :type="showPassword ? 'text' : 'password'" 
          placeholder="Password" 
          required 
        />
        <span class="eye-icon" @click="togglePassword">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </span>
      </div>
      <div v-if="!isRegister" class="forgot-password">
        <a href="#">Forgot Password</a>
      </div>
      <div class="signin-row">
        <div class="signin-text">{{ isRegister ? 'Sign Up' : 'Sign In' }}</div>
        <button type="submit" class="signin-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </form>
    <div class="divider">
      <span>{{ isRegister ? 'Sign up with' : 'Sign in with' }}</span>
    </div>
    <div class="social-signin">
      <button class="google-button" @click="loginWithGoogle">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M12.545 12.151L12.545 14.106L16.061 14.106C15.877 15.297 14.777 17.337 12.545 17.337C10.595 17.337 8.995 15.711 8.995 13.726C8.995 11.741 10.595 10.115 12.545 10.115C13.637 10.115 14.386 10.551 14.82 10.969L16.28 9.55C15.284 8.623 14.03 8.03 12.545 8.03C9.424 8.03 6.9 10.584 6.9 13.726C6.9 16.868 9.424 19.422 12.545 19.422C15.83 19.422 18.103 17.007 18.103 13.811C18.103 13.425 18.063 13.117 18.018 12.808L12.546 12.808L12.545 12.151Z" fill="#4285F4"/>
        </svg>
      </button>
    </div>
    <div class="signup-link">
      <a href="#" @click.prevent="toggleMode">
        {{ isRegister ? 'Sign In Instead' : 'Sign Up Instead' }}
      </a>
    </div>
  </div>
</template>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}


.login-container {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
}

.input-field {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 50px;
  padding: 0 20px;
  margin-bottom: 20px;
  height: 60px;
}

.icon {
  color: #333;
  margin-right: 15px;
}

.input-field input {
  border: none;
  width: 100%;
  font-size: 16px;
  outline: none;
  height: 100%;
  background-color: #eaf1fb;
  border-radius: 0 50px 50px 0;
  padding-left: 10px;
}

.eye-icon {
  cursor: pointer;
  color: #333;
}

.forgot-password {
  text-align: right;
  margin: 10px 0 30px;
}

.forgot-password a {
  color: #00cc66;
  text-decoration: none;
}

.signin-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 50px;
}

.signin-text {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.signin-button {
  background-color: #00cc66;
  color: white;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 204, 102, 0.3);
  transition: all 0.3s ease;
}

.signin-button:hover {
  background-color: #00b359;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 204, 102, 0.4);
}

.signin-button svg {
  width: 28px;
  height: 28px;
  margin-left: 4px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #ddd;
}

.divider span {
  background-color: #f5f5f8;
  padding: 0 15px;
  position: relative;
  color: #666;
}

.social-signin {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.google-button {
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.signup-link {
  text-align: center;
}

.signup-link a {
  color: #00cc66;
  text-decoration: none;
  font-weight: 500;
}
</style>