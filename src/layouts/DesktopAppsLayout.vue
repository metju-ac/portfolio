<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useLocaleStore } from '@/stores/localeStore'

const emit = defineEmits()

const props = defineProps({
  entities: {
    type: Array,
    required: true
  }
})

const localEntities = ref([])

watchEffect(() => {
  localEntities.value = [...props.entities]
})

const desktopEntities = computed(() => {
  return localEntities.value.filter((entity) => entity.onDesktop)
})

const toggleEffect = (selectedEntity) => {
  localEntities.value.forEach((entity) => {
    entity.isActive = entity.id === selectedEntity.id
  })
}

const removeFilterAndToggle = (entity) => {
  localEntities.value.forEach((e) => {
    e.isActive = false
  })
  if (entity.isExternalLink && entity.url) {
    window.open(entity.url, '_blank', 'noopener,noreferrer')
  } else {
    emit('toggle-' + entity.id) // Emit on double click or single tap.
  }
}

// Detect if the user is on a mobile device
const isMobile = ref(false)

if (typeof window !== 'undefined') {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent)
}

// Locale management
const localeStore = useLocaleStore()

// Computed property to get the localized title
const getLocalizedTitle = (entity) => {
  return entity.title[localeStore.currentLocale] || entity.title['en']
}

// If click occurs somewhere else, remove the active state
window.addEventListener('click', (e) => {
  if (!e.target.closest('.desktop-icon')) {
    localEntities.value.forEach((entity) => {
      entity.isActive = false
    })
  }
})
</script>

<template>
  <section class="absolute top-0 left-0 w-full h-full">
    <button
      v-for="entity in desktopEntities"
      :key="entity.id"
      class="desktop-icon flex flex-col gap-2 items-center cursor-pointer"
      :style="{
        position: 'absolute',
        top: (entity.desktopPosition?.top ?? 20) + 'px',
        left: (entity.desktopPosition?.left ?? 20) + 'px'
      }"
      @click="isMobile ? removeFilterAndToggle(entity) : toggleEffect(entity)"
      @dblclick="!isMobile && removeFilterAndToggle(entity)"
      :class="{ active: entity.isActive }"
    >
      <img
        class="w-11 h-11"
        :style="{
          ...entity.imageStyle,
          filter: entity.isActive ? 'opacity(0.5)' : 'opacity(1)'
        }"
        :src="entity.imgSrc"
        :alt="getLocalizedTitle(entity)"
      />
      <p
        class="text-white text-xs font-normal py-px px-1 text-center"
        :style="{
          ...entity.textStyle,
          backgroundColor: entity.isActive ? '#0B61FF' : 'transparent',
          textShadow: entity.isActive ? 'none' : '0px 1px 1px rgba(1, 1, 1, 1), 0px 0px 4px #000'
        }"
      >
        {{ getLocalizedTitle(entity) }}
      </p>
    </button>
  </section>
</template>

<style scoped>
.desktop-icon {
  width: 80px;
}
</style>
