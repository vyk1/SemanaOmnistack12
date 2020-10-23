import axios from "axios"
import host from '../services/host'

const api = axios.create({
    baseURL: `${host}`
})

export default api