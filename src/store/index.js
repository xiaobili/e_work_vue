import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 菜单栏
        routes: [],
        // 用户信息
        user: {},
    },
    mutations: {
        initRoutes(state, data) {
            state.routes = data;
        },
        setUser(state, data) {
            state.user = data;
        }
    },
    actions: {
    }
});