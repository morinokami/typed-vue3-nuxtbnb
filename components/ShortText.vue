<template>
  <span
    >{{ displayText }}
    <button
      v-if="isTooLong && !isExpanded"
      class="link"
      @click="isExpanded = true"
    >
      read more
    </button>
    <button
      v-if="isTooLong && isExpanded"
      class="link"
      @click="isExpanded = false"
    >
      read less
    </button>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const getChunks = () => {
      const position = props.text.indexOf(' ', props.target)
      if (props.text.length <= props.target || position === -1) {
        return [props.text]
      }
      return [props.text.substring(0, position), props.text.substring(position)]
    }
    const isExpanded = ref(false)
    const chunks = ref(getChunks())
    const isTooLong = computed(() => chunks.value.length === 2)
    const displayText = computed(() => {
      if (!isTooLong.value || isExpanded.value) {
        return chunks.value.join(' ')
      }
      return chunks.value[0] + '...'
    })

    return { isExpanded, isTooLong, displayText }
  },
})
</script>

<style scoped>
.link {
  color: blue;
  background-color: white;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}
.link:focus {
  border: none;
  outline: none;
}
</style>
