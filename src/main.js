import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {firestorePlugin, rtdbPlugin} from 'vuefire'
Vue.use(firestorePlugin, rtdbPlugin)

import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
    projectId: 'fire-todo-d53d1',
    databaseURL: 'https://fire-todo-d53d1.firebaseio.com'
})
export const db = firebase.firestore();

Vue.prototype.$db = firebase.firestore();
Vue.prototype.$dateFormater = (date) => {
    let tmstmp = date.seconds ? new Date(1970, 0, 1).setSeconds(date.seconds) : date;
    let f_date = new Date(tmstmp),
        day = f_date.getDate() < 10 ? '0' + f_date.getDate() : f_date.getDate(),
        month = f_date.getMonth() + 1 < 10 ? '0' + (f_date.getMonth() + 1) : f_date.getMonth() + 1,
        year = f_date.getFullYear(),
        hour = f_date.getHours(),
        minutes = f_date.getMinutes() < 10 ? '0' + f_date.getMinutes() : f_date.getMinutes();

    return `${day}.${month}.${year} ${hour}:${minutes}`
};



import './assets/styles/main.scss'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
