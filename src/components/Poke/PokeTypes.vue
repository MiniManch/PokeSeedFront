<template >
        <div class="Container">
            <template v-if="Pokemon">
                <PokemonCard
                class="PokemonCard"
                v-for="item in Pokemon"
                :choose="choose"
                :pokemon="item"
                :key="item.name"
            />
            </template>
            <template v-else>
                <TypeCard
                class="pokeTypeCard"
                :PokeType="item"
                v-for="item in data"
                :key="item.name"
                @click="ShowTypePokemon(item.name)"
            />
            </template> 
        </div>
</template>

<script>
import TypeCard from './TypeCard.vue';
import PokemonCard from './PokemonCard.vue';
import typeData from '@/assets/data/typeIcons.json';

export default {
    props:{
        choose:{
            type:Boolean,
            required:false,
        }
    },
    data(){
        return{
            data : typeData,
            Pokemon:null,
            selectedType:null,
        }
    },
    methods:{
        ShowTypePokemon(pokeType){
            this.selectedType = pokeType;
            this.fetchPokemonByType();
        },
        async fetchPokemonByType() {
            try {
                const response = await fetch(`/api/pokemon/type/${this.selectedType}`);
                if (!response.ok) {
                throw new Error('Failed to fetch Pokémon');
                }
                this.Pokemon = await response.json();
                console.log(this.Pokemon)
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching Pokémon:', error);
            }
        }
    },
    components:{
        TypeCard,
        PokemonCard
    }
}
</script>

<style scoped>
.Container {
    height: 50vh;
    width:50vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

</style>