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

      <!-- View: subfolder grid with optional YouTube videos (folder with subfolders selected, no subfolder chosen) -->
      <div v-else-if="currentFolder && currentFolder.subfolders && !currentSubfolder && !youtubeOnlyMode" class="w-full h-full overflow-y-auto">
        <!-- YouTube videos at the top, if any -->
        <div v-if="currentFolderYoutubeVideos.length" class="p-3 border-b border-gray-300">
          <p class="text-xxs text-gray-500 mb-2 font-trebuchet-pixel">{{ currentFolder.label }}</p>
          <div class="flex flex-wrap gap-4">
            <div v-for="yt in currentFolderYoutubeVideos" :key="yt.id" @click="openYoutube(yt)" class="flex flex-col items-center w-28 cursor-pointer group">
              <div class="relative w-24 h-14 bg-black overflow-hidden rounded-sm group-hover:opacity-80">
                <img :src="`https://img.youtube.com/vi/${yt.id}/mqdefault.jpg`" :alt="yt.label" class="w-full h-full object-cover" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-90">
                    <div class="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-white ml-0.5"></div>
                  </div>
                </div>
              </div>
              <p class="text-center text-xxs font-trebuchet-pixel mt-1 leading-tight break-words w-full">{{ yt.label }}</p>
            </div>
          </div>
        </div>
        <!-- Subfolders -->
        <div class="p-4">
          <p class="text-xxs text-gray-500 mb-3 font-trebuchet-pixel">{{ currentFolder.label }}</p>
          <div class="flex flex-wrap gap-4">
            <div v-for="sub in currentFolder.subfolders" :key="sub.id" @click="selectSubfolder(sub)" class="flex flex-col items-center w-20 cursor-pointer group">
              <img src="/img/icons/pictures/folder-images-icon-lg.webp" :alt="sub.label" class="w-12 h-12 group-hover:opacity-80" />
              <p class="text-center text-xxs font-trebuchet-pixel mt-1 leading-tight break-words w-full">{{ sub.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- View: media viewer -->
      <template v-else-if="youtubeOnlyMode || activeTag || (currentFolder && !currentFolder.subfolders && currentFolderYoutubeVideos.length)">
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
            <!-- YouTube video: fixed 16:9 container -->
            <div v-if="currentItem && currentItem.resource_type === 'youtube'" class="w-3/4 h-5/6 mt-1 border border-black overflow-hidden">
              <iframe
                :key="currentItem.youtube_id"
                :src="`https://www.youtube.com/embed/${currentItem.youtube_id}`"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <!-- Cloudinary Video: fixed container -->
            <div v-else-if="currentItem && currentItem.resource_type === 'video'" class="w-3/4 h-5/6 mt-1 border border-black overflow-hidden">
              <video :key="currentItem.public_id" :src="getFullUrl(currentItem)" controls class="w-full h-full object-contain bg-black" />
            </div>
            <!-- Image: border adapts to natural image proportions -->
            <div v-else-if="currentItem" class="mt-1 border border-black overflow-hidden" style="max-width: 75%; max-height: 83.333%">
              <img :src="getFullUrl(currentItem)" :alt="getItemName(currentItem)" class="block max-w-full max-h-full" :style="{ transform: `rotate(${rotation}deg)` }" />
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
              <template v-if="!currentItem || (currentItem.resource_type !== 'video' && currentItem.resource_type !== 'youtube')">
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
            <div class="flex w-full h-full bg-no-repeat bg-32 bg-bottom-right-picture-menu bg-window-picture px-2 pt-1.5 pb-5 gap-4 overflow-x-auto items-start">
              <div
                v-for="(item, index) in mediaItems"
                :key="item.resource_type === 'youtube' ? item.youtube_id : item.public_id"
                class="h-full flex flex-col items-center flex-shrink-0"
              >
                <!-- YouTube thumbnail -->
                <div
                  v-if="item.resource_type === 'youtube'"
                  @click="setCurrentItem(item, index)"
                  :class="[
                    'h-full bg-black flex items-center justify-center cursor-pointer relative',
                    currentIndex === index ? 'border-3 border-focus-blue' : 'border border-gray-300'
                  ]"
                >
                  <img :src="`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`" :alt="item.label" class="h-full w-auto object-contain" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center opacity-90">
                      <div class="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-white ml-0.5"></div>
                    </div>
                  </div>
                </div>
                <!-- Video thumbnail -->
                <div
                  v-else-if="item.resource_type === 'video'"
                  @click="setCurrentItem(item, index)"
                  :class="[
                    'h-full bg-black flex items-center justify-center cursor-pointer relative',
                    currentIndex === index ? 'border-3 border-focus-blue' : 'border border-gray-300'
                  ]"
                >
                  <img :src="getVideoThumbnailUrl(item)" :alt="item.public_id" class="h-full w-auto object-contain" />
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
                  :class="['h-full cursor-pointer flex items-center justify-center', currentIndex === index ? 'border-3 border-focus-blue' : 'border border-gray-300']"
                >
                  <img :src="getThumbnailUrl(item)" :alt="item.public_id" class="h-full w-auto object-contain" />
                </div>
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
import { useGoBackStore } from '@/stores/goBackStore'

const CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
const goBackStore = useGoBackStore()

const folders = travelPhotosData.folders

// Navigation state
const currentFolder = ref(null) // the top-level folder object (or null = root)
const currentSubfolder = ref(null) // subfolder object for 2023_usa (or null)
const expandedFolder = ref(null) // id of expanded folder in the left tree
const youtubeOnlyMode = ref(false) // true when viewing a YouTube video from a subfolder-parent folder

// Media state
const mediaItems = ref([])
const currentItem = ref(null)
const currentIndex = ref(0)
const rotation = ref(0)
const loading = ref(false)
const error = ref(false)

// YouTube videos for the current top-level folder (not subfolder)
const currentFolderYoutubeVideos = computed(() => {
  if (!currentFolder.value) return []
  return currentFolder.value.youtubeVideos || []
})

// The tag currently being displayed
const activeTag = computed(() => {
  if (currentSubfolder.value) return currentSubfolder.value.tag
  if (currentFolder.value && !currentFolder.value.subfolders) return currentFolder.value.tag
  return null
})

// Watch activeTag and fetch media when it changes
watch(activeTag, async (tag) => {
  if (!tag) {
    // No Cloudinary tag — but might still have YouTube videos for non-subfolder folders
    if (currentFolder.value && !currentFolder.value.subfolders) {
      const ytItems = buildYoutubeItems(currentFolder.value.youtubeVideos || [])
      mediaItems.value = ytItems
      currentItem.value = ytItems[0] || null
      currentIndex.value = 0
    } else {
      mediaItems.value = []
      currentItem.value = null
    }
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
    const cloudinaryItems = [...images.map((r) => ({ ...r, resource_type: 'image' })), ...videos.map((r) => ({ ...r, resource_type: 'video' }))].sort((a, b) =>
      a.public_id.localeCompare(b.public_id)
    )

    // Determine which folder's YouTube videos to include
    const activeFolder = currentSubfolder.value || currentFolder.value
    const ytItems = buildYoutubeItems((activeFolder && !currentSubfolder.value ? currentFolder.value.youtubeVideos : []) || [])

    const allItems = [...ytItems, ...cloudinaryItems]

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

function buildYoutubeItems(ytArray) {
  return (ytArray || []).map((yt) => ({
    resource_type: 'youtube',
    youtube_id: yt.id,
    label: yt.label,
    public_id: `youtube_${yt.id}`
  }))
}

function openYoutube(yt) {
  // Called when clicking a YouTube thumbnail in the subfolder+video view
  // Switch to media viewer showing just this YouTube video
  const ytItem = { resource_type: 'youtube', youtube_id: yt.id, label: yt.label, public_id: `youtube_${yt.id}` }
  mediaItems.value = [ytItem]
  currentItem.value = ytItem
  currentIndex.value = 0
  youtubeOnlyMode.value = true
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
  youtubeOnlyMode.value = false
  rotation.value = 0
}

function selectSubfolder(sub) {
  currentSubfolder.value = sub
  youtubeOnlyMode.value = false
  rotation.value = 0
}

function goBack() {
  if (youtubeOnlyMode.value) {
    youtubeOnlyMode.value = false
    mediaItems.value = []
    currentItem.value = null
  } else if (currentSubfolder.value) {
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

// Watch toolbar back/parent-folder button via goBackStore
watch(
  () => goBackStore.travelPhotosGoBack,
  () => {
    goBack()
  }
)

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

// Build a full Cloudinary delivery URL with automatic quality and format optimization
function getFullUrl(item) {
  const type = item.resource_type === 'video' ? 'video' : 'image'
  // q_auto: automatic quality (visually lossless, ~40-60% bandwidth savings)
  // f_auto: automatic format (WebP/AVIF for images, best codec for videos)
  // w_1600,c_limit: cap image width at 1600px to avoid serving massive originals
  const transforms = type === 'image' ? 'q_auto,f_auto,w_1600,c_limit' : 'q_auto'
  return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${transforms}/${item.public_id}.${item.format}`
}

// Build a Cloudinary thumbnail URL with height-limited transformation (preserves aspect ratio)
function getThumbnailUrl(item) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/h_120,c_limit,q_auto,f_auto/${item.public_id}.${item.format}`
}

function getVideoThumbnailUrl(item) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/h_120,c_limit,q_auto,f_auto,so_2/${item.public_id}.jpg`
}

function getItemName(item) {
  if (item.resource_type === 'youtube') return item.label
  // Extract just the filename without path and extension
  const parts = item.public_id.split('/')
  return parts[parts.length - 1]
}
</script>
