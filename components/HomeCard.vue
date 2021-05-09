<template>
  <div>
    <img :src="home.images[0]" style="width: 200px" /><br />
    {{ home.title }}<br />
    {{ home.location.address }} {{ home.location.city }} {{ home.location.state
    }}<br />
    {{ home.guests }} guests<br />
    {{ home.pricePerNight }} / night<br />
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
})
</script>
