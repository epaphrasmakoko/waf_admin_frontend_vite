import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import './style.css'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
  credentials: 'include', // Ensure cookies are sent with requests
})

const isAuthenticated = { value: false } // Use object to allow updates

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
    provide('isAuthenticated', isAuthenticated)
  },
  render: () => h(App)
})

app.use(router)
app.mount('#app')

window.isAuthenticated = isAuthenticated