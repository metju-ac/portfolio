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

// --- Grid configuration ---
// Icons are placed on a virtual grid. Each cell is CELL_SIZE x CELL_SIZE pixels.
// The grid origin (col=1, row=1) is offset from the top-left by GRID_OFFSET_X / GRID_OFFSET_Y.
const CELL_SIZE = 100 // px per grid cell (width and height)
const GRID_OFFSET_X = 20 // px from left edge to col-1 center
const GRID_OFFSET_Y = 20 // px from top edge to row-1 center

// --- Static desktop image (non-interactive, spans 2x2 grid cells) ---
const DESKTOP_IMAGE = {
  src: '/img/fuck-putin.webp',
  col: 17,
  row: 2,
  spanCols: 2,
  spanRows: 2
}

const desktopImageStyle = (() => {
  const px = {
    left: GRID_OFFSET_X + (DESKTOP_IMAGE.col - 1) * CELL_SIZE,
    top: GRID_OFFSET_Y + (DESKTOP_IMAGE.row - 1) * CELL_SIZE
  }
  return {
    position: 'absolute',
    left: px.left + 'px',
    top: px.top + 'px',
    width: DESKTOP_IMAGE.spanCols * CELL_SIZE + 'px',
    height: DESKTOP_IMAGE.spanRows * CELL_SIZE + 'px',
    pointerEvents: 'none'
  }
})()

const gridToPixel = (col, row) => ({
  left: GRID_OFFSET_X + (col - 1) * CELL_SIZE,
  top: GRID_OFFSET_Y + (row - 1) * CELL_SIZE
})

const pixelToGrid = (left, top) => ({
  col: Math.max(1, Math.round((left - GRID_OFFSET_X) / CELL_SIZE) + 1),
  row: Math.max(1, Math.round((top - GRID_OFFSET_Y) / CELL_SIZE) + 1)
})

// --- Runtime icon grid positions (not persisted, reset on reload) ---
// Each entry: { col, row } — converted to pixels for rendering
const iconGridPos = reactive({})

watchEffect(() => {
  desktopEntities.value.forEach((entity) => {
    if (!iconGridPos[entity.id]) {
      iconGridPos[entity.id] = {
        col: entity.desktopGridPos?.col ?? 1,
        row: entity.desktopGridPos?.row ?? 1
      }
    }
  })
})

const getIconStyle = (entity) => {
  const pos = iconGridPos[entity.id]
  if (!pos) return { position: 'absolute', top: '20px', left: '20px' }

  // During drag, use live pixel position for smooth movement
  if (dragEntityId.value === entity.id && dragLivePos.value) {
    return {
      position: 'absolute',
      top: dragLivePos.value.top + 'px',
      left: dragLivePos.value.left + 'px'
    }
  }

  const px = gridToPixel(pos.col, pos.row)
  return {
    position: 'absolute',
    top: px.top + 'px',
    left: px.left + 'px'
  }
}

// --- Drag state ---
const DRAG_THRESHOLD = 5 // pixels before a mousedown counts as a drag
const dragEntityId = ref(null)
const dragStartMouseX = ref(0)
const dragStartMouseY = ref(0)
const dragStartPixelLeft = ref(0)
const dragStartPixelTop = ref(0)
const hasDragged = ref(false)
const dragLivePos = ref(null) // live pixel position during drag

const startDrag = (event, entity) => {
  if (event.button !== 0) return

  const startPx = gridToPixel(iconGridPos[entity.id]?.col ?? 1, iconGridPos[entity.id]?.row ?? 1)

  dragEntityId.value = entity.id
  dragStartMouseX.value = event.clientX
  dragStartMouseY.value = event.clientY
  dragStartPixelLeft.value = startPx.left
  dragStartPixelTop.value = startPx.top
  hasDragged.value = false
  dragLivePos.value = null

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!dragEntityId.value) return

  const deltaX = event.clientX - dragStartMouseX.value
  const deltaY = event.clientY - dragStartMouseY.value

  if (!hasDragged.value && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) {
    return
  }
  hasDragged.value = true

  // Clamp live position to desktop bounds
  const desktopWidth = window.innerWidth
  const desktopHeight = window.innerHeight - 32 // taskbar height
  const iconWidth = 80
  const iconHeight = 90

  const newLeft = Math.min(Math.max(0, dragStartPixelLeft.value + deltaX), desktopWidth - iconWidth)
  const newTop = Math.min(Math.max(0, dragStartPixelTop.value + deltaY), desktopHeight - iconHeight)

  dragLivePos.value = { top: newTop, left: newLeft }
}

const stopDrag = () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)

  if (hasDragged.value && dragEntityId.value && dragLivePos.value) {
    // Snap to nearest grid cell
    const snapped = pixelToGrid(dragLivePos.value.left, dragLivePos.value.top)

    // Clamp to max grid size based on desktop dimensions
    const maxCol = Math.max(1, Math.floor((window.innerWidth - GRID_OFFSET_X) / CELL_SIZE))
    const maxRow = Math.max(1, Math.floor((window.innerHeight - 32 - GRID_OFFSET_Y) / CELL_SIZE))
    snapped.col = Math.min(snapped.col, maxCol)
    snapped.row = Math.min(snapped.row, maxRow)

    // Prevent overlap: only move if no other icon occupies the target cell
    const isOccupied = Object.entries(iconGridPos).some(([id, pos]) => id !== dragEntityId.value && pos.col === snapped.col && pos.row === snapped.row)

    // Also check if target cell overlaps with the static desktop image
    const isOnImage =
      snapped.col >= DESKTOP_IMAGE.col &&
      snapped.col < DESKTOP_IMAGE.col + DESKTOP_IMAGE.spanCols &&
      snapped.row >= DESKTOP_IMAGE.row &&
      snapped.row < DESKTOP_IMAGE.row + DESKTOP_IMAGE.spanRows

    if (!isOccupied && !isOnImage) {
      iconGridPos[dragEntityId.value] = snapped
    }
  }

  dragLivePos.value = null

  // Small delay so click/dblclick handlers can check hasDragged
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
    <img :src="DESKTOP_IMAGE.src" alt="" :style="desktopImageStyle" draggable="false" class="object-contain" />
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
