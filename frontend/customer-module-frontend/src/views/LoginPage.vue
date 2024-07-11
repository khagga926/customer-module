<template>
  <div class="login-container">
    <div class="login-box">
      <h1>SellCars</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Username" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/login',
          {
            email: this.email,
            password: this.password,
          }
        );
        localStorage.setItem('token', response.data.token);
        this.$router.push('/customers-page');
      } catch (error) {
        alert('Invalid email or password');
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c3e50;
}

.login-box {
  background-color: #ecf0f1;
  padding: 40px 50px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

h1 {
  margin-bottom: 30px;
  font-size: 26px;
  color: #34495e;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 16px;
  color: #34495e;
}

input::placeholder {
  color: #7f8c8d;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

button:hover {
  background-color: #2c3e50;
}
</style>
