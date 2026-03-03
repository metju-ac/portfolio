<template>
  <div class="world-map-container">
    <div class="world-map-header">
      <h3>Countries I've Visited</h3>
      <span class="country-count">{{ visitedCountries.length }} countries</span>
    </div>
    <div class="world-map-wrapper" @wheel.prevent="onWheel" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp">
      <div
        class="world-map-inner"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }"
      >
        <SvgMap :map="World" :location-attributes="getLocationAttributes" @mouseover="handleMouseOver" @mouseout="handleMouseOut" />
      </div>
      <div v-if="tooltipText" class="map-tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
        {{ tooltipText }}
      </div>
      <!-- Zoom controls -->
      <div class="zoom-controls">
        <button @click="zoomIn" class="zoom-btn" title="Zoom in">+</button>
        <button @click="resetView" class="zoom-btn zoom-reset" title="Reset view">⌂</button>
        <button @click="zoomOut" class="zoom-btn" title="Zoom out">−</button>
      </div>
    </div>
    <div class="map-legend">
      <span class="legend-item"> <span class="legend-swatch legend-visited"></span> Visited </span>
      <span class="legend-item"> <span class="legend-swatch legend-not-visited"></span> Not visited </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SvgMap } from 'vue-svg-map'
import 'vue-svg-map/style.css'
import World from '@svg-maps/world'
import visitedCountries from '@/data/visited-countries-data.json'

const visitedSet = new Set(visitedCountries)

const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

// Zoom & pan state
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const panStart = ref({ x: 0, y: 0 })

const MIN_ZOOM = 1
const MAX_ZOOM = 8
const ZOOM_FACTOR = 1.2

const getLocationAttributes = (location) => {
  const isVisited = visitedSet.has(location.id)
  return {
    style: `fill: ${isVisited ? '#3a7bd5' : '#d4d4d4'}; cursor: pointer;`
  }
}

const handleMouseOver = (event) => {
  const target = event.target
  if (target && target.nodeName === 'path') {
    const name = target.getAttribute('aria-label') || target.id
    const isVisited = visitedSet.has(target.id)
    tooltipText.value = isVisited ? `${name} ✓` : name
    tooltipX.value = event.offsetX + 12
    tooltipY.value = event.offsetY - 24
  }
}

const handleMouseOut = () => {
  tooltipText.value = ''
}

const clampPan = (x, y, z) => {
  // Allow panning proportional to how zoomed in we are
  const maxPan = (z - 1) * 400
  return {
    x: Math.max(-maxPan, Math.min(maxPan, x)),
    y: Math.max(-maxPan, Math.min(maxPan, y))
  }
}

const onWheel = (e) => {
  const delta = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR
  const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom.value * delta))
  zoom.value = newZoom
  if (newZoom === MIN_ZOOM) {
    panX.value = 0
    panY.value = 0
  } else {
    const clamped = clampPan(panX.value, panY.value, newZoom)
    panX.value = clamped.x
    panY.value = clamped.y
  }
}

const onMouseDown = (e) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  panStart.value = { x: panX.value, y: panY.value }
}

const onMouseMove = (e) => {
  if (!isDragging.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  const clamped = clampPan(panStart.value.x + dx, panStart.value.y + dy, zoom.value)
  panX.value = clamped.x
  panY.value = clamped.y
}

const onMouseUp = () => {
  isDragging.value = false
}

const zoomIn = () => {
  zoom.value = Math.min(MAX_ZOOM, zoom.value * ZOOM_FACTOR)
}

const zoomOut = () => {
  const newZoom = Math.max(MIN_ZOOM, zoom.value / ZOOM_FACTOR)
  zoom.value = newZoom
  if (newZoom === MIN_ZOOM) {
    panX.value = 0
    panY.value = 0
  } else {
    const clamped = clampPan(panX.value, panY.value, newZoom)
    panX.value = clamped.x
    panY.value = clamped.y
  }
}

const resetView = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}
</script>

<style scoped>
.world-map-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  padding: 8px;
  padding-top: 32px;
  box-sizing: border-box;
}

.world-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px 8px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 8px;
}

.world-map-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.country-count {
  font-size: 12px;
  color: #666;
}

.world-map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.world-map-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  will-change: transform;
}

.world-map-wrapper :deep(.svg-map) {
  width: 100%;
  height: auto;
  max-height: 100%;
  --svg-map-stroke: #999;
  --svg-map-stroke-width: 0.5;
}

/* Override the default library hover — we handle it via locationAttributes */
.world-map-wrapper :deep(.svg-map__location:hover) {
  opacity: 0.8;
}

.world-map-wrapper :deep(.svg-map__location:focus-visible) {
  opacity: 0.8;
}

.map-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
}

.zoom-controls {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
}

.zoom-btn {
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.zoom-btn:hover {
  background: #e8f0fe;
  border-color: #3a7bd5;
}

.zoom-reset {
  font-size: 11px;
}

.map-legend {
  display: flex;
  gap: 16px;
  padding: 8px;
  justify-content: center;
  border-top: 1px solid #ddd;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #555;
}

.legend-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid #999;
}

.legend-visited {
  background: #3a7bd5;
}

.legend-not-visited {
  background: #d4d4d4;
}
</style>
