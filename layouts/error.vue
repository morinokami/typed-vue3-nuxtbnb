<template>
  <div style="text-align: center">
    <img
      src="https://media1.tenor.com/images/99f00b32545bf5b5db8bf8ecbb7f0aec/tenor.gif?itemid=7971019"
    /><br /><br />
    <h1>Error!</h1>
    {{ error.message }} {{ error.statusCode }}
  </div>
</template>

<script lang="ts">
import { NuxtError } from '@nuxt/types'
import { defineComponent, PropType, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      required: true,
    },
  },
  setup() {
    useMeta(() => ({
      title: 'BIG PROBLEMS',
    }))

    return {}
  },
  head: {},
})
</script>
