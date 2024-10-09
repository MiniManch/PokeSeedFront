<template>
    <div>
        <div class="replacePoke">
            <ul class="framed buttons">
                <li class="pokes" v-for="poke in pokemonData" :key="poke.name">
                    <img 
                        :src="poke.frontSprite" 
                        alt="" 
                        :class="{ 'animate__shakeX': poke.isHovered }"
                        @mouseenter="animatePokemon(poke, true)"
                        @mouseleave="animatePokemon(poke, false)"
                        @click="selectPokemon(poke)"
                        class="animate__animated"
                    >
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { fetchPokemonByName } from '@/utils/crud';

export default {
    props: {
        pokemon: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            pokemonData: []  // Initialize pokemonData as an empty array
        };
    },
    async created() {
        this.pokemonData = await this.loadPokemonData();
    },
    methods: {
        async loadPokemonData() {
            const data = [];
            for (const poke of this.pokemon) {
                const pokeData = await fetchPokemonByName(poke.name);
                pokeData.isHovered = false; // Add a flag for hover state
                data.push(pokeData);
            }
            console.log(data);
            return data;
        },
        animatePokemon(poke, isHovered) {
            poke.isHovered = isHovered; // Toggle hover state based on the event
        },
        selectPokemon(poke){
            this.$emit("select",poke.name)
        }
    }
}
</script>

<style scoped>
ul {
    display: flex;
    flex-direction: row;
}

img {
    width: 8vw;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

img.hovered {
    transform: scale(1.2); /* Scale up the image on hover */

}
</style>
