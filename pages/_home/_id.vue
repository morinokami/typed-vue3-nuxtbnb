<template>
  <div>
    <template v-if="home">
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
    </template>
    <div ref="mapRef" style="height: 800px; width: 800px"></div>
    <template v-if="reviews">
      <div v-for="review in reviews" :key="review.objectID">
        <img :src="review.reviewer.image" /><br />
        {{ review.reviewer.name }}<br />
        {{ formatDate(review.date) }}<br />
        <short-text :text="review.comment" :target="150" /><br />
      </div>
      <template v-if="user">
        <img :src="user.image" />
        {{ user.name }}<br />
        {{ formatDate(user.joined) }}<br />
        {{ user.reviewCount }}<br />
        {{ user.description }}<br />
      </template>
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
import { HomeType } from '~/types'

export default defineComponent({
  setup() {
    const { error, $dataApi, $maps } = useContext()
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
    const mapRef = ref<HTMLElement | null>(null)

    useMeta(() => ({
      title: home.value?.title,
    }))

    onMounted(async () => {
      if (mapRef.value) {
        const homeResponse = await $dataApi.getHome(route.value.params.id)
        if (!homeResponse.ok) {
          error({
            statusCode: homeResponse.status,
            message: homeResponse.statusText,
          })
        } else {
          home.value = homeResponse.json
          $maps.showMap(
            mapRef.value,
            home.value._geoloc.lat,
            home.value._geoloc.lng
          )
        }
      }
    })

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    }

    return {
      home,
      reviews,
      user,
      mapRef,
      formatDate,
    }
  },
  head: {},
})
</script>
