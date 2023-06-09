// Used to only return the leading integer value
// It will not return a value if it is not a number or if it is ze
const getLeadingDigit = (data, selectedColumn) => {
  const values = []

  data.forEach((item) => {
    const firstDigit = item[selectedColumn]?.charAt(0)
    if (firstDigit) {
      const res = firstDigit * 1
      if (!isNaN(res) && res !== 0) {
        values.push(res)
      }
    }
  })
  return values
}

// This method is used to aggregate and format a return
// ex: [6, 2, 2] => {2: 2, 6: 1}
const mapCounts = (arrOfValues) => {
  const counts = {}
  for (const num of arrOfValues) {
    counts[num] = counts[num] ? counts[num] + 1 : 1
  }
  return counts
}

// This is to get the observed values without a percentage
// formula: observe = observe value / total leading digit values
const getObserveValues = (values) => {
  const mapCountsObj = mapCounts(values)
  const total = values.length
  const oberveArr = []
  for (let i = 0; i < 9; i++) {
    let observe = 0
    if (mapCountsObj[i + 1]) {
      observe = mapCountsObj[i + 1] / total
    }
    oberveArr.push(observe)
  }
  return oberveArr
}

// This returns the observed values with percentage values
const generateUserPlots = (values) => {
  return [...getObserveValues(values)].map((observed) => (observed * 100).toFixed(1))
}

export { getLeadingDigit, generateUserPlots, getObserveValues }
