<template>
  <div v-if="home">
    <div style="display: flex">
      <img
        v-for="image in home.images"
        :key="image"
        :src="image"
        width="200"
        height="150"
      />
    </div>
    {{ home.title }}<br />
    ${{ home.pricePerNight }} / night<br />
    <img src="/images/marker.svg" width="20" height="20" />
    {{ home.location.address }} {{ home.location.city }}
    {{ home.location.state }} {{ home.location.country }}<br />
    <img src="/images/star.svg" width="20" height="20" />
    {{ home.reviewValue }}<br />
    {{ home.guests }} guests, {{ home.bedrooms }} rooms, {{ home.beds }} beds,
    {{ home.bathrooms }} bath<br />
    <div ref="mapRef" style="height: 800px; width: 800px"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import homes from '~/data/homes.json'

export default defineComponent({
  setup() {
    const { $maps } = useContext()
    const route = useRoute()
    const home = homes.find((home) => home.objectID === route.value.params.id)
    const mapRef = ref<HTMLElement | null>(null)

    useMeta(() => ({
      title: home?.title,
    }))

    onMounted(() => {
      if (home && mapRef.value) {
        $maps.showMap(mapRef.value, home._geoloc.lat, home._geoloc.lng)
      }
    })

    return {
      home,
      mapRef,
    }
  },
  head: {},
})
</script>
