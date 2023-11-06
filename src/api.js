import axios from "axios";

const showAPI = axios.create({
    baseURL: 'https://api.tvmaze.com/shows'
})

export function getShowCharacters() {
    return showAPI.get('/7/cast')
}