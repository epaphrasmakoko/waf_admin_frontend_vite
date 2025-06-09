<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6 flex-col">
    <!-- Logo outside the login div, centered and larger -->
    <div class="flex justify-center mb-8">
      <img src="../assets/logo.png" alt="Logo" class="h-24 w-24 rounded-full object-cover" />
    </div>
    <div class="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 w-full max-w-md">
      <div class="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-t-xl -mx-8 -mt-8 mb-6">
        <h2 class="text-xl font-bold text-white flex items-center justify-center">
          <!-- Lock SVG -->
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11v-4a4 4 0 00-8 0v4m-2 2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
          </svg>
          Login to Smart-WAF
        </h2>
      </div>
      <div class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <!-- User SVG -->
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter your username"
              @keyup.enter="login"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <!-- New Eye SVG for Password -->
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter your password"
              @keyup.enter="login"
            />
          </div>
        </div>
        <button
          @click="login"
          class="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
      <div v-if="error" class="mt-4 text-center text-red-600 text-sm">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const LOGIN_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
      message
    }
  }
`

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')

    const { mutate: loginUser, loading, onDone, onError } = useMutation(LOGIN_MUTATION)

    const login = async () => {
      error.value = ''
      if (!username.value || !password.value) {
        error.value = 'Username and password are required'
        return
      }
      console.log('Attempting login with:', username.value, password.value)
      try {
        const response = await loginUser({
          username: username.value.trim(),
          password: password.value.trim()
        })
        console.log('Mutation response:', response)
      } catch (e) {
        console.error('Mutation error caught:', e)
      }
    }

    onDone(result => {
      console.log('Mutation result:', result)
      if (result.data?.loginUser?.success) {
        console.log('Login successful, updating isAuthenticated')
        window.isAuthenticated.value = true
        console.log('isAuthenticated state:', window.isAuthenticated.value)
        router.push('/')
      } else {
        console.log('Login failed:', result.data?.loginUser?.message)
        error.value = result.data?.loginUser?.message || 'Invalid credentials'
      }
    })

    onError(err => {
      console.log('Mutation error:', err)
      error.value = err.message || 'Login failed. Please try again.'
      console.log('Error details:', err.networkError?.result)
    })

    return {
      username,
      password,
      loading,
      error,
      login
    }
  }
}
</script>

<style scoped>
/* Optional: Add custom styling for the logo */
img {
  transition: transform 0.3s ease-in-out;
}
img:hover {
  transform: scale(1.05);
}
</style>