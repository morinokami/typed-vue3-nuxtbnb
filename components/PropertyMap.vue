<template>
  <div>
    <div class="app-wrapper app-vertical">
      <h2 class="app-subtitle">Location</h2>
      <p class="app-description">
        {{ home.location.address }}
        {{ home.location.city }}
        {{ home.location.state }}
        {{ home.location.country }}
      </p>
      <div ref="map" class="app-map"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { HomeType } from '~/types'

export default defineComponent({
  props: {
    home: {
      type: Object as PropType<HomeType>,
      required: true,
    },
  },
  setup(props) {
    const { $maps } = useContext()
    const map = ref<HTMLElement | null>(null)

    onMounted(() => {
      if (map.value) {
        $maps.showMap(map.value, props.home._geoloc.lat, props.home._geoloc.lng)
      }
    })

    return { map }
  },
})
</script>
