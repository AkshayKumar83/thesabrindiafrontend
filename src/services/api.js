import axios from 'axios'
import API_BASE_URL from '../config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const request = async ({ method = 'get', url, data, params, ...config }) => {
  const response = await apiClient.request({ method, url, data, params, ...config })
  return response.data
}

export default apiClient
