import axios from "axios"
import instance from './filter'
export const getImages = async () => {
    // http:localhost/api/getimages   =>   /api
    return axios.get("/json/data.json")
}
export const getImages2 = async () => {
    return instance.get("222/json/data.json")
}