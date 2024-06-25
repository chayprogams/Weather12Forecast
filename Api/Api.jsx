import axios from "axios";
const forecastEndPoint = params => `https://api.weatherapi.com/v1/forecast.json?key=ee056251ae184980b2855647242306&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=ee056251ae184980b2855647242306&q=${params.cityName}`
export const trigger = async(endpoint) => {
    const options = {
        method:'GET',
        url:endpoint
    }
    try {
    const response = await axios.request(options)
    return response.data
    } catch (error) {
        return error;
    }
    
}
export const forcastendpoint = params => {
    return trigger(forecastEndPoint(params))
}
export const localendpoint = params => {
    return trigger(locationEndPoint(params))
}
