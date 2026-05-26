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

  if (!file) {
    return 'File not found.'
  }

  if (Array.isArray(file.orderedList)) {
    const digitCount = String(file.orderedList.length).length
    const heading = file.heading ? `=== ${file.heading} ===\n\n` : ''
    const list = file.orderedList
      .map((item, index) => `${String(index + 1).padStart(digitCount, ' ')}. ${item}`)
      .join('\n')

    return `${heading}${list}\n`
  }

  return file.content
})
</script>
