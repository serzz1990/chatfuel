import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        query: {
            lastId: 0,
            searchTerm: ''
        },
        isFull: false,
        list: []
    },
    getters: {
        isFull (state) {
            return state.isFull
        },
        list (state) {
            return state.list
        }
    },
    actions: {
        reset ({commit}) {
            commit('list', [], true)
            commit('isFull', false)
            commit('query', {key: 'lastId', value: 0})
            commit('query', {key: 'searchTerm', value: ''})
        },

        changeQuery ({ commit, dispatch }, {key, value}) {
            commit('query', {key, value})
            commit('query', {key: 'lastId', value: 0})
            return dispatch('fetchList', true)
        },

        fetchUser ({ commit }, id) {},

        fetchList ({ commit, state }, updateList) {
            return Vue.http.get(`/api/users`, {params: state.query})
                .then(res => res.json())
                .then(json => {
                    commit('list', {list: json.result, updateList})
                    commit('isFull', json.last)
                })
        }
    },
    mutations: {
        isFull (state, val) {
            state.isFull = val
        },

        query (state, {key, value}) {
            state.query[key] = value
        },

        list (state, {list = [], updateList = false}) {
            let last = list[list.length - 1]
            state.list = updateList ? list : state.list.concat(list)
            state.query.lastId = (last && last.id) ? last.id : 0
        }
    }
}
