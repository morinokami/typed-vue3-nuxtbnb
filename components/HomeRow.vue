<template>
  <div>
    <div
      class="app-house-header"
      :style="`background-image: url(${home.images[0]})`"
    ></div>
    <div class="app-house-body">
      <img src="/images/icons/heart.svg" class="app-fav" />
      <h2>{{ home.title }}</h2>
      <div class="app-address">
        {{ home.location.address }} {{ home.location.city }}
        {{ home.location.state }}
      </div>
      <div class="app-amenities">
        <p>
          {{ pluralize(home.guests, 'guest') }},
          {{ pluralize(home.bedrooms, 'room') }},
          {{ pluralize(home.beds, 'bed') }},
          {{ pluralize(home.bedrooms, 'bath') }}
        </p>
        <p>{{ features }}</p>
      </div>
      <div class="app-flex">
        <div class="app-rating">
          {{ home.reviewValue }}
          <span>({{ home.reviewCount }})</span>
        </div>
        <div class="app-price">
          ${{ home.pricePerNight }}<span>/ night</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import pluralize from '~/utils/pluralize'
import { HomeType } from '~/types'

export default defineComponent({
  props: {
    home: {
      type: Object as PropType<HomeType>,
      required: true,
    },
  },
  setup(props) {
    const features = computed(() => props.home.features.slice(0, 3).join(', '))

    return { features, pluralize }
  },
})
</script>
