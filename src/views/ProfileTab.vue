<template>
  <div>
    <HeaderComponent />
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 mt-24 min-h-screen custom-scrollbar">
      <h1 class="text-3xl font-semibold text-blue-700 mb-8 border-b-2 border-blue-200 pb-2">User Profile</h1>
      <div v-if="profile" class="max-w-2xl mx-auto">
        <div class="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
          <!-- Profile Header with Avatar -->
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img src="../assets/logo.png" alt="Default Avatar" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                <!-- User SVG -->
                <svg class="w-6 h-6 inline-block mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ profile.username }}
              </h2>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="space-y-5 text-gray-700">
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <p class="flex items-center text-sm">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m9-9h7m-7 0H3" />
                </svg>
                <span class="font-medium">Email:</span>
              </p>
              <span class="text-sm font-medium text-blue-700">{{ profile.email }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <p class="flex items-center text-sm">
                <svg class="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span class="font-medium">Role:</span>
              </p>
              <span class="text-lg font-semibold text-teal-700">{{ profile.role }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <p class="flex items-center text-sm">
                <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Last Login:</span>
              </p>
              <span class="text-sm font-medium text-yellow-700">{{ formatLastLogin(profile.lastLogin) || 'Never' }}</span>
            </div>
          </div>

          <!-- Logout Button -->
          <div class="mt-8 text-center">
            <button
              @click="logout"
              class="bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
              :disabled="logoutLoading"
            >
              {{ logoutLoading ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center text-blue-600 mt-8">
        <p class="text-lg">Loading profile data...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600 mt-8">
        <p class="text-lg">Error loading profile: {{ error.message }}</p>
      </div>
      <div v-else-if="!profile" class="text-center text-gray-600 mt-8">
        <p class="text-lg">No profile data available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import HeaderComponent from '../components/HeaderComponent.vue'
import { parseISO, format } from 'date-fns'

const PROFILE_QUERY = gql`
  query Profile {
    profile {
      username
      email
      role
      lastLogin
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`

export default defineComponent({
  name: 'ProfileTab',
  components: {
    HeaderComponent
  },
  setup() {
    const router = useRouter()
    const { result, loading, error } = useQuery(PROFILE_QUERY)
    const { mutate: logoutUser, loading: logoutLoading } = useMutation(LOGOUT_MUTATION)

    const profile = computed(() => result.value?.profile || null)

    // Function to format UTC timestamp directly (assuming local environment is EAT)
    const formatLastLogin = (timestamp) => {
      if (!timestamp) return null
      const date = parseISO(timestamp) // Parse the UTC ISO string
      return format(date, 'yyyy-MM-dd HH:mm:ss') // Format as local time (EAT if environment matches)
    }

    const logout = async () => {
      await logoutUser()
      window.isAuthenticated.value = false
      console.log('Logout successful, isAuthenticated:', window.isAuthenticated.value)
      router.push('/login')
    }

    return {
      profile,
      loading,
      error,
      logout,
      logoutLoading,
      formatLastLogin
    }
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #14b8a6);
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #0d9488);
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #e5e7eb;
}
</style>