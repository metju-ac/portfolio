<template>
  <div class="world-map-container">
    <div class="world-map-header">
      <h3>Countries I've Visited</h3>
      <span class="country-count">{{ visitedCountries.length }} countries</span>
    </div>
    <div class="world-map-wrapper">
      <SvgMap :map="World" :location-attributes="getLocationAttributes" @mouseover="handleMouseOver" @mouseout="handleMouseOut" />
      <div v-if="tooltipText" class="map-tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
        {{ tooltipText }}
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
