import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: '/',
            redirect: '/introduce'
        },
        {
            path: '/introduce',
            name: 'introduce',
            component: () =>
                import ('../views/Introduce.vue')
        }, {
            path: '/login',
            name: 'login',
            component: () =>
                import ('@/views/Login.vue')
        }, {
            path: '/dashboard',
            name: 'dashboard',
            component: () =>
                import ('@/views/Dashboard.vue')
        }, {
            path: '/add',
            name: 'add',
            component: () =>
                import ('@/views/AddGood.vue')
        }, {
            path: '/good',
            name: 'good',
            component: () =>
                import ('@/views/Good.vue')
        }, {
            path: '/swiper',
            name: 'swiper',
            component: () =>
                import ('@/views/Swiper.vue')
        }, {
            path: '/hot',
            name: 'hot',
            component: () =>
                import ('@/views/IndexConfig.vue')
        }, {
            path: '/new',
            name: 'new',
            component: () =>
                import ('@/views/IndexConfig.vue')
        }, {
            path: '/recommend',
            name: 'recommend',
            component: () =>
                import ('@/views/IndexConfig.vue')
        }, {
            path: '/category',
            name: 'category',
            component: () =>
                import ('@/views/Category.vue'),
            children: [{
                    path: '/level2',
                    name: 'level2',
                    component: () =>
                        import ('@/views/Category.vue')
                },
                {
                    path: '/level3',
                    name: 'level3',
                    component: () =>
                        import ('@/views/Category.vue')
                }
            ]
        }, {
            path: '/guest',
            name: 'guest',
            component: () =>
                import ('@/views/Guest.vue')
        }, {
            path: '/order',
            name: 'order',
            component: () =>
                import ('@/views/Order.vue')
        }, {
            path: '/order_detail',
            name: 'order_detail',
            component: () =>
                import ('@/views/Order_Detail.vue')
        }, {
            path: '/account',
            name: 'account',
            component: () =>
                import ('@/views/Account.vue')
        }
    ]
})

export default router