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
import {fetchPokemonByType} from '@/utils/crud';

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
            fetchPokemonByType(this);
        },
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