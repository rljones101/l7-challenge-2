<script setup>
import UploadFilePreview from '@/components/UploadFilePreview.vue'
</script>

<template>
  <div class="max-w-7xl mx-auto w-full">
    <header class="max-w-7xl mx-auto w-full">
      <div class="flex flex-col items-center mb-8">
        <h1 class="text-2xl"><span class="text-pink-700 font-black">L7</span> Challenge 2</h1>
        <p class="text-sm">Benford's Law Demo</p>
      </div>

      <div class="">
        <h3 class="font-bold text-2xl">How to use:</h3>
        <ol class="flex flex-col mt-4">
          <li>1) Upload a CSV file.</li>
          <li>2) Once the file is loaded you can verify it in the data tab.</li>
          <li>3) Select a column from the dropdown to generate your graph.</li>
        </ol>
      </div>
    </header>

    <main class="mx-auto max-w-7x w-full">
      <UploadFilePreview />
    </main>
  </div>
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    flex-direction: column;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
