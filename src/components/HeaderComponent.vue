<template>
  <header class="bg-white/30 backdrop-blur-md text-gray-800 py-6 px-8 rounded-full shadow-lg fixed top-0 left-0 w-full z-10 border border-white/20 transition-all duration-300 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <!-- Round logo on the left -->
      <img src="../assets/logo.png" alt="Logo" class="h-11 w-11 rounded-full object-cover" />
    </div>
    <nav class="flex justify-end space-x-3">
      <a href="#" 
         class="px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md flex items-center space-x-2"
         :class="{ 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md': activeTab === 'dashboard', 'bg-white/50 backdrop-blur-sm text-blue-600 hover:bg-white/70 hover:text-blue-700': activeTab !== 'dashboard' }" 
         @click.prevent="navigateTo('dashboard', '/')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="5 8 20 20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h18M3 17h18M3 21h18"></path></svg>
        Dashboard
      </a>
      <a href="#" 
         class="px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md flex items-center space-x-2"
         :class="{ 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md': activeTab === 'monitoring', 'bg-white/50 backdrop-blur-sm text-blue-600 hover:bg-white/70 hover:text-blue-700': activeTab !== 'monitoring' }" 
         @click.prevent="navigateTo('monitoring', '/monitoring')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="5 -1 15 27" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Monitoring
      </a>
      <a href="#" 
         class="px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md flex items-center space-x-2"
         :class="{ 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md': activeTab === 'assets', 'bg-white/50 backdrop-blur-sm text-blue-600 hover:bg-white/70 hover:text-blue-700': activeTab !== 'assets' }" 
         @click.prevent="navigateTo('assets', '/assets')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-18 0l9 5 9-5"></path></svg>
        Assets
      </a>
      <a href="#" 
         class="px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md flex items-center space-x-2"
         :class="{ 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md': activeTab === 'forensic', 'bg-white/50 backdrop-blur-sm text-blue-600 hover:bg-white/70 hover:text-blue-700': activeTab !== 'forensic' }" 
         @click.prevent="navigateTo('forensic', '/forensic')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"></path></svg>
        Forensic
      </a>
      <a href="#" 
         class="px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md flex items-center space-x-2"
         :class="{ 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md': activeTab === 'profile', 'bg-white/50 backdrop-blur-sm text-blue-600 hover:bg-white/70 hover:text-blue-700': activeTab !== 'profile' }" 
         @click.prevent="navigateTo('profile', '/profile')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Profile
      </a>
    </nav>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const router = useRouter();
    const route = useRoute();

    // Compute activeTab based on the current route
    const activeTab = computed(() => {
      if (route.path === '/') return 'dashboard';
      if (route.path === '/monitoring') return 'monitoring';
      if (route.path === '/assets') return 'assets';
      if (route.path === '/forensic') return 'forensic';
      if (route.path === '/profile') return 'profile';
      return 'dashboard'; // Default to dashboard
    });

    const navigateTo = (tab, path) => {
      router.push(path);
    };

    return { activeTab, navigateTo };
  }
});
</script>

<style scoped>
/* Optional: Add custom styling for the round logo */
header img {
  transition: transform 0.3s ease-in-out;
}
header img:hover {
  transform: scale(1.3);
}
</style>