<template>
    <div class="NavBar"> 
            <div class="pokemon tab"
                @mouseover="mouseOn('pokeball')"
                @mouseleave="mouseOut('pokeball')"
                @click="directToLink('/game/selectPokemon')"
            >
                <img :src="pokeballUrl" class="icon">
                <p>Play</p>
            </div>
            <div class="pokedex tab"
                @mouseenter="mouseOn('pokedex')"
                @mouseleave="mouseOut('pokedex')"
            >
                <img :src="pokedexUrl" class="icon"> 
                <p>Pokemon</p>
            </div>
            <div class="trainers tab"
                @mouseenter="mouseOn('trainers')"
                @mouseleave="mouseOut('trainer')"
                @click="directToLink('/trainers')"
            >
                <img :src="trainersUrl" class="icon">
                <p>Trainers</p>
            </div>
            <div class="user"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            pokeballUrl:"/images/pokeball/pokeball-black-50.png",
            pokedexUrl:"/images/pokedex/pokedex-black-50.png",
            trainersUrl:"/images/trainer/trainer-black-50.png",
        }
    },
    methods:{
        mouseOn(tabName){
            if(tabName == 'pokeball'){
                this.pokeballUrl = "/images/pokeball/pokeball-white-50.png";
            }
            if(tabName == 'pokedex'){
                this.pokedexUrl = "/images/pokedex/pokedex-white-50.png";
            }
            if(tabName == 'trainers'){
                this.trainersUrl = "/images/trainer/trainer-white-50.png";
            }
        },
        mouseOut(tabName){
            if(tabName == 'pokeball'){
                this.pokeballUrl = "/images/pokeball/pokeball-black-50.png";
            }
            if(tabName == 'pokedex'){
                this.pokedexUrl = "/images/pokedex/pokedex-black-50.png";
            }
            if(tabName == 'trainer'){
                this.trainersUrl = "/images/trainer/trainer-black-50.png";
            }
        },
        directToLink(link){
            if(link == '/trainers'){
                this.$router.push({ 
                    name: 'trainers', 
                    query: { choose: false } 
                });
            }
            this.$router.push(link);
        }
    }
}
</script>
<style scoped>
    .NavBar{
        min-height:fit-content;
        width:100vw;
        position: fixed;
        display: flex;
        justify-content: center;
    }
    .container{
        width: 30%;
        height:100%;
        display: flex;
        justify-content: center;
    }
    img{
        width: 50px;
    }
    .tab{
        padding-top:2vh ;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.8em;
        width: 6vw; 
        transition: all 0.5s;
    }
    .pokemon:hover{
        background-color: #ff0000;
    }
    .pokedex:hover{
        background-color: #3b4cca;
    }
    .trainers:hover{
        background-color: #ffde00;
    }
</style>
