import apiClient from './api'

const reportsService = {
  getReports: async (filters = {}) => {
    const response = await apiClient.get('/reports', { params: filters })
    return response.data
  },
  getReportSeries: async (reportId) => {
    const response = await apiClient.get(`/reports/${encodeURIComponent(reportId)}/timeseries`)
    return response.data
  },
}

export default reportsService
