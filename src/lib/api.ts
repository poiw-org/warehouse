import axios from "axios"
const domain = process.env.NODE_ENV == 'production' ? 'https://warehouse-api.poiw.org' : 'http://localhost:3001'

export default {

    async get(endpoint: string, params?: any): Promise<any> {
        return await axios.get(domain+endpoint, params)
    },

    async post(endpoint: string, params?: any, config?: any): Promise<any> {
        return await axios.post(domain+endpoint, params, config)
    },

    async patch(endpoint: string, params?: any, config?: any): Promise<any> {
        return await axios.patch(domain+endpoint, params,config)
    },
    async delete(endpoint: string, params?: any): Promise<any> {
        return await axios.delete(domain+endpoint, params)
    },
    async put(endpoint: string, params?: any): Promise<any> {
        return await axios.put(domain+endpoint, params)
    }
}