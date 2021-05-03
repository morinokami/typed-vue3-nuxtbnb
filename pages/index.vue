<template>
  <div>
    <div
      v-for="home in homes"
      :key="home.objectID"
      style="float: left; margin: 10px"
    >
      <nuxt-link :to="`/home/${home.objectID}`" prefetch>
        <home-card :home="home" />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import homes from '~/data/homes.json'

export default defineComponent({
  setup() {
    useMeta({
      title: 'Homepage',
      meta: [
        {
          name: 'description',
          content: 'This is a homepage',
          hid: 'description',
        },
      ],
    })

    return {
      homes: homes.slice(0, 3),
    }
  },
  head: {},
})
</script>
