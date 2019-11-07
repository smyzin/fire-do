import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/pages/index'
import ListPage from '@/pages/page/index'
import DetailsPage from '@/pages/page/details'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'page',
                component: ListPage,
            },
            {
                path: '/:id',
                name: 'detail',
                component: DetailsPage,
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
