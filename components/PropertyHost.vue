<template>
  <div v-if="user" class="app-background-grey">
    <div class="app-wrapper app-padded-vertical">
      <div class="app-host-header">
        <div><img :src="user.image" /></div>
        <div>
          <div class="app-host-name">{{ user.name }}</div>
          <div class="app-host-date">
            Joined in {{ shortDate(user.joined) }}
          </div>
          <div class="app-flex">
            <div class="app-host-reviews">
              {{ user.reviewCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="app-host-description">{{ user.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import shortDate from '~/utils/shortDate'
import { UserType } from '~/types'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserType>,
      required: true,
    },
  },
  setup() {
    return { shortDate }
  },
})
</script>
