<template>
  <div style="clear: left">
    <img
      :src="home.images[0]"
      style="width: 200px; float: left; padding: 10px"
    /><br />
    {{ home.title }}<br />
    {{ home.location.address }} {{ home.location.city }} {{ home.location.state
    }}<br />
    {{ pluralize(home.guests, 'guest') }},
    {{ pluralize(home.bedrooms, 'room') }}, {{ pluralize(home.beds, 'bed') }},
    {{ pluralize(home.bedrooms, 'bath') }}<br />
    {{ home.pricePerNight }} / night<br />
    <img src="/images/star.svg" width="20" height="20" />
    {{ home.reviewValue }} ({{ home.reviewCount }})<br />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { HomeType } from '~/types'

export default defineComponent({
  props: {
    home: {
      type: Object as PropType<HomeType>,
      required: true,
    },
  },
  setup() {
    const pluralize = (n: number, singularWord: string) => {
      const text = `${n} ${singularWord}`
      return n === 1 ? text : text + 's'
    }

    return { pluralize }
  },
})
</script>
