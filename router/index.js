import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: Home, name: 'home',alias:'/home' },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;