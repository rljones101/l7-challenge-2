import { apiPost } from '@/utils/ApiUtils'

// This file is used to wrap all API calls that might be need for this service
// Easier to re-use and make a change in one place if needed
const getChiSquareTestResults = async (observed) => {
  try {
    return await apiPost('/chiSquareTest', { observed })
  } catch (err) {
    console.error(err)
  }
}

export { getChiSquareTestResults }
