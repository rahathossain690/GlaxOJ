
const data = {
    BACKEND_URL : 'https://glaxoj-backend.herokuapp.com',
    FRONTEND_URL: 'https://glaxoj.herokuapp.com',
    PAGINATION: 50,
    BACKEND_AUTHENTICATION_URL: 'https://glaxoj-backend.herokuapp.com/auth/google'
}

const dataLocal = {
    BACKEND_URL : 'http://localhost:3000',
    FRONTEND_URL: 'http://localhost:3001',
    PAGINATION: 50,
    BACKEND_AUTHENTICATION_URL: 'http://localhost:3000/auth/google'
}

module.exports = (process.env.NODE_ENV === 'development' ? dataLocal : data);