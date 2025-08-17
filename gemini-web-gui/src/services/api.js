// API service for communicating with the Flask backend
const API_BASE_URL = '/api/gemini'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async authenticate(authData) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify(authData),
    })
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    })
  }

  async getStatus() {
    return this.request('/status')
  }

  // Chat methods
  async sendMessage(message, files = []) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        files,
      }),
    })
  }

  // File methods
  async uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  async listFiles() {
    return this.request('/files')
  }

  // Commands
  async getCommands() {
    return this.request('/commands')
  }
}

export const apiService = new ApiService()
export default apiService

