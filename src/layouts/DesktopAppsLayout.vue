<script setup>
import { computed, ref, reactive, watchEffect, onBeforeUnmount } from 'vue'
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

// --- Runtime icon positions (not persisted, reset on reload) ---
const iconPositions = reactive({})

watchEffect(() => {
  desktopEntities.value.forEach((entity) => {
    if (!iconPositions[entity.id]) {
      iconPositions[entity.id] = {
        top: entity.desktopPosition?.top ?? 20,
        left: entity.desktopPosition?.left ?? 20
      }
    }
  })
})

const getIconStyle = (entity) => ({
  position: 'absolute',
  top: iconPositions[entity.id]?.top + 'px',
  left: iconPositions[entity.id]?.left + 'px'
})

// --- Drag state ---
const DRAG_THRESHOLD = 5 // pixels before a mousedown counts as a drag
const dragEntityId = ref(null)
const dragStartMouseX = ref(0)
const dragStartMouseY = ref(0)
const dragStartPosX = ref(0)
const dragStartPosY = ref(0)
const hasDragged = ref(false)

const startDrag = (event, entity) => {
  // Only left mouse button
  if (event.button !== 0) return

  dragEntityId.value = entity.id
  dragStartMouseX.value = event.clientX
  dragStartMouseY.value = event.clientY
  dragStartPosX.value = iconPositions[entity.id]?.left ?? 20
  dragStartPosY.value = iconPositions[entity.id]?.top ?? 20
  hasDragged.value = false

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!dragEntityId.value) return

  const deltaX = event.clientX - dragStartMouseX.value
  const deltaY = event.clientY - dragStartMouseY.value

  // Only count as a drag if we exceed the threshold
  if (!hasDragged.value && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) {
    return
  }
  hasDragged.value = true

  // Calculate new position, clamped to desktop bounds
  const desktopWidth = window.innerWidth
  const desktopHeight = window.innerHeight - 32 // taskbar height
  const iconWidth = 80
  const iconHeight = 90

  const newLeft = Math.min(Math.max(0, dragStartPosX.value + deltaX), desktopWidth - iconWidth)
  const newTop = Math.min(Math.max(0, dragStartPosY.value + deltaY), desktopHeight - iconHeight)

  iconPositions[dragEntityId.value] = { top: newTop, left: newLeft }
}

const stopDrag = () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)

  // Small delay before clearing drag state so click/dblclick handlers can check hasDragged
  setTimeout(() => {
    dragEntityId.value = null
  }, 0)
}

// --- Click / double-click handling ---
const toggleEffect = (selectedEntity) => {
  if (hasDragged.value) return
  localEntities.value.forEach((entity) => {
    entity.isActive = entity.id === selectedEntity.id
  })
}

const removeFilterAndToggle = (entity) => {
  if (hasDragged.value) return
  localEntities.value.forEach((e) => {
    e.isActive = false
  })
  if (entity.isExternalLink && entity.url) {
    window.open(entity.url, '_blank', 'noopener,noreferrer')
  } else {
    emit('toggle-' + entity.id)
  }
}

// Detect if the user is on a mobile device
const isMobile = ref(false)

if (typeof window !== 'undefined') {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent)
}

// Locale management
const localeStore = useLocaleStore()

const getLocalizedTitle = (entity) => {
  return entity.title[localeStore.currentLocale] || entity.title['en']
}

// If click occurs somewhere else, remove the active state
const onWindowClick = (e) => {
  if (!e.target.closest('.desktop-icon')) {
    localEntities.value.forEach((entity) => {
      entity.isActive = false
    })
  }
}

window.addEventListener('click', onWindowClick)

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <section class="absolute top-0 left-0 w-full h-full">
    <button
      v-for="entity in desktopEntities"
      :key="entity.id"
      class="desktop-icon flex flex-col gap-2 items-center cursor-pointer"
      :style="getIconStyle(entity)"
      @mousedown="startDrag($event, entity)"
      @click="isMobile ? removeFilterAndToggle(entity) : toggleEffect(entity)"
      @dblclick="!isMobile && removeFilterAndToggle(entity)"
      :class="{ active: entity.isActive }"
    >
      <img
        class="w-11 h-11 pointer-events-none"
        :style="{
          ...entity.imageStyle,
          filter: entity.isActive ? 'opacity(0.5)' : 'opacity(1)'
        }"
        :src="entity.imgSrc"
        :alt="getLocalizedTitle(entity)"
        draggable="false"
      />
      <p
        class="text-white text-xs font-normal py-px px-1 text-center pointer-events-none"
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
  user-select: none;
}
</style>
