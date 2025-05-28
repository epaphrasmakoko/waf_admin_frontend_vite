<template>
  <div class="p-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-600">
      <p>Loading dashboard data...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <p>Error loading data: {{ error.message }}</p>
    </div>
    <div v-else>
      <!-- Header and Metric Cards -->
      <h1 class="text-3xl font-bold text-gray-800 mb-10 text-left">Smart-WAF Dashboard</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div class="metric-card p-3 rounded-lg shadow-lg border border-gray-200">
          <h3 class="text-xs font-semibold text-gray-600">Total Requests</h3>
          <p class="text-base font-bold text-blue-600">{{ dashboard?.totalRequests || 0 }}</p>
        </div>
        <div class="metric-card p-3 rounded-lg shadow-lg border border-gray-200">
          <h3 class="text-base font-semibold text-gray-600">Total Sources (IPs)</h3>
          <p class="text-xl font-bold text-blue-600">{{ dashboard?.totalSources || 0 }}</p>
        </div>
        <div class="metric-card p-3 rounded-lg shadow-lg border border-gray-200">
          <h3 class="text-base font-semibold text-gray-600">Total Assets Protected</h3>
          <p class="text-xl font-bold text-blue-600">{{ dashboard?.totalAssetsProtected || 0 }}</p>
        </div>
        <div class="metric-card p-3 rounded-lg shadow-lg border border-gray-200">
          <h3 class="text-base font-semibold text-gray-600">Malicious Sources</h3>
          <p class="text-xl font-bold text-blue-600">{{ dashboard?.totalMaliciousSources || 0 }}</p>
        </div>
        <div class="metric-card p-3 rounded-lg shadow-lg border border-gray-200">
          <h3 class="text-base font-semibold text-gray-600">Blocked Attacks</h3>
          <p class="text-xl font-bold text-blue-600">{{ dashboard?.totalBlockedAttacks || 0 }}</p>
        </div>
      </div>

      <!-- Middle Section: Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Attack Types Pie Chart -->
        <div class="bg-white p-6 rounded-lg shadow-md h-64 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Attack Types</h3>
          <div v-if="attackTypesData.labels?.length">
            <PieChart :data="attackTypesData" :options="chartOptions" />
          </div>
          <p v-else class="text-gray-500">No attack types data available.</p>
        </div>
        <!-- Top 5 Attack Sources Bar Chart -->
        <div class="bg-white p-6 rounded-lg shadow-md h-64 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Top 5 Attack Sources</h3>
          <div v-if="topAttackSourcesData.labels?.length">
            <BarChart :data="topAttackSourcesData" :options="chartOptions" />
          </div>
          <p v-else class="text-gray-500">No attack sources data available.</p>
        </div>
        <!-- Timeline of Attacks Line Chart -->
        <div class="bg-white p-6 rounded-lg shadow-md h-64 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Timeline of Attacks</h3>
          <div class="flex items-center mb-4">
            <label for="timelineFilter" class="mr-2 text-gray-600">Filter:</label>
            <select id="timelineFilter" v-model="timelineFilter" @change="fetchDashboard" class="border rounded p-2">
              <option value="month">Last 30 Days</option>
              <option value="day">Last 24 Hours</option>
              <option value="4hours">Last 4 Hours</option>
              <option value="hour">Last Hour</option>
            </select>
          </div>
          <div v-if="attackTimelineData.labels?.length">
            <LineChart :data="attackTimelineData" :options="chartOptions" />
          </div>
          <p v-else class="text-gray-500">No timeline data available.</p>
        </div>
      </div>

      <!-- Bottom Section: Chart and Table -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Assets vs Number of Attacks Bar Chart -->
        <div class="bg-white p-6 rounded-lg shadow-md h-64 lg:col-span-1 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Assets vs Number of Attacks</h3>
          <div v-if="assetsVsAttacksData.labels?.length">
            <BarChart :data="assetsVsAttacksData" :options="chartOptions" />
          </div>
          <p v-else class="text-gray-500">No assets vs attacks data available.</p>
        </div>
        <!-- Assets Overview Table -->
        <div class="bg-white p-6 rounded-lg shadow-md lg:col-span-2 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Assets Overview</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border px-4 py-2 text-left text-gray-600">Domain</th>
                  <th class="border px-4 py-2 text-left text-gray-600">Total Requests</th>
                  <th class="border px-4 py-2 text-left text-gray-600">Attack Requests</th>
                  <th class="border px-4 py-2 text-left text-gray-600">Last Attacked</th>
                  <th class="border px-4 py-2 text-left text-gray-600">Attack Type Counts</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="asset in dashboard?.assetsOverview ?? []" :key="asset.clientHost" class="hover:bg-gray-50">
                  <td class="border px-4 py-2">{{ asset.clientHost }}</td>
                  <td class="border px-4 py-2">{{ asset.totalRequests }}</td>
                  <td class="border px-4 py-2">{{ asset.attackRequests }}</td>
                  <td class="border px-4 py-2">{{ asset.lastAttacked || '-' }}</td>
                  <td class="border px-4 py-2">{{ JSON.stringify(asset.attackTypeCounts) || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import { Pie, Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

const DASHBOARD_QUERY = gql`
  query Dashboard($filter: String) {
    dashboard(filter: $filter) {
      totalRequests
      totalSources
      totalAssetsProtected
      totalMaliciousSources
      totalBlockedAttacks
      attackTypes {
        attackType
        count
      }
      topAttackSources {
        clientIp
        count
      }
      attackTimeline {
        timeBucket
        count
      }
      assetsVsAttacks {
        clientHost
        count
      }
      assetsOverview {
        clientHost
        totalRequests
        attackRequests
        lastAttacked
        attackTypeCounts
      }
    }
  }
`;

export default defineComponent({
  name: 'WafDashboard',
  components: {
    PieChart: Pie,
    BarChart: Bar,
    LineChart: Line
  },
  setup() {
    const timelineFilter = ref('month');
    const { result, loading, error, refetch } = useQuery(DASHBOARD_QUERY, () => ({
      filter: timelineFilter.value
    }));

    const dashboard = computed(() => result.value?.dashboard);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { enabled: true }
      }
    };

    const attackTypesData = computed(() => {
      const labels = dashboard.value?.attackTypes?.map(item => item.attackType) || [];
      const data = dashboard.value?.attackTypes?.map(item => item.count) || [];
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      };
    });

    const topAttackSourcesData = computed(() => {
      const labels = dashboard.value?.topAttackSources?.map(item => item.clientIp) || [];
      const data = dashboard.value?.topAttackSources?.map(item => item.count) || [];
      return {
        labels,
        datasets: [{
          label: 'Attack Count',
          data,
          backgroundColor: '#36A2EB'
        }]
      };
    });

    const attackTimelineData = computed(() => {
      const labels = dashboard.value?.attackTimeline?.map(item => new Date(item.timeBucket).toLocaleString().split(',')[0]) || [];
      const data = dashboard.value?.attackTimeline?.map(item => item.count) || [];
      return {
        labels,
        datasets: [{
          label: 'Attacks',
          data,
          borderColor: '#36A2EB',
          fill: false
        }]
      };
    });

    const assetsVsAttacksData = computed(() => {
      const labels = dashboard.value?.assetsVsAttacks?.map(item => item.clientHost) || [];
      const data = dashboard.value?.assetsVsAttacks?.map(item => item.count) || [];
      return {
        labels,
        datasets: [{
          label: 'Number of Attacks',
          data,
          backgroundColor: '#FF6384'
        }]
      };
    });

    const fetchDashboard = () => {
      refetch({ filter: timelineFilter.value });
    };

    watch(dashboard, (newVal) => {
      console.log('Dashboard Updated:', newVal);
    });

    return {
      timelineFilter,
      dashboard,
      attackTypesData,
      topAttackSourcesData,
      attackTimelineData,
      assetsVsAttacksData,
      fetchDashboard,
      loading,
      error,
      chartOptions
    };
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  padding: 0 1rem; /* Keep some padding on sides */
}
/* Apply min-height only to chart sections, not metric cards */
.bg-white {
  background-color: white;
  min-height: 200px; /* Base min-height for smaller screens */
}
@media (min-width: 1024px) {
  .bg-white {
    min-height: 400px; /* Larger height for chart sections on larger screens */
  }
}
/* Metric cards should not inherit the min-height */
.metric-card {
  background-color: white;
  min-height: auto; /* Override any min-height */
}
</style>