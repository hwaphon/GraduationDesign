import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  currentIndex: -1
}

const mutations = {
  UPDATECURRENTINDEX (state, index) {
    state.currentIndex = index
  }
}

const actions = {
  updateCurrentIndex (context, index) {
    context.commit('UPDATECURRENTINDEX', index)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [ createPersistedState(
    {
      paths: ['currentIndex']
    }
  )]
})
