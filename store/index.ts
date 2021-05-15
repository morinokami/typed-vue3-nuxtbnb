import { getAccessorType } from 'typed-vuex'
import * as auth from './auth'

export const accessorType = getAccessorType({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { auth },
})
