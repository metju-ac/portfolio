<template>
  <div class="relative right-0 h-full flex">
    <textarea
      :value="fileContent"
      readonly
      class="w-full h-content-headless-toolbox bg-white overflow-y-scroll outline-none resize-none px-1 font-trebuchet-pixel text-md cursor-default"
    ></textarea>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import textFilesData from '@/data/text-files-data.json'

const props = defineProps({
  textFileId: {
    type: String,
    required: true
  }
})

const fileContent = computed(() => {
  const file = textFilesData[props.textFileId]
  return file ? file.content : 'File not found.'
})
</script>
