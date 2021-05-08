<template>
  <div>
    {{ lat }} / {{ lng }} / {{ label }}<br />
    <template v-if="homes">
      <div v-for="home in homes" :key="home.objectID">
        {{ home.title }}<br />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useAsync,
  useContext,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const route = useRoute()
    const query = computed(() => route.value.query)
    const label = computed(() => query.value.label as string)
    const lat = computed(() => query.value.lat as string)
    const lng = computed(() => query.value.lng as string)
    const { error, $dataApi } = useContext()

    const getHomes = async () => {
      const data = await $dataApi.getHomesByLocation(
        Number(query.value.lat),
        Number(query.value.lng)
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
    const homes = useAsync(() => getHomes())
    watch(route, async () => {
      const getHomesResponse = await getHomes()
      if (getHomesResponse) {
        homes.value = getHomesResponse
      }
    })

    return { homes, label, lat, lng }
  },
})
</script>
