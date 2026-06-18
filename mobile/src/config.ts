const API_URL = process.env.EXPO_PUBLIC_API_URL || (
    process.env.NODE_ENV === 'production'
        ? ""
        : "http://10.115.169.105:5000/api"
)

export default API_URL
