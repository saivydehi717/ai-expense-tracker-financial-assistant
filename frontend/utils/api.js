import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
})

export const getTransactions = (params) => api.get('/expenses/', { params })
export const createTransaction = (data) => api.post('/expenses/', data)
export const deleteTransaction = (id) => api.delete(`/expenses/${id}`)
export const getSummary = () => api.get('/expenses/summary')
export const getCategoryAnalytics = () => api.get('/analytics/by-category')
export const getMonthlyTrends = () => api.get('/analytics/monthly')
export const getRecentTransactions = () => api.get('/analytics/recent')

// 👇 Add this line
export const getHealthScore = () => api.get('/analytics/health-score')

export const sendChatMessage = (message) => api.post('/chat/', { message })

export default api