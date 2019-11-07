import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        current_page: 1
    },
    mutations: {
        changePageNumber(state, number){
            state.current_page = number;
        }
    },
    actions: {
        changePageNumber({state, commit}, number = 1){
            commit('changePageNumber', number)
        }
    },
    modules: {}
})
