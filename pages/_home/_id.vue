<template>
  <div class="app-container">
    <template v-if="home">
      <property-gallery :images="home.images" />
      <property-details :home="home" />
      <property-description :home="home" />
      <property-map :home="home" />
      <property-reviews v-if="reviews" :reviews="reviews" />
      <property-host v-if="user" :user="user" />
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useAsync,
  useContext,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import PropertyHost from '~/components/PropertyHost.vue'
import PropertyReviews from '~/components/PropertyReviews.vue'
import { HomeType } from '~/types'

export default defineComponent({
  components: { PropertyReviews, PropertyHost },
  setup() {
    const { error, $dataApi } = useContext()
    const route = useRoute()
    const home = ref<HomeType | null>(null)
    const reviews = useAsync(async () => {
      const reviewResponse = await $dataApi.getReviewsByHomeId(
        route.value.params.id
      )
      if (!reviewResponse.ok) {
        error({
          statusCode: reviewResponse.status,
          message: reviewResponse.statusText,
        })
      } else {
        return reviewResponse.json.hits
      }
    })
    const user = useAsync(async () => {
      const userResponse = await $dataApi.getUserByHomeId(route.value.params.id)
      if (!userResponse.ok) {
        error({
          statusCode: userResponse.status,
          message: userResponse.statusText,
        })
      } else {
        return userResponse.json.hits[0]
      }
    })

    useMeta(() => ({
      title: home.value?.title,
    }))

    onMounted(async () => {
      const homeResponse = await $dataApi.getHome(route.value.params.id)
      if (!homeResponse.ok) {
        error({
          statusCode: homeResponse.status,
          message: homeResponse.statusText,
        })
      } else {
        home.value = homeResponse.json
      }
    })

    return {
      home,
      reviews,
      user,
    }
  },
  head: {},
})
</script>
