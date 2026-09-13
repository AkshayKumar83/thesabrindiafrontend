import axios from 'axios'
import API_BASE_URL from '../config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const request = async ({ method = 'get', url, data, params, ...config }) => {
  const requestConfig = { method, url, data, params, ...config }

  if (data instanceof FormData) {
    requestConfig.headers = {
      ...requestConfig.headers,
      'Content-Type': undefined,
      'content-type': undefined,
    }
  }

  const response = await apiClient.request(requestConfig)
  return response.data
}

export default apiClient
