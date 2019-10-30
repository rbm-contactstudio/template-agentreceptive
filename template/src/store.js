import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource';
import { Actions, Getters, Mutations, State } from '@contactstudio/agent-tools';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);
Vue.use(VueResource);

let myStore = new Vuex.Store({
  modules: {
    lib: {
      actions: Actions,
      getters: Getters,
      mutations: Mutations,
      namespaced: true,
      state: State
    },
    local: {
      actions,
      getters,
      mutations,
      state
    }
  }
});

export default myStore;
