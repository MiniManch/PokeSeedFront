import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomeComp.vue';
import PokeTrainers from '../components/Trainers/ViewTrainers.vue';
import LoginComp from '../components/User/UserLogin.vue';
import RegisterComp from '../components/User/UserSignUp.vue';
import ViewPokemon from '../components/Poke/ViewPokemon.vue';
import PokemonProfile from '../components/Poke/PokemonProfile.vue';
import PlayGame from '../components/Game/PlayGame.vue';
import playerProfile from '../components/Game/GameProfile.vue';
import newTournament from '../components/Tournament/NewTournament.vue';




const routes = [
    { path: '/', component: HomePage, name: 'home', alias: '/home' },
    { 
        path: '/trainers', 
        component: PokeTrainers, 
        name: 'trainers',
        props: route => ({ choose: route.query.choose })
    },
    { path: '/login', component: LoginComp, name: 'login' },
    { path: '/signup', component: RegisterComp, name: 'signup' },
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
    {
        path: '/user/profile',
        component: playerProfile,
        name: 'playerProfile',
    },
    { path: '/tournament/new', component: newTournament, name: 'newTournament' },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
