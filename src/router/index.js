import VueRouter from 'vue-router';
import Vue from 'vue';
import Goods from '@/components/goods/goods';
import Seller from '@/components/seller/seller';
import Ratings from '@/components/ratings/ratings';

Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/goods'

        }, {
            path: '/goods',
            component: Goods
        }, {
            path: '/ratings',
            component: Ratings
        }, {
            path: '/seller',
            component: Seller
        }
    ],
    linkActiveClass: 'ac'
});

export default router;
