import axios from 'axios'

// This is a general file for all axios api calls

const appApi = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
})

// This is the response for all api successful responses
const apiSuccessResponse = (statusCode, data) => {
  return { status: 'success', statusCode, data: data.data, originalData: data }
}

// This is the response for all api error responses
const apiErrorResponse = (data, statusCode, message) => {
  return { status: 'error', statusCode, message, originalData: data }
}

const handleError = (error) => {
  if (error.response) {
    const response = error.response
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return apiErrorResponse(response.status, response.data.message)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return apiErrorResponse(error, 500, 'Request was made, but response may of timed out')
  } else {
    // Something happened in setting up the request that triggered an Error
    return apiErrorResponse(error, 500, error.message)
  }
}

const apiGet = async (url, config) => {
  try {
    const axiosConfig = config ? config : {}
    const res = await appApi.get(url, axiosConfig)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err
    return handleError(axiosError)
  }
}

const apiPost = async (url, data, config) => {
  try {
    const axiosConfig = config ? config : {}
    const res = await appApi.post(url, data, axiosConfig)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err
    return handleError(axiosError)
  }
}

const apiDelete = async (url, config) => {
  try {
    const axiosConfig = config ? config : {}
    const res = await appApi.delete(url, axiosConfig)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err
    return handleError(axiosError)
  }
}

const apiPatch = async (url, data, config) => {
  try {
    const axiosConfig = config ? config : {}
    const res = await appApi.patch(url, data, axiosConfig)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err
    return handleError(axiosError)
  }
}

export { appApi, apiGet, apiPost, apiPatch, apiDelete }
