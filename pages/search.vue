<template>
  <div>
    Results for {{ label }}<br />
    <div ref="mapRef" style="height: 800px; width: 800px; float: right"></div>
    <div v-if="homes && homes.length > 0">
      <nuxt-link
        v-for="home in homes"
        :key="home.objectID"
        :to="`/home/${home.objectID}`"
      >
        <home-row
          :home="home"
          @mouseover.native="highlightMarker(home.objectID, true)"
          @mouseout.native="highlightMarker(home.objectID, false)"
        />
      </nuxt-link>
    </div>
    <div v-else>No results found</div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { HomeType } from '~/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const query = computed(() => route.value.query)
    const label = computed(() => query.value.label as string)
    const lat = computed(() => query.value.lat as string)
    const lng = computed(() => query.value.lng as string)
    const { error, $dataApi, $maps } = useContext()
    const homes = ref<HomeType[] | null>(null)

    useMeta(() => ({
      title: `Home around ${label.value}`,
    }))

    const mapRef = ref<HTMLElement | null>(null)
    const getHomes = async () => {
      const data = await $dataApi.getHomesByLocation(
        Number(lat.value),
        Number(lng.value)
      )
      if (!data.ok) {
        error({
          statusCode: data.status,
          message: data.statusText,
        })
      } else {
        return data.json.hits
      }
    }
    const getHomeMarkers = () =>
      homes.value?.map((home) => ({
        ...home._geoloc,
        pricePerNight: home.pricePerNight,
        id: home.objectID,
      }))
    const updateMap = async () => {
      const getHomesResponse = await getHomes()
      if (getHomesResponse && mapRef.value) {
        homes.value = getHomesResponse
        $maps.showMap(
          mapRef.value,
          Number(lat.value),
          Number(lng.value),
          getHomeMarkers()
        )
      }
    }
    onMounted(async () => {
      // TODO: Sometimes fails on reload...
      await updateMap()
    })
    watch(route, async () => {
      await updateMap()
    })

    const highlightMarker = (homeId: string, isHighlighted: boolean) => {
      document
        .getElementsByClassName(`home-${homeId}`)[0]
        ?.classList.toggle('marker-highlight', isHighlighted)
    }

    return { homes, label, lat, lng, mapRef, highlightMarker }
  },
  head: {},
})
</script>

<style>
.marker {
  background-color: white;
  border: 1px solid lightgray;
  font-weight: bold;
  border-radius: 20px;
  padding: 5px 8px;
}
.marker-highlight {
  color: white !important;
  background-color: black;
  border-color: black;
}
</style>
