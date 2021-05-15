import { actionTree, getterTree, mutationTree } from 'typed-vuex'

export const state = () => {
  return {
    counter: 0,
  }
}

export const getters = getterTree(state, {
  myGetter: (state) => state.counter + 1000,
})

export const mutations = mutationTree(state, {
  setCounter(state, value) {
    state.counter = value
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    counterUp({ state, commit }) {
      commit('setCounter', state.counter + 1)
    },
  }
)
