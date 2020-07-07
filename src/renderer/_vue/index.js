import "../../common/system-ca"
import "./assets/css/app.scss"
import "prismjs";
import "prismjs/components/prism-yaml"
import { PromiseIpc } from 'electron-promise-ipc'
import Vue from 'vue'
import VueElectron from 'vue-electron'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import { userStore } from "../../common/user-store"
import { workspaceStore } from "../../common/workspace-store"
import { clusterStore } from "../../common/cluster-store"

const promiseIpc = new PromiseIpc({maxTimeoutMs: 6000});

promiseIpc.on('navigate', async (view) => {
  router.push(view).catch(err => {})
});

Vue.config.productionTip = false
Vue.use(VueElectron)
Vue.use(BootstrapVue)

Vue.mixin({
  created: function () {
    this.$promiseIpc = promiseIpc;
  }
})

setTimeout(async () => {
  await Promise.all([
    userStore.whenLoaded,
    workspaceStore.whenLoaded,
    clusterStore.whenLoaded,
  ]);

  await store.dispatch('init')
  new Vue({
    components: {App},
    store,
    router,
    template: '<App/>'
  }).$mount('#app')
})
