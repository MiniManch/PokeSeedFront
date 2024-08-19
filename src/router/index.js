import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomeComp.vue';
import PokeTrainers from '../components/Trainers/ViewTrainers.vue';
import LoginComp from '../components/User/UserLogin.vue';
import SelectPokemon from '../components/Game/SelectPokemon.vue';


const routes = [
    { path: '/', component: HomePage, name: 'home', alias:'/home' },
    { path: '/trainers', component: PokeTrainers, name: 'trainers' },
    { path: '/login', component: LoginComp, name: 'login' },
    { path: '/game/selectPokemon', component: SelectPokemon, name: 'SelectPokemon' },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
