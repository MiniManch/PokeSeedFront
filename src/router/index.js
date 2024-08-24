import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomeComp.vue';
import PokeTrainers from '../components/Trainers/ViewTrainers.vue';
import LoginComp from '../components/User/UserLogin.vue';
import ViewPokemon from '../components/Poke/ViewPokemon.vue';
import PokemonProfile from '../components/Poke/PokemonProfile.vue';
import PlayGame from '../components/Game/PlayGame.vue';


const routes = [
    { path: '/', component: HomePage, name: 'home', alias: '/home' },
    { 
        path: '/trainers', 
        component: PokeTrainers, 
        name: 'trainers',
        props: route => ({ choose: route.query.choose })
    },
    { path: '/login', component: LoginComp, name: 'login' },
    { path: '/pokedex', component: ViewPokemon, name: 'viewPokemon' },
    {
        path: '/game',
        component: PlayGame,
        name: 'PlayGame'
    },
    {
        path: '/pokemon/profile/:name',
        component: PokemonProfile,
        name: 'pokemonProfile',
        props: route => ({ choose: route.query.choose })
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
