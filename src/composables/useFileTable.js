import { ref, unref, watch } from 'vue'

export function useFileTable() {
  const tableHeaders = ref([])
  const tableData = ref([])
  const columnOptions = ref([])
  const dSets = ref([])

  // Call to format and set the table headers
  const setHeaders = (headers) => {
    tableHeaders.value = []
    headers.forEach((header, index) => {
      const prefix = 'column-'

      tableHeaders.value.push({
        key: header,
        dataKey: header,
        title: header,
        width: 150,
      })
    })
  }

  // Call to set and format the data that the table will show
  const setTableData = (headers, datasets) => {
    // reset table data
    tableData.value = []
    datasets.forEach((dataItem) => {
      // looping over datasets
      // we need to loop over each set and set the header value
      const newDataItem = {}
      dataItem.map((item, index) => {
        const header = headers[index]
        newDataItem[header.dataKey] = item
      })
      console.log({ newDataItem })
      tableData.value.push(newDataItem)
    })
  }

  // This call is used to set the internal 'dSets'
  // which is watch when this value changes and updates the table data
  const setDatasets = (datasets) => {
    dSets.value = datasets
  }

  // This is the callback that the watcher uses to update the table data
  const createTable = (datasets) => {
    const headers = datasets.shift()
    columnOptions.value = headers
    setHeaders(headers)
    setTableData(tableHeaders.value, datasets)
  }

  // This is the method used to clear the table data and column options
  const clearTable = () => {
    tableData.value = []
    tableHeaders.value = []
    columnOptions.value = []
  }

  // Start watching the dSets value for changes
  // and update the table when a change occurs
  watch(dSets, createTable)

  return {
    setDatasets,
    clearTable,
    tableHeaders,
    tableData,
    columnOptions,
  }
}
