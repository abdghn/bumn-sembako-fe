import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/import',
                    name: 'import',
                    component: () => import('@/views/pages/import/List.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/participant',
                    name: 'participant',
                    component: () => import('@/views/pages/participant/List.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/participant/:id',
                    name: 'participantdetail',
                    component: () => import('@/views/pages/participant/Detail.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/participant/edit/:id',
                    name: 'participantedit',
                    component: () => import('@/views/pages/participant/Edit.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/pages/user/List.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/report',
                    name: 'report',
                    component: () => import('@/views/pages/report/List.vue'),
                    meta: {
                        requiredAuthorization: true,
                        apps: 'all'
                    }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/register-yayasan',
            name: 'register-yayasan',
            component: () => import('@/views/pages/auth/RegisterYayasan.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {

    // if (authRequired && token) {
    //     return '/'
    // } else {
    //     return '/auth/login';
    // }

    // const token =  window.localStorage.getItem("token")
    //
    //  if(token) {
    //
    //  } else {
    //      next('auth/login')
    //  }

    const token = window.localStorage.getItem("token")
    if(to.path === '/auth/login'){
        if(token){
            next('/')
        }
    }

    if(to.path === '/'){
        if(!token){
            next('/auth/login')
        }
    }


    if (to.meta.requiredAuthorization) {
        if (!token) {
            next('/auth/login')
        }
        // const base64Url = token.split('.')[1];
        // console.log(base64Url)
        // if (!base64Url) {
        //     next('/auth/login')
        // }
        // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        // }).join(''));
        // const user = JSON.parse(jsonPayload);

        next()

    } else {
        next()
    }

})

export default router;
