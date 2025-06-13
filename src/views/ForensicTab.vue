<template>
  <div>
    <HeaderComponent />
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 mt-24 min-h-screen custom-scrollbar">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Forensic Analysis</h1>
      <div class="w-full bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30">
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Source IP</label>
            <input
              v-model="filters.sourceIp"
              type="text"
              placeholder="e.g., 192.168.1.1"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <div class="flex space-x-2">
              <input
                v-model="filters.startTime"
                type="datetime-local"
                class="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                v-model="filters.endTime"
                type="datetime-local"
                class="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Asset</label>
            <select
              v-model="filters.asset"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Assets</option>
              <option v-for="asset in assets" :key="asset.clientHost" :value="asset.clientHost">
                {{ asset.clientHost }} ({{ asset.targetHost }})
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Attacks Triggered</label>
            <select
              v-model="filters.attackType"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Requests</option>
              <option value="All Attacks">All Attacks</option>
              <option value="Command Injection">CMD</option>
              <option value="SQL Injection">SQLi</option>
              <option value="XSS">XSS</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">User Agents</label>
            <select
              v-model="filters.userAgent"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All</option>
              <option value="Mozilla">Mozilla</option>
              <option value="Android">Android</option>
              <option value="Nmap">Nmap</option>
              <option value="Sqlmap">Sqlmap</option>
              <option value="custom">Custom</option>
            </select>
            <input
              v-if="filters.userAgent === 'custom'"
              v-model="filters.customUserAgent"
              type="text"
              placeholder="Enter custom user agent"
              class="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div class="flex-1 flex items-end space-x-2">
            <button
              @click="fetchForensicData"
              class="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200"
              :disabled="loading"
            >
              {{ loading ? 'Loading...' : 'Apply Filters' }}
            </button>
            <button
              @click="generateReport"
              class="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200"
              :disabled="loading || !filtersApplied"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Show</label>
            <select
              v-model="perPage"
              @change="fetchForensicData"
              class="p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span class="text-sm text-gray-700">entries per page</span>
          </div>
          <div class="text-sm text-gray-700">
            Total Records: {{ totalCount }}
          </div>
        </div>
        <div v-if="loading" class="text-center text-blue-600 mt-4">Loading forensic data...</div>
        <div v-else-if="error" class="text-center text-red-600 mt-4">Error: {{ error.message }}</div>
        <div v-else-if="forensicData.length === 0 && filtersApplied" class="text-center text-gray-600 mt-4">No data found.</div>
        <div v-else-if="forensicData.length > 0" class="mt-6 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 border-b">Incident ID</th>
                <th class="p-2 border-b">Timestamp</th>
                <th class="p-2 border-b">Method</th>
                <th class="p-2 border-b">Client IP</th>
                <th class="p-2 border-b">User Agent</th>
                <th class="p-2 border-b">Client Host</th>
                <th class="p-2 border-b">Target Host</th>
                <th class="p-2 border-b">Request URL</th>
                <th class="p-2 border-b">Path</th>
                <th class="p-2 border-b">Query</th>
                <th class="p-2 border-b">Form Data</th>
                <th class="p-2 border-b">Attack Type</th>
                <th class="p-2 border-b">Confidence Score</th>
                <th class="p-2 border-b">HTTP Status</th>
                <th class="p-2 border-b">Outcome</th>
                <th class="p-2 border-b">Response Time (ms)</th>
                <th class="p-2 border-b">Inputs</th>
                <th class="p-2 border-b">Matched Sample</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in forensicData" :key="entry.incidentId" class="border-b hover:bg-gray-50">
                <td class="p-2">{{ entry.incidentId }}</td>
                <td class="p-2">{{ entry.timestamp }}</td>
                <td class="p-2">{{ entry.method }}</td>
                <td class="p-2">{{ entry.clientIp }}</td>
                <td class="p-2">{{ entry.userAgent }}</td>
                <td class="p-2">{{ entry.clientHost }}</td>
                <td class="p-2">{{ entry.targetHost }}</td>
                <td class="p-2">{{ entry.requestUrl }}</td>
                <td class="p-2">{{ entry.path }}</td>
                <td class="p-2">{{ entry.query || '-' }}</td>
                <td class="p-2">
                  <span v-if="entry.formData && Object.keys(entry.formData).length > 0">
                    {{ formatFormData(entry.formData) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="p-2">{{ entry.attackType }}</td>
                <td class="p-2">{{ entry.confidenceScore }}</td>
                <td class="p-2">{{ entry.httpStatus }}</td>
                <td class="p-2">{{ entry.outcome }}</td>
                <td class="p-2">{{ entry.responseTimeMs }}</td>
                <td class="p-2">
                  <ul v-if="entry.inputs && entry.inputs.length > 0" class="list-disc list-inside">
                    <li v-for="input in entry.inputs" :key="input.id">
                      Value: {{ input.value }} (Prediction: {{ input.prediction }})
                    </li>
                  </ul>
                  <span v-else>-</span>
                </td>
                <td class="p-2">{{ entry.matchedSample || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-700">
              Showing page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="flex space-x-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div v-if="reportGenerated" class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
          <p>{{ reportMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import HeaderComponent from '../components/HeaderComponent.vue'

const FORENSIC_QUERY = gql`
  query ForensicData(
    $sourceIp: String
    $startTime: DateTime
    $endTime: DateTime
    $asset: String
    $attackType: String
    $userAgent: String
    $page: Int
    $perPage: Int
  ) {
    forensicData(
      sourceIp: $sourceIp
      startTime: $startTime
      endTime: $endTime
      asset: $asset
      attackType: $attackType
      userAgent: $userAgent
      page: $page
      perPage: $perPage
    ) {
      entries {
        incidentId
        timestamp
        method
        clientIp
        userAgent
        clientHost
        targetHost
        requestUrl
        path
        query
        formData
        attackType
        confidenceScore
        httpStatus
        outcome
        responseTimeMs
        inputs {
          value
          length
          prediction
          scoreXss
          scoreCmd
        }
        matchedSample
      }
      totalCount
      page
      totalPages
    }
  }
`

const ASSETS_QUERY = gql`
  query Assets {
    assets {
      clientHost
      targetHost
    }
  }
`

const GENERATE_REPORT_MUTATION = gql`
  mutation GenerateForensicReport(
    $sourceIp: String
    $startTime: DateTime
    $endTime: DateTime
    $asset: String
    $attackType: String
    $userAgent: String
    $indicatorsOfCompromise: JSONString
  ) {
    generateForensicReport(
      sourceIp: $sourceIp
      startTime: $startTime
      endTime: $endTime
      asset: $asset
      attackType: $attackType
      userAgent: $userAgent
      indicatorsOfCompromise: $indicatorsOfCompromise
    ) {
      success
      message
      pdfContent
    }
  }
`

export default {
  name: 'ForensicTab',
  components: { HeaderComponent },
  setup() {
    const filters = ref({
      sourceIp: '',
      startTime: '',
      endTime: '',
      asset: '',
      attackType: '',
      userAgent: '',
      customUserAgent: ''
    })
    const loading = ref(false)
    const error = ref(null)
    const forensicData = ref([])
    const filtersApplied = ref(false)
    const queryVariables = ref({})
    const currentPage = ref(1)
    const perPage = ref(10)
    const totalCount = ref(0)
    const totalPages = ref(1)
    const reportGenerated = ref(false)
    const reportMessage = ref('')

    const { result: assetsResult } = useQuery(ASSETS_QUERY)
    const assets = ref([])
    watch(assetsResult, () => {
      assets.value = assetsResult.value?.assets || []
    })

    const { result, loading: queryLoading, error: queryError, refetch } = useQuery(
      FORENSIC_QUERY,
      queryVariables,
      { fetchPolicy: 'network-only' }
    )

    const { mutate: generateReportMutation } = useMutation(GENERATE_REPORT_MUTATION, {
      update: (cache, { data }) => {
        console.log('Mutation update received:', data)
      },
      onError: (error) => {
        console.error('Mutation failed:', error)
        if (error.networkError) {
          console.log('Network Error Response:', error.networkError.response)
          console.log('Network Error Text:', error.networkError.result)
        }
      },
      onDone: ({ data, errors }) => {
        console.log('Mutation completed:', { data, errors })
      },
    })

    const indicatorsOfCompromise = computed(() => {
      console.log('Computing IOCs with forensicData length:', forensicData.value.length)
      const iocs = {
        maliciousIpAddresses: new Set(),
        payloadSignatures: new Set(),
        targetedUrls: new Set(),
        userAgents: new Set()
      }

      if (forensicData.value.length === 0) {
        console.warn('No forensic data available for IOC computation')
        return iocs
      }

      forensicData.value.forEach(entry => {
        if (entry.clientIp) iocs.maliciousIpAddresses.add(entry.clientIp)
        if (entry.requestUrl) iocs.targetedUrls.add(entry.requestUrl.split('?')[0])
        if (entry.userAgent) iocs.userAgents.add(entry.userAgent)
        if (entry.inputs && entry.inputs.length > 0) {
          entry.inputs.forEach(input => {
            if (input.scoreXss > 0.1 || input.scoreCmd > 0.1) {
              iocs.payloadSignatures.add(input.value || 'unknown payload')
            }
          })
        }
      })

      return {
        maliciousIpAddresses: Array.from(iocs.maliciousIpAddresses),
        payloadSignatures: Array.from(iocs.payloadSignatures),
        targetedUrls: Array.from(iocs.targetedUrls),
        userAgents: Array.from(iocs.userAgents)
      }
    })

    const fetchForensicData = async () => {
      loading.value = true
      error.value = null
      filtersApplied.value = true
      try {
        queryVariables.value = {
          sourceIp: filters.value.sourceIp || undefined,
          startTime: filters.value.startTime ? new Date(filters.value.startTime).toISOString() : undefined,
          endTime: filters.value.endTime ? new Date(filters.value.endTime).toISOString() : undefined,
          asset: filters.value.asset || undefined,
          attackType: filters.value.attackType || undefined,
          userAgent: filters.value.userAgent === 'custom' ? filters.value.customUserAgent : filters.value.userAgent || undefined,
          page: currentPage.value,
          perPage: perPage.value
        }
        console.log('Fetching forensic data with variables:', queryVariables.value)
        await refetch(queryVariables.value)
        forensicData.value = result?.value?.forensicData?.entries || []
        totalCount.value = result?.value?.forensicData?.totalCount || 0
        currentPage.value = result?.value?.forensicData?.page || 1
        totalPages.value = result?.value?.forensicData?.totalPages || 1
      } catch (e) {
        console.error('Error fetching forensic data:', e)
        error.value = e
        forensicData.value = []
        totalCount.value = 0
        totalPages.value = 1
      } finally {
        loading.value = false
      }
    }

    const generateReport = async () => {
      loading.value = true
      reportGenerated.value = false
      reportMessage.value = ''

      try {
        console.log('Current filters state at generateReport:', filters.value)

        const iocs = indicatorsOfCompromise.value
        const iocsString = JSON.stringify(iocs) || '{}'
        console.log('Computed IOCs:', iocs)
        console.log('Stringified IOCs sent to mutation:', iocsString)

        const variables = {
          sourceIp: filters.value.sourceIp || undefined,
          startTime: filters.value.startTime ? new Date(filters.value.startTime).toISOString() : undefined,
          endTime: filters.value.endTime ? new Date(filters.value.endTime).toISOString() : undefined,
          asset: filters.value.asset || undefined,
          attackType: filters.value.attackType || undefined,
          userAgent: filters.value.userAgent === 'custom' ? filters.value.customUserAgent || undefined : filters.value.userAgent || undefined,
          indicatorsOfCompromise: iocsString
        }

        console.log('Variables sent to mutation, including IOCs:', variables)

        const response = await generateReportMutation(variables)

        const data = response?.data
        if (data?.generateForensicReport?.success) {
          reportMessage.value = data.generateForensicReport.message
          reportGenerated.value = true

          if (data.generateForensicReport.pdfContent) {
            const binaryString = window.atob(data.generateForensicReport.pdfContent)
            const len = binaryString.length
            const bytes = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }

            const blob = new Blob([bytes], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `SmartWAF-forensic_report_${new Date().toISOString().split('T')[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }
        } else {
          reportMessage.value = data?.generateForensicReport?.message || 'Report generation failed'
          reportGenerated.value = false
        }
      } catch (e) {
        console.error('Error generating report:', e)
        if (e.networkError) {
          console.log('Network Error Response:', e.networkError.response)
          console.log('Network Error Text:', e.networkError.result)
        }
        reportMessage.value = `Error generating report: ${e.message}`
        reportGenerated.value = false
      } finally {
        loading.value = false
      }
    }

    watch(currentPage, () => {
      fetchForensicData()
    })

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++
    }

    const formatFormData = (formData) => {
      if (!formData || typeof formData !== 'object') return '-'
      return Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    }

    return {
      filters, assets, loading, error, forensicData, filtersApplied, fetchForensicData,
      formatFormData, currentPage, perPage, totalCount, totalPages, prevPage, nextPage,
      generateReport, reportGenerated, reportMessage
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #14b8a6); border-radius: 10px; border: 1px solid #e5e7eb; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #3b82f6 #e5e7eb; }
</style>