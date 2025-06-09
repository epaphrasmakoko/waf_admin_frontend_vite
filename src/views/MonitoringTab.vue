<template>
  <div>
    <HeaderComponent />
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 mt-24 min-h-screen custom-scrollbar">
      <!-- Tab Navigation, Search, Rows per Page, and Last Updated -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex space-x-2">
            <button
              @click="activeTab = 'all'"
              :class="['px-4 py-2 rounded-l-lg', activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white/60 text-blue-600']"
            >
              All Requests
            </button>
            <button
              @click="activeTab = 'malicious'"
              :class="['px-4 py-2 rounded-r-lg', activeTab === 'malicious' ? 'bg-blue-600 text-white' : 'bg-white/60 text-blue-600']"
            >
              Malicious Requests Only
            </button>
          </div>
          <div class="flex-1">
            <input
              v-model="searchIncidentId"
              type="text"
              placeholder="Search by Incident ID..."
              class="w-full max-w-md px-4 py-2 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label for="perPage" class="text-gray-600 text-sm">Rows per page:</label>
            <select
              id="perPage"
              v-model="perPage"
              class="px-3 py-1 rounded-lg bg-white/70 text-gray-800 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </div>
        </div>
        <div class="text-sm text-gray-600">
          Last Updated: {{ lastUpdated }}
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="min-w-full border-collapse table-auto">
          <thead>
            <tr class="bg-white/70 backdrop-blur-md">
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Incident ID</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Timestamp</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Method</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Client IP</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Client Host</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Request URL</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Attack Type</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Confidence Score</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Outcome</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Response Time (ms)</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Prediction</th>
              <th class="border border-white/20 px-3 py-1 text-left text-blue-600 text-sm font-semibold">Matched Sample</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="request in filteredRequests"
              :key="request.incidentId"
              class="border-b border-white/20 even:bg-gray-100 odd:bg-white hover:bg-blue-50 transition-colors duration-200"
            >
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.incidentId }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.timestamp }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.method }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.clientIp }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.clientHost }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.requestUrl }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.attackType || '-' }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.confidenceScore || '-' }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.outcome || '-' }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.responseTimeMs || '-' }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.prediction || '-' }}</td>
              <td class="border border-white/20 px-3 py-1 text-teal-600 text-sm whitespace-nowrap">{{ request.matchedSample || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="monitoringData.currentPage === 1"
            class="px-4 py-2 rounded-lg bg-white/70 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Previous
          </button>
          <button
            v-for="pageNum in pageNumbers"
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="[
              'px-3 py-1 rounded-lg transition-colors duration-200',
              pageNum === monitoringData.currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white/70 text-blue-600 hover:bg-blue-600 hover:text-white'
            ]"
          >
            {{ pageNum }}
          </button>
          <button
            @click="nextPage"
            :disabled="monitoringData.currentPage === monitoringData.totalPages"
            class="px-4 py-2 rounded-lg bg-white/70 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Next
          </button>
        </div>
        <div class="text-gray-600 text-sm">
          Showing {{ filteredRequests.length }} of {{ monitoringData.totalCount }} entries
        </div>
      </div>

      <!-- Loading/Error States -->
      <div v-if="loading" class="text-center text-blue-600 mt-4">
        <p>Loading request data...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600 mt-4">
        <p>Error loading data: {{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import HeaderComponent from '../components/HeaderComponent.vue';

const MONITORING_QUERY = gql`
  query Monitoring($filter: String, $page: Int!, $perPage: Int!) {
    monitoring(filter: $filter, page: $page, perPage: $perPage) {
      totalCount
      page
      totalPages
      entries {
        timestamp
        incidentId
        method
        clientIp
        clientHost
        requestUrl
        attackType
        confidenceScore
        outcome
        responseTimeMs
        prediction
        matchedSample
      }
    }
  }
`;

export default defineComponent({
  name: 'MonitoringTab',
  components: {
    HeaderComponent
  },
  setup() {
    const activeTab = ref('all');
    const page = ref(1);
    const perPage = ref(10); // Default to 10 rows per page
    const searchIncidentId = ref('');
    const lastUpdated = ref(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));

    const { result, loading, error, refetch } = useQuery(
      MONITORING_QUERY,
      () => ({
        filter: activeTab.value === 'all' ? 'all' : 'malicious',
        page: page.value,
        perPage: perPage.value
      }),
      {
        pollInterval: 1000, // Poll every 1 second (1000 ms)
      }
    );

    const monitoringData = computed(() => ({
      entries: result.value?.monitoring?.entries || [],
      totalCount: result.value?.monitoring?.totalCount || 0,
      currentPage: result.value?.monitoring?.page || 1,
      totalPages: result.value?.monitoring?.totalPages || 1
    }));

    const filteredRequests = computed(() => {
      const entries = monitoringData.value.entries;
      if (!searchIncidentId.value) return entries;
      return entries.filter(request =>
        request.incidentId.toLowerCase() === searchIncidentId.value.toLowerCase()
      );
    });

    const pageNumbers = computed(() => {
      const total = monitoringData.value.totalPages;
      return Array.from({ length: total }, (_, i) => i + 1);
    });

    // Watch result for changes to update lastUpdated timestamp
    watch(result, (newResult) => {
      if (newResult) {
        lastUpdated.value = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
      }
    }, { immediate: true });

    const fetchData = () => {
      refetch({
        filter: activeTab.value === 'all' ? 'all' : 'malicious',
        page: page.value,
        perPage: perPage.value
      }).catch(err => console.error('Refetch Error:', err));
    };

    const previousPage = () => {
      if (page.value > 1) {
        page.value -= 1;
        fetchData();
      }
    };

    const nextPage = () => {
      if (page.value < monitoringData.value.totalPages) {
        page.value += 1;
        fetchData();
      }
    };

    const goToPage = (pageNum) => {
      page.value = pageNum;
      fetchData();
    };

    // Watch for changes in activeTab, search, or perPage to reset page and fetch data
    watch([activeTab, searchIncidentId, perPage], () => {
      page.value = 1; // Reset to first page on filter, search, or perPage change
      fetchData();
    });

    return {
      activeTab,
      page,
      perPage,
      searchIncidentId,
      monitoringData,
      filteredRequests,
      pageNumbers,
      loading,
      error,
      fetchData,
      previousPage,
      nextPage,
      goToPage,
      lastUpdated
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