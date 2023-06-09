<script setup>
// Challenge: Benford's Law
// DONE - 1)
// Can ingest the attached example file (census_2009b) and any other flat file with a viable target column.
// Note that other columns in user-submitted files may or may not be the same as the census data file and users are
// known for submitting files that don't always conform to rigid expectations. How you deal with files that don't
// conform to the expectations of the application is up to you, but should be reasonable and defensible.

// DONE - 2)
// validates Benford’s assertion based on the '7_2009' column in the supplied file

// DONE - 3)
// Outputs back to the user a graph of the observed distribution of numbers with an overlay of the expected distribution
// of numbers.

// DONE - 4)
// The output should also inform the user of whether the observed data matches the expected data distribution.

// 5)
// The delivered package should contain a docker file that allows us to docker run the application and test the
// functionality directly.
//
//   Bonus points for automated tests.
//   Stretch challenge: persist the uploaded information to a database so a user can come to the application
//   and browse through datasets uploaded by other users. No user authentication/user management is required here…
//   assume anonymous users and public datasets.

import { ref, reactive, watch, getCurrentInstance } from 'vue'
import AppLineChart from '@/components/graphs/AppLineChart.vue'
import AppBarChart from '@/components/graphs/AppBarChart.vue'
import { useFileTable } from '@/composables/useFileTable'
import { genFileId } from 'element-plus'
import { getLeadingDigit, generateUserPlots, getObserveValues } from '@/utils/benfordUtils'
import { UploadFilled } from '@element-plus/icons-vue'
import { getChiSquareTestResults } from '@/services/chiSquareService'

const app = getCurrentInstance()
const Papa = app.appContext.config.globalProperties.$papa
const uploadRef = ref()
const fileList = ref([])
const activeName = ref('graph')
const viableColumn = ref()
const userPlots = ref([])
const { setDatasets, clearTable, tableHeaders, tableData, columnOptions } = useFileTable()
const chartType = ref('line')
const chiSquareResults = ref({
  chiSquared: '',
  probability: '',
})

// Complete callback when the file is parsed
// It will then call setDatasets which will then
// call update the data table
const fileCompleteHandler = (results) => {
  if (results.data.length > 0) {
    let datasets = results.data
    setDatasets(datasets)
  }
}

// Config for the Papa.parse call
const fileConfig = {
  complete: fileCompleteHandler,
}

// Called when the file changes
// It will parse the file and then set the table data
const handleFileChange = (uploadFile) => {
  try {
    if (uploadFile && uploadFile.raw && Papa) {
      Papa.parse(uploadFile.raw, fileConfig)
    }
  } catch (err) {
    console.error(err)
  }
}

// Used to replace the current selected uploaded file with a new one
const handleFileExceed = (files) => {
  // clear the files in the list
  uploadRef.value.clearFiles()
  // get the file reference in the array of files
  const file = files[0]
  // create a new file id
  file.uid = genFileId()
  // let the uploadRef it is ready for upload
  uploadRef.value.handleStart(file)
}

// Used to clear the UI state
const clearHandler = () => {
  clearTable()
  viableColumn.value = null
  fileList.value = []
  userPlots.value = []
}

// Handler called when the selected column value changes
const selectedColumnHandler = async () => {
  try {
    // 1) Get the leading digit values
    const values = getLeadingDigit(tableData.value, viableColumn.value)
    // 2) Set the user plots for the graph
    userPlots.value = generateUserPlots(values)
    // 3) Get the observed value without the percentage value
    const observed = getObserveValues(values)
    // 4) Make an api call to return the chiSquare results
    const res = await getChiSquareTestResults(observed)

    if (res.data) {
      chiSquareResults.value = {
        chiSquared: res.data.chiSquared.toFixed(2),
        probability: res.data.probability.toFixed(2),
      }
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex flex-col p-8 shadow-lg w-full max-w-7xl mx-auto">
    <div class="w-full flex justify-between mb-8">
      <div class="flex gap-4">
        <button :disabled="tableData.length === 0" class="purple-btn" @click="clearHandler">
          Reset
        </button>
      </div>
      <p v-if="tableData.length" class="text-pink-700 text-2xl">
        {{ fileList[0].name }}
      </p>
    </div>

    <div class="w-full">
      <el-tabs v-model="activeName" class="app-tabs">
        <el-tab-pane label="Graph" name="graph">
          <p v-if="tableData.length === 0">
            In order to generate your graph you must
            <span class="font-bold">upload a .csv file</span>.

            <el-upload
              v-model:file-list="fileList"
              ref="uploadRef"
              drag
              accept=".csv"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileChange"
              :on-exceed="handleFileExceed"
              :limit="1"
              class="upload-input mt-4"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Drop your .csv file here or <span class="text-pink-700">click to upload</span>
              </div>
            </el-upload>
          </p>
          <div class="flex items-center justify-between" v-if="tableData.length">
            <div class="flex gap-4 items-center mb-4">
              <el-select
                v-model="viableColumn"
                class="m-2"
                placeholder="Select"
                size="large"
                @change="selectedColumnHandler"
              >
                <el-option v-for="item in columnOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <p>You must <span class="font-bold">select</span> a column to generate your graph</p>
            </div>
            <ul v-if="userPlots.length">
              <li>
                Chi-Squared Test: <span class="font-bold">{{ chiSquareResults.chiSquared }}</span>
              </li>
              <li>
                Probability:<span class="font-bold">{{ chiSquareResults.probability }}</span>
              </li>
            </ul>
            <div v-if="userPlots.length" class="flex items-center">
              <button
                class="rounded-l p-2 border border-pink-700 hover:bg-pink-600 hover:text-white text-pink-700"
                :class="{ 'button-selected': chartType === 'line' }"
                @click="chartType = 'line'"
              >
                Line
              </button>
              <button
                class="rounded-r p-2 border border-pink-700 hover:bg-pink-600 hover:text-white text-pink-700"
                :class="{ 'button-selected': chartType === 'bar' }"
                @click="chartType = 'bar'"
              >
                Bar
              </button>
            </div>
          </div>
          <AppLineChart
            class="max-h-80"
            v-show="userPlots.length && tableData.length && chartType === 'line'"
            :user-plots="userPlots"
          />
          <AppBarChart
            class="max-h-80"
            v-show="userPlots.length && tableData.length && chartType === 'bar'"
            :user-plots="userPlots"
          ></AppBarChart>
        </el-tab-pane>
        <el-tab-pane label="Data" name="table">
          <div style="height: 400px">
            <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2
                  ref="tableRef"
                  :columns="tableHeaders"
                  :data="tableData"
                  :width="width"
                  :height="height"
                ></el-table-v2>
              </template>
            </el-auto-resizer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.purple-btn {
  @apply uppercase font-bold bg-pink-700 disabled:bg-slate-300 hover:bg-pink-800 text-white p-2 rounded;
}

.app-tabs :deep(.el-tabs__active-bar) {
  @apply bg-pink-700;
}
.app-tabs :deep(.el-tabs__item.is-active) {
  @apply text-pink-700;
}

.upload-input :deep(.el-upload-dragger:hover) {
  @apply border-pink-700;
}

.upload-input :deep(.el-upload:focus .el-upload-dragger) {
  @apply border border-dashed border-pink-700 text-pink-700 rounded;
}

.button-selected {
  @apply border border-pink-700 text-white bg-pink-700;
}
</style>
