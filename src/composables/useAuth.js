import { ref, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const PROFILE_QUERY = gql`
  query Profile {
    profile {
      username
    }
  }
`

export function useAuth() {
  const isAuthenticated = ref(false)
  const loading = ref(true)

  const { result, onError } = useQuery(PROFILE_QUERY, null, { fetchPolicy: 'network-only' })

  // Update authentication state when query resolves
  onMounted(() => {
    if (result.value?.profile?.username) {
      isAuthenticated.value = true
    }
    loading.value = false
  })

  // Handle errors
  onError((error) => {
    console.error('Auth check error:', error)
    isAuthenticated.value = false
    loading.value = false
  })

  return { isAuthenticated, loading }
}