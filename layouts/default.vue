<template>
  <div class="app">
    <header class="app-header">
      <div class="app-logo">
        <img src="/images/logo.svg" />
      </div>
      <div class="app-search">
        <input
          ref="citySearch"
          type="text"
          placeholder="Enter your address"
          @changed="changed"
        />
        <input type="text" class="datepicker" placeholder="Check in" />
        <input type="text" class="datepicker" placeholder="Check out" />
        <button>
          <img src="/images/icons/search.svg" />
        </button>
      </div>
      <div class="app-user-menu">
        <img src="/images/icons/house.svg" />
        <div class="name">Host</div>
        <img src="/images/user.jpg" class="avatar" />
      </div>
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
