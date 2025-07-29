
// export const getAIMessage = async (userQuery) => {

//   const message = 
//     {
//       role: "assistant",
//       content: "Connect your backend here...."
//     }

//   return message;
// };


// API configuration
const API_BASE_URL = 'http://localhost:8000';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Main function that your ChatWindow.js calls
export const getAIMessage = async (userQuery) => {
  try {
    // Call your Python FastAPI backend
    const response = await apiRequest('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: userQuery
      })
    });

    // Return in the format your ChatWindow expects
    return {
      role: "assistant",
      content: response.response,
      // Additional data that you can use to enhance the UI
      partSuggestions: response.part_suggestions,
      sources: response.sources
    };

  } catch (error) {
    // Return error message in case of failure
    return {
      role: "assistant",
      content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
    };
  }
};

// Additional API functions you can use
export const checkCompatibility = async (partNumber, modelNumber) => {
  try {
    const response = await apiRequest('/api/compatibility', {
      method: 'POST',
      body: JSON.stringify({
        part_number: partNumber,
        model_number: modelNumber
      })
    });
    return response;
  } catch (error) {
    console.error('Compatibility check failed:', error);
    throw error;
  }
};

export const searchProducts = async (searchQuery, category = null) => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category) params.append('category', category);
    
    const response = await apiRequest(`/api/products?${params.toString()}`);
    return response.products;
  } catch (error) {
    console.error('Product search failed:', error);
    throw error;
  }
};

// Health check function to test backend connection
export const checkBackendHealth = async () => {
  try {
    const response = await apiRequest('/health');
    return response.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};