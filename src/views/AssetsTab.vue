<template>
  <div>
    <HeaderComponent />
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 mt-24 min-h-screen custom-scrollbar">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Protected Assets</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="asset in assets"
          :key="asset.clientHost"
          class="relative bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/30 overflow-hidden"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-t-xl -mx-6 -mt-6 mb-4">
            <h2 class="text-lg font-bold text-white flex items-center">
              <span class="mr-2">🛡️</span> {{ asset.clientHost }}
            </h2>
          </div>

          <!-- Card Content -->
          <div class="space-y-4 text-sm text-gray-700">
            <div class="flex items-center justify-between">
              <p class="flex items-center">
                <span class="font-medium text-teal-600 mr-2">📊</span>
                <span class="font-semibold">Total Requests:</span>
              </p>
              <span class="text-lg font-bold text-teal-700">{{ asset.totalRequests }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="flex items-center">
                <span class="font-medium text-red-600 mr-2">⚠️</span>
                <span class="font-semibold">Attack Requests:</span>
              </p>
              <span class="text-lg font-bold text-red-700">{{ asset.attackRequests }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="flex items-center">
                <span class="font-medium text-yellow-600 mr-2">⏰</span>
                <span class="font-semibold">Last Attacked:</span>
              </p>
              <span class="text-sm text-yellow-700">{{ formatLastAttacked(asset.lastAttacked) || 'Never' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="flex items-center">
                <span class="font-medium text-purple-600 mr-2">🏠</span>
                <span class="font-semibold">Target Host:</span>
              </p>
              <span class="text-sm text-purple-700">{{ asset.targetHost }}</span>
            </div>

            <!-- Attack Types Table -->
            <div v-if="asset.attackTypeCounts" class="mt-4">
              <p class="font-medium text-blue-600 mb-2">Attack Types:</p>
              <table class="w-full text-sm border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr class="bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800">
                    <th class="p-2 text-center font-semibold rounded-tl-lg">Command Injection</th>
                    <th class="p-2 text-center font-semibold">XSS</th>
                    <th class="p-2 text-center font-semibold rounded-tr-lg">SQL Injection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white/50">
                    <td class="p-2 text-center font-bold text-blue-700">{{ parsedAttackTypes(asset.attackTypeCounts)['Command Injection'] || 0 }}</td>
                    <td class="p-2 text-center font-bold text-blue-700">{{ parsedAttackTypes(asset.attackTypeCounts)['XSS'] || 0 }}</td>
                    <td class="p-2 text-center font-bold text-blue-700">{{ parsedAttackTypes(asset.attackTypeCounts)['SQL Injection'] || 0 }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading/Error States -->
      <div v-if="loading" class="text-center text-blue-600 mt-4">
        <p>Loading asset data...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600 mt-4">
        <p>Error loading data: {{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import HeaderComponent from '../components/HeaderComponent.vue';
import { parseISO, format } from 'date-fns';

const ASSETS_QUERY = gql`
  query Assets {
    assets {
      clientHost
      totalRequests
      attackRequests
      lastAttacked
      attackTypeCounts
      targetHost
    }
  }
`;

export default defineComponent({
  name: 'AssetsTab',
  components: {
    HeaderComponent
  },
  setup() {
    // Enable polling every 10 seconds
    const { result, loading, error, refetch } = useQuery(ASSETS_QUERY, null, {
      pollInterval: 1000, // Poll every 1 seconds (1000 ms)
    });

    const assets = computed(() => result.value?.assets || []);

    // Parse attackTypeCounts from JSON string to object if needed
    const parsedAttackTypes = (attackTypes) => {
      if (typeof attackTypes === 'string') {
        try {
          return JSON.parse(attackTypes);
        } catch (e) {
          console.error('Failed to parse attackTypeCounts:', e);
          return {};
        }
      }
      return attackTypes || {};
    };

    // Function to format UTC lastAttacked to local time (EAT)
    const formatLastAttacked = (timestamp) => {
      if (!timestamp) return null;
      const date = parseISO(timestamp); // Parse the UTC ISO string
      return format(date, 'yyyy-MM-dd HH:mm:ss'); // Format in local timezone (EAT)
    };

    // Optional: Manual refetch trigger (e.g., for a button)
    const manualRefetch = () => {
      refetch();
    };

    return {
      assets,
      loading,
      error,
      parsedAttackTypes,
      manualRefetch,
      formatLastAttacked
    };
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px; /* For horizontal scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb; /* Light gray track */
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* Inset shadow for depth */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #14b8a6); /* Gradient from blue to teal */
  border-radius: 10px;
  border: 1px solid #e5e7eb; /* Border to match track */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow for thumb */
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #0d9488); /* Darker gradient on hover */
}

/* Firefox scrollbar fallback */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #e5e7eb; /* Thumb color and track color */
}
</style>