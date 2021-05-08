<template>
  <div>
    <header style="background-color: #eee">
      <nuxt-link to="/">Home</nuxt-link>
      <input ref="citySearch" type="text" @changed="changed" />
    </header>
    <nuxt />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $maps } = useContext()
    const router = useRouter()
    const citySearch = ref<HTMLInputElement | null>(null)

    onMounted(() => {
      if (citySearch.value) {
        $maps.makeAutoComplete(citySearch.value)
      }
    })

    // eslint-disable-next-line no-undef
    const changed = (event: CustomEvent<google.maps.places.PlaceResult>) => {
      const place = event.detail
      if (!place.geometry) {
        return
      }

      router.push({
        name: 'search',
        query: {
          lat: String(place.geometry.location?.lat()),
          lng: String(place.geometry.location?.lng()),
          label: citySearch.value?.value,
        },
      })
    }

    return { citySearch, changed }
  },
  head: {},
})
</script>
