<template>
  <div>
    <HeaderComponent />
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 mt-24 min-h-screen custom-scrollbar">
      <!-- Loading State -->
      <div v-if="loading" class="text-center text-blue-600">
        <p>Loading dashboard data...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600">
        <p>Error loading data: {{ error.message }}</p>
      </div>
      <div v-else>
        <!-- Header, Last Updated, and Metric Cards -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-blue-600">WAF Dashboard</h1>
          <div class="text-sm text-gray-600">
            Last Updated: {{ lastUpdated }}
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div class="metric-card bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 flex flex-col items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h18M3 17h18M3 21h18"></path></svg>
            <h3 class="text-sm font-semibold text-blue-600 text-center mb-1">Total Requests</h3>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ dashboard?.totalRequests || 0 }}</p>
            <p class="text-xs text-gray-500">+5% (Last 24h)</p>
          </div>
          <div class="metric-card bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 flex flex-col items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <h3 class="text-sm font-semibold text-blue-600 text-center mb-1">Total Sources (IPs)</h3>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ dashboard?.totalSources || 0 }}</p>
            <p class="text-xs text-gray-500">+3% (Last 24h)</p>
          </div>
          <div class="metric-card bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 flex flex-col items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h2a2 2 0 002-2v-6"></path></svg>
            <h3 class="text-sm font-semibold text-blue-600 text-center mb-1">Total Assets Protected</h3>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ dashboard?.totalAssetsProtected || 0 }}</p>
            <p class="text-xs text-gray-500">+2% (Last 24h)</p>
          </div>
          <div class="metric-card bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 flex flex-col items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-sm font-semibold text-blue-600 text-center mb-1">Malicious Sources</h3>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ dashboard?.totalMaliciousSources || 0 }}</p>
            <p class="text-xs text-gray-500">+10% (Last 24h)</p>
          </div>
          <div class="metric-card bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 flex flex-col items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-sm font-semibold text-blue-600 text-center mb-1">Blocked Attacks</h3>
            <p class="text-2xl font-bold text-teal-600 mb-1">{{ dashboard?.totalBlockedAttacks || 0 }}</p>
            <p class="text-xs text-gray-500">+8% (Last 24h)</p>
          </div>
        </div>

        <!-- Middle Section: Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <!-- Attack Types Pie Chart -->
          <div class="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 chart-container">
            <h3 class="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1013 2v1a8.001 8.001 0 00-6.977 12.703 6.985 6.985 0 01-1.879 2.903A7.003 7.003 0 0113 22a6.983 6.983 0 004.093-1.228A6.985 6.985 0 0119 16.703C19.747 16.035 20 15.172 20 14a8.001 8.001 0 00-2-5.555M2 14l6 6m0 0l6-6m-6 6V2"></path></svg>
              <span>Attack Types</span>
            </h3>
            <div v-if="attackTypesData.labels?.length" class="animate-fade-in">
              <PieChart :data="attackTypesData" :options="chartOptions" />
            </div>
            <p v-else class="text-gray-500">No attack types data available.</p>
          </div>
          <!-- Top 5 Attack Sources Bar Chart -->
          <div class="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 chart-container">
            <h3 class="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
              <span>Top 5 Attack Sources</span>
            </h3>
            <div v-if="topAttackSourcesData.labels?.length" class="animate-fade-in">
              <BarChart :data="topAttackSourcesData" :options="chartOptions" />
            </div>
            <p v-else class="text-gray-500">No attack sources data available.</p>
          </div>
          <!-- Timeline of Attacks Line Chart -->
          <div class="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 chart-container">
            <h3 class="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Timeline of Attacks</span>
            </h3>
            <div class="flex items-center mb-4 space-x-2">
              <label for="timelineFilter" class="text-blue-600">Filter:</label>
              <select id="timelineFilter" v-model="timelineFilter" @change="fetchDashboard" class="bg-white/60 backdrop-blur-md text-gray-800 border border-white/20 rounded-2xl p-2 focus:ring-2 focus:ring-blue-500">
                <option value="month">Last 30 Days</option>
                <option value="day">Last 24 Hours</option>
                <option value="4hours">Last 4 Hours</option>
                <option value="hour">Last Hour</option>
              </select>
            </div>
            <div v-if="attackTimelineData.labels?.length" class="animate-fade-in">
              <LineChart :data="attackTimelineData" :options="chartOptions" />
            </div>
            <p v-else class="text-gray-500">No timeline data available.</p>
          </div>
        </div>

        <!-- Bottom Section: Chart and Table -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Assets vs Number of Attacks Bar Chart -->
          <div class="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 lg:col-span-1 chart-container">
            <h3 class="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Assets vs Number of Attacks</span>
            </h3>
            <div v-if="assetsVsAttacksData.labels?.length" class="animate-fade-in">
              <BarChart :data="assetsVsAttacksData" :options="chartOptions" />
            </div>
            <p v-else class="text-gray-500">No assets vs attacks data available.</p>
          </div>
          <!-- Assets Overview Table -->
          <div class="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 transition-all duration-300 lg:col-span-2">
            <h3 class="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"></path></svg>
              <span>Assets Overview</span>
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr class="bg-white/70 backdrop-blur-md">
                    <th class="border border-white/20 px-4 py-2 text-left text-blue-600">
                      <span class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-18 0l9 5 9-5"></path></svg>
                        <span>Domain</span>
                      </span>
                    </th>
                    <th class="border border-white/20 px-4 py-2 text-left text-blue-600">
                      <span class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h18M3 17h18M3 21h18"></path></svg>
                        <span>Total Requests</span>
                      </span>
                    </th>
                    <th class="border border-white/20 px-4 py-2 text-left text-blue-600">
                      <span class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Attack Requests</span>
                      </span>
                    </th>
                    <th class="border border-white/20 px-4 py-2 text-left text-blue-600">
                      <span class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Last Attacked</span>
                      </span>
                    </th>
                    <th class="border border-white/20 px-4 py-2 text-left text-blue-600">
                      <span class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>Attack Type Counts</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="asset in dashboard?.assetsOverview ?? []" :key="asset.clientHost" class="hover:bg-white/10 border-b border-white/20">
                    <td class="border border-white/20 px-4 py-2 text-teal-600">{{ asset.clientHost }}</td>
                    <td class="border border-white/20 px-4 py-2 text-teal-600">{{ asset.totalRequests }}</td>
                    <td class="border border-white/20 px-4 py-2 text-teal-600">{{ asset.attackRequests }}</td>
                    <td class="border border-white/20 px-4 py-2 text-teal-600">{{ asset.lastAttacked || '-' }}</td>
                    <td class="border border-white/20 px-4 py-2 text-teal-600">{{ formatAttackTypes(asset.attackTypeCounts) || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
import HeaderComponent from '../components/HeaderComponent.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

const DASHBOARD_QUERY = gql`
  query Dashboard($filter: String, $timeRange: String) {
    dashboard(filter: $filter, timeRange: $timeRange) {
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
    LineChart: Line,
    HeaderComponent
  },
  setup() {
    const timelineFilter = ref('month');
    const lastUpdated = ref(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));

    const { result, loading, error, refetch } = useQuery(
      DASHBOARD_QUERY,
      () => ({
        filter: timelineFilter.value,
        timeRange: timelineFilter.value // Pass the filter as the time range
      }),
      {
        pollInterval: 1000, // Poll every 1 second (1000 ms)
      }
    );

    const dashboard = computed(() => {
      const data = result.value?.dashboard;
      console.log('Dashboard Data:', data); // Debug log
      return data || {};
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: { 
            color: '#1F2937',
            font: {
              size: 14,
              weight: 'bold',
              family: "'Inter', sans-serif"
            }
          }
        },
        tooltip: { 
          bodyColor: '#1F2937',
          titleColor: '#0F766E',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          borderWidth: 1,
          padding: 10
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad'
      }
    };

    const attackTypesData = computed(() => {
      const labels = dashboard.value?.attackTypes?.map(item => item.attackType) || [];
      const data = dashboard.value?.attackTypes?.map(item => item.count) || [];
      console.log('Attack Types Data:', { labels, data }); // Debug log
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#2563EB', '#0F766E', '#60A5FA'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 10
        }]
      };
    });

    const topAttackSourcesData = computed(() => {
      const labels = dashboard.value?.topAttackSources?.map(item => item.clientIp) || [];
      const data = dashboard.value?.topAttackSources?.map(item => item.count) || [];
      console.log('Top Attack Sources Data:', { labels, data }); // Debug log
      return {
        labels,
        datasets: [{
          label: 'Attack Count',
          data,
          backgroundColor: '#0F766E',
          borderColor: '#ffffff',
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: '#6EE7B7'
        }]
      };
    });

    // Existing attackTimelineData computed property (for reference)
    const attackTimelineData = computed(() => {
      const now = new Date(); // 04:52 PM EAT on June 05, 2025
      const labels = [];
      const data = dashboard.value?.attackTimeline?.map(item => item.count) || [];
      const timeBuckets = dashboard.value?.attackTimeline?.map(item => new Date(item.timeBucket)) || [];

      const intervalMinutes = {
        'hour': 3,    // 3-minute intervals for 1 hour (20 points)
        '4hours': 15, // 15-minute intervals for 4 hours (16 points)
        'day': 60,    // 1-hour intervals for 24 hours (24 points)
        'month': 1440 // 1-day intervals for 30 days (30 points)
      }[timelineFilter.value] || 1440;

      const totalPoints = {
        'hour': 20,   // 60 minutes / 3 = 20 points
        '4hours': 16, // 240 minutes / 15 = 16 points
        'day': 24,    // 24 hours = 24 points
        'month': 30   // 30 days = 30 points
      }[timelineFilter.value] || 30;

      const totalMinutes = intervalMinutes * (totalPoints - 1);
      for (let i = totalMinutes; i >= 0; i -= intervalMinutes) {
        const time = new Date(now - i * 60 * 1000);
        if (timelineFilter.value === 'month') {
          labels.push(time.toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi', month: '2-digit', day: '2-digit' }));
        } else {
          labels.push(time.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' }));
        }
      }

      const alignedData = new Array(labels.length).fill(0);
      timeBuckets.forEach((bucket, index) => {
        let bucketLabel;
        if (timelineFilter.value === 'month') {
          bucketLabel = bucket.toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi', month: '2-digit', day: '2-digit' });
        } else {
          bucketLabel = bucket.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' });
        }

        let dataIndex = labels.indexOf(bucketLabel);
        if (dataIndex === -1) {
          const bucketTime = bucket.getTime();
          for (let i = 0; i < labels.length; i++) {
            const labelTime = new Date(now - i * intervalMinutes * 60 * 1000).getTime();
            const nextLabelTime = i === 0 ? now.getTime() : new Date(now - (i - 1) * intervalMinutes * 60 * 1000).getTime();
            if (bucketTime >= labelTime && bucketTime <= nextLabelTime) {
              dataIndex = labels.length - 1 - i;
              break;
            }
          }
        }

        if (dataIndex !== -1) {
          alignedData[dataIndex] += data[index] || 0;
        }
      });

      console.log('Attack Timeline Data:', { labels, data: alignedData }); // Debug log
      return {
        labels,
        datasets: [{
          label: 'Attacks',
          data: alignedData,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      };
    });

    const assetsVsAttacksData = computed(() => {
      const labels = dashboard.value?.assetsVsAttacks?.map(item => item.clientHost) || [];
      const data = dashboard.value?.assetsVsAttacks?.map(item => item.count) || [];
      console.log('Assets vs Attacks Data:', { labels, data }); // Debug log
      return {
        labels,
        datasets: [{
          label: 'Number of Attacks',
          data,
          backgroundColor: '#7C3AED',
          borderColor: '#ffffff',
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: '#C4B5FD'
        }]
      };
    });

    const fetchDashboard = () => {
      console.log('Fetching data with filter:', timelineFilter.value); // Debug log
      refetch({ filter: timelineFilter.value, timeRange: timelineFilter.value }).catch(err => console.error('Refetch Error:', err));
    };

    const formatAttackTypes = (attackTypes) => {
      console.log('Attack Type Counts (Raw):', attackTypes); // Debug raw input
      let parsedTypes = attackTypes;
      
      // If attackTypes is a string, parse it into an object
      if (typeof attackTypes === 'string') {
        try {
          parsedTypes = JSON.parse(attackTypes);
          console.log('Attack Type Counts (Parsed):', parsedTypes); // Debug parsed data
        } catch (e) {
          console.error('Error parsing attackTypes:', e);
          return '-';
        }
      }

      // Now check if parsedTypes is an object and has entries
      if (!parsedTypes || typeof parsedTypes !== 'object' || Object.keys(parsedTypes).length === 0) {
        return '-';
      }

      return Object.entries(parsedTypes)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
    };

    // Watch result for changes to update lastUpdated timestamp
    watch(result, (newResult) => {
      if (newResult) {
        lastUpdated.value = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
      }
    }, { immediate: true });

    watch(timelineFilter, () => {
      fetchDashboard();
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
      chartOptions,
      formatAttackTypes,
      lastUpdated
    };
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  padding: 0 1rem;
}
.bg-white {
  background-color: transparent;
}
.metric-card {
  background-color: transparent;
  min-height: 150px;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Chart Container */
.chart-container {
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Fade-in Animation */
.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
</style>