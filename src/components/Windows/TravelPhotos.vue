<template>
  <div class="relative right-0 h-content-window flex overflow-hidden">
    <!-- Left panel: folder tree -->
    <div class="flex flex-col flex-shrink-0 w-32 md:w-44 h-full bg-window-side-menu border-r border-gray-300 overflow-y-auto">
      <!-- Back button -->
      <div v-if="currentFolder" @click="goBack" class="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-blue-100 border-b border-gray-300">
        <img src="/img/icons/windows-header-tools/right-arrow-green-icon.webp" :alt="$t('common.back')" class="w-5 h-5 flex-shrink-0 rotate-180" />
        <span class="text-xxs font-bold text-twilight-blue truncate">{{ $t('common.back') }}</span>
      </div>

      <!-- Folder list -->
      <div class="flex flex-col py-1">
        <div v-for="folder in folders" :key="folder.id">
          <!-- Top-level folder -->
          <div
            @click="selectFolder(folder)"
            :class="[
              'flex items-center gap-1.5 px-2 py-1 cursor-pointer text-xs-mobile md:text-xxs truncate',
              isActive(folder) ? 'bg-focus-blue text-white' : 'hover:bg-blue-100 text-twilight-blue'
            ]"
          >
            <img
              :src="folder.subfolders ? '/img/icons/documents/folder-docs-icon-xs.webp' : '/img/icons/pictures/folder-images-icon-xs.webp'"
              :alt="folder.label"
              class="w-4 h-4 flex-shrink-0"
            />
            <span class="truncate">{{ folder.label }}</span>
          </div>

          <!-- Subfolders (only for 2023_usa) -->
          <div v-if="folder.subfolders && expandedFolder === folder.id" v-for="sub in folder.subfolders" :key="sub.id">
            <div
              @click="selectSubfolder(sub)"
              :class="[
                'flex items-center gap-1.5 pl-6 pr-2 py-1 cursor-pointer text-xs-mobile md:text-xxs truncate',
                isActive(sub) ? 'bg-focus-blue text-white' : 'hover:bg-blue-100 text-twilight-blue'
              ]"
            >
              <img src="/img/icons/pictures/folder-images-icon-xs.webp" :alt="sub.label" class="w-4 h-4 flex-shrink-0" />
              <span class="truncate">{{ sub.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="w-full h-full bg-pictures-blue flex flex-col overflow-hidden">
      <!-- View: folder grid (no folder selected) -->
      <div v-if="!currentFolder" class="w-full h-full overflow-y-auto p-4">
        <div class="flex flex-wrap gap-4">
          <div v-for="folder in folders" :key="folder.id" @click="selectFolder(folder)" class="flex flex-col items-center w-20 cursor-pointer group">
            <img
              :src="folder.subfolders ? '/img/icons/documents/folder-docs-icon-lg.webp' : '/img/icons/pictures/folder-images-icon-lg.webp'"
              :alt="folder.label"
              class="w-12 h-12 group-hover:opacity-80"
            />
            <p class="text-center text-xxs font-trebuchet-pixel mt-1 leading-tight break-words w-full">{{ folder.label }}</p>
          </div>
        </div>
      </div>

      <!-- View: subfolder grid (2023_usa selected but no subfolder chosen yet) -->
      <div v-else-if="currentFolder && currentFolder.subfolders && !currentSubfolder" class="w-full h-full overflow-y-auto p-4">
        <p class="text-xxs text-gray-500 mb-3 font-trebuchet-pixel">{{ currentFolder.label }}</p>
        <div class="flex flex-wrap gap-4">
          <div v-for="sub in currentFolder.subfolders" :key="sub.id" @click="selectSubfolder(sub)" class="flex flex-col items-center w-20 cursor-pointer group">
            <img src="/img/icons/pictures/folder-images-icon-lg.webp" :alt="sub.label" class="w-12 h-12 group-hover:opacity-80" />
            <p class="text-center text-xxs font-trebuchet-pixel mt-1 leading-tight break-words w-full">{{ sub.label }}</p>
          </div>
        </div>
      </div>

      <!-- View: media viewer -->
      <template v-else-if="activeTag">
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center w-full h-full">
          <p class="text-xxs font-trebuchet-pixel text-gray-500">{{ $t('common.loading') }}</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex flex-col items-center justify-center w-full h-full gap-2 px-4">
          <p class="text-xxs font-trebuchet-pixel text-red-600 text-center">{{ $t('windows.travelPhotos.error') }}</p>
        </div>

        <!-- No media found -->
        <div v-else-if="mediaItems.length === 0" class="flex items-center justify-center w-full h-full">
          <p class="text-xxs font-trebuchet-pixel text-gray-500">{{ $t('windows.travelPhotos.empty') }}</p>
        </div>

        <!-- Media viewer (same layout as Pictures.vue) -->
        <template v-else>
          <!-- Main viewer (top ~75% of height) -->
          <div class="flex flex-col justify-center items-center w-full h-9/12 gap-1">
            <div class="w-3/4 h-5/6 mt-1 border border-black overflow-hidden">
              <!-- Video -->
              <video
                v-if="currentItem && currentItem.resource_type === 'video'"
                :key="currentItem.public_id"
                :src="currentItem.secure_url"
                controls
                class="w-full h-full object-contain bg-black"
              />
              <!-- Image -->
              <div
                v-else-if="currentItem"
                class="w-full h-full bg-contain bg-center bg-no-repeat"
                :style="{
                  backgroundImage: `url(${currentItem.secure_url})`,
                  transform: `rotate(${rotation}deg)`
                }"
              />
            </div>
            <!-- Controls -->
            <div class="flex py-2">
              <div class="flex gap-0.5">
                <button
                  @click="previousItem"
                  class="flex items-center w-7 h-7 cursor-pointer rounded-sm hover:border border border-pictures-blue hover:border-gray-300 hover:shadow-header-tools p-1"
                >
                  <img src="/img/icons/pictures/previous-icon.svg" :alt="$t('windows.pictures.previous')" />
                </button>
                <button
                  @click="nextItem"
                  class="flex items-center w-7 h-7 cursor-pointer rounded-sm hover:border border border-pictures-blue hover:border-gray-300 hover:shadow-header-tools p-1"
                >
                  <img src="/img/icons/pictures/next-icon.svg" :alt="$t('windows.pictures.next')" />
                </button>
              </div>
              <!-- Rotation buttons (images only) -->
              <template v-if="!currentItem || currentItem.resource_type !== 'video'">
                <hr class="w-px mx-2 h-full bg-moon-mist" />
                <div class="flex">
                  <button
                    @click="rotateLeft"
                    class="flex items-center w-7 h-7 cursor-pointer rounded-sm hover:border border border-pictures-blue hover:border-gray-300 hover:shadow-header-tools p-1"
                  >
                    <img src="/img/icons/pictures/left.svg" :alt="$t('windows.pictures.rotateLeft')" />
                  </button>
                  <button
                    @click="rotateRight"
                    class="flex items-center w-7 h-7 cursor-pointer rounded-sm hover:border border border-pictures-blue hover:border-gray-300 hover:shadow-header-tools p-1"
                  >
                    <img src="/img/icons/pictures/right.svg" :alt="$t('windows.pictures.rotateRight')" />
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Thumbnail strip (bottom ~25%) -->
          <div class="w-full h-3/12 bg-white">
            <div class="flex w-full h-full bg-no-repeat bg-32 bg-bottom-right-picture-menu bg-window-picture px-2 pt-1.5 pb-5 gap-4 overflow-x-auto">
              <div v-for="(item, index) in mediaItems" :key="item.public_id" class="w-full h-full flex flex-col items-center">
                <!-- Video thumbnail -->
                <div
                  v-if="item.resource_type === 'video'"
                  @click="setCurrentItem(item, index)"
                  :class="[
                    'w-full h-full min-w-20 bg-black flex items-center justify-center cursor-pointer relative',
                    currentIndex === index ? 'border-3 border-focus-blue' : 'border border-gray-300'
                  ]"
                >
                  <img :src="getVideoThumbnailUrl(item)" :alt="item.public_id" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-4 h-4 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                      <div class="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-gray-700 ml-0.5"></div>
                    </div>
                  </div>
                </div>
                <!-- Image thumbnail -->
                <div
                  v-else
                  ref="thumbnailElements"
                  @click="setCurrentItem(item, index)"
                  :class="[
                    'w-full h-full min-w-20 bg-no-repeat bg-contain bg-center cursor-pointer',
                    currentIndex === index ? 'border-3 border-focus-blue' : 'border border-gray-300'
                  ]"
                  :style="{ backgroundImage: `url(${getThumbnailUrl(item)})` }"
                />
                <p
                  @click="setCurrentItem(item, index)"
                  :class="[
                    'text-center inline-block font-trebuchet-pixel text-xxs cursor-pointer mt-1',
                    currentIndex === index ? 'bg-focus-blue px-1 my-px text-white' : ''
                  ]"
                >
                  {{ getItemName(item) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import travelPhotosData from '@/data/travel-photos-data.json'

const CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME

const folders = travelPhotosData.folders

// Navigation state
const currentFolder = ref(null) // the top-level folder object (or null = root)
const currentSubfolder = ref(null) // subfolder object for 2023_usa (or null)
const expandedFolder = ref(null) // id of expanded folder in the left tree

// Media state
const mediaItems = ref([])
const currentItem = ref(null)
const currentIndex = ref(0)
const rotation = ref(0)
const loading = ref(false)
const error = ref(false)

// The tag currently being displayed
const activeTag = computed(() => {
  if (currentSubfolder.value) return currentSubfolder.value.tag
  if (currentFolder.value && !currentFolder.value.subfolders) return currentFolder.value.tag
  return null
})

// Watch activeTag and fetch media when it changes
watch(activeTag, async (tag) => {
  if (!tag) {
    mediaItems.value = []
    currentItem.value = null
    return
  }
  await fetchMediaByTag(tag)
})

async function fetchMediaByTag(tag) {
  loading.value = true
  error.value = false
  mediaItems.value = []
  currentItem.value = null
  rotation.value = 0

  try {
    // Cloudinary public list URL — requires "Resource list" to be set to "Public" in account settings
    // Works for both images and videos. We need to check both resource types.
    const [imageRes, videoRes] = await Promise.all([
      fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(tag)}.json`),
      fetch(`https://res.cloudinary.com/${CLOUD_NAME}/video/list/${encodeURIComponent(tag)}.json`)
    ])

    const images = imageRes.ok ? (await imageRes.json()).resources || [] : []
    const videos = videoRes.ok ? (await videoRes.json()).resources || [] : []

    // Attach resource_type so we can distinguish later
    const allItems = [...images.map((r) => ({ ...r, resource_type: 'image' })), ...videos.map((r) => ({ ...r, resource_type: 'video' }))].sort((a, b) =>
      a.public_id.localeCompare(b.public_id)
    )

    mediaItems.value = allItems
    if (allItems.length > 0) {
      currentItem.value = allItems[0]
      currentIndex.value = 0
    }
  } catch (e) {
    console.error('Failed to fetch Cloudinary media:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

function selectFolder(folder) {
  if (folder.subfolders) {
    // Toggle expand
    if (expandedFolder.value === folder.id) {
      expandedFolder.value = null
      currentFolder.value = null
      currentSubfolder.value = null
    } else {
      expandedFolder.value = folder.id
      currentFolder.value = folder
      currentSubfolder.value = null
    }
  } else {
    currentFolder.value = folder
    currentSubfolder.value = null
    expandedFolder.value = null
  }
  rotation.value = 0
}

function selectSubfolder(sub) {
  currentSubfolder.value = sub
  rotation.value = 0
}

function goBack() {
  if (currentSubfolder.value) {
    currentSubfolder.value = null
    mediaItems.value = []
    currentItem.value = null
  } else if (currentFolder.value) {
    currentFolder.value = null
    currentSubfolder.value = null
    expandedFolder.value = null
    mediaItems.value = []
    currentItem.value = null
  }
}

function isActive(folder) {
  if (currentSubfolder.value) return currentSubfolder.value.id === folder.id
  if (currentFolder.value) return currentFolder.value.id === folder.id
  return false
}

function setCurrentItem(item, index) {
  currentItem.value = item
  currentIndex.value = index
  rotation.value = 0
}

function previousItem() {
  if (currentIndex.value === 0) {
    currentIndex.value = mediaItems.value.length - 1
  } else {
    currentIndex.value--
  }
  currentItem.value = mediaItems.value[currentIndex.value]
  rotation.value = 0
}

function nextItem() {
  if (currentIndex.value === mediaItems.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
  currentItem.value = mediaItems.value[currentIndex.value]
  rotation.value = 0
}

function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

// Build a Cloudinary thumbnail URL with fixed size transformation
function getThumbnailUrl(item) {
  // Insert w_80,h_80,c_fill transformation into the delivery URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_80,h_80,c_fill/${item.public_id}`
}

function getVideoThumbnailUrl(item) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_80,h_80,c_fill,so_2/${item.public_id}.jpg`
}

function getItemName(item) {
  // Extract just the filename without path and extension
  const parts = item.public_id.split('/')
  return parts[parts.length - 1]
}
</script>
