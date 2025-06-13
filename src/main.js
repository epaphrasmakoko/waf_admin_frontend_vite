import { createApp, h, provide } from 'vue';
import App from './App.vue';
import router from './router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http'; // Import HttpLink
import './style.css';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include', // Moved from ApolloClient options
});

const apolloClient = new ApolloClient({
  link: httpLink, // Use the HttpLink
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only' },
    mutate: { fetchPolicy: 'no-cache' },
  },
});

const isAuthenticated = { value: false };

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
    provide('isAuthenticated', isAuthenticated);
  },
  render: () => h(App),
});

app.use(router);
app.mount('#app');

window.isAuthenticated = isAuthenticated;