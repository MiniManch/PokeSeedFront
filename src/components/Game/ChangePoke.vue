<template>
    <div class="changePoke">

        <div class="selectedPoke">
            <img :src="selectedPoke.pokeDexImg" alt="">
            <div class="pokeStats">
                <p>{{selectedPoke.name}}</p>
                <div class="healthBar">
                    <div class="bar-background">
                      <p>HP</p>
                      <div class="bar" :style="{ width: `${widthOfHealthBar(selectedPoke)}%`, backgroundColor: healthBarColor(selectedPoke) }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="availablePoke">
            <div :class="['poke',currentPokemon === poke ? justifyStart : null]" class="poke" v-for="poke in relevantPoke" :key="poke.name">
                <div class="imgAndStats">
                    <img :src="poke.pokeDexImg" alt="">

                    <div class="pokeStats" v-if="currentPokemon !== poke">
                        <p>{{poke.name}}</p>
                        <div class="healthBar">
                            <div class="bar-background">
                              <p>HP</p>
                              <div class="bar" :style="{ width: `${widthOfHealthBar(poke)}%`, backgroundColor: healthBarColor(poke) }"></div>
                            </div>
                        </div>
                    </div>

                    <div class="moves" v-if="currentPokemon === poke">
                        <div class="move" v-for="move in poke.moves" :key="move.name">
                            <viewPokeMove :move="move" />
                        </div>
                    </div>
                </div>

                <div class="buttons" v-if="poke.stats.currentHp > 0">
                    <button class="button" @click="displayMoves(poke)">
                        {{ currentPokemon === poke ? 'Hide Moves' : 'View Moves' }}
                    </button>
                    <button class="button" @click="changePokeTo(poke)">
                       choose {{poke.name}}!
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import viewPokeMove from './viewPokeMove.vue';

export default {
    props: {
        pokemon: {
            type: Array
        },
        selectedPoke: {
            type: Object
        }
    },
    data() {
        return {
            currentPokemon: null,
            justifyStart:'justifyStart'
        };
    },
    computed: {
        relevantPoke() {
            return this.pokemon.filter(obj => obj.name != this.selectedPoke.name)
        },
    },
    methods: {
        widthOfHealthBar(poke) {
            if (poke.stats.currentHp > 0) {
                return Math.floor((poke.stats.currentHp / poke.stats.hp) * 100)
            }
            return 0;
        },
        healthBarColor(poke) {
            console.log(poke)
            const percentage = (poke.stats.hp / poke.stats.currentHp) * 100;
            if (percentage > 60) {
                return "green";
            } else if (percentage > 30) {
                return "yellow";
            } else {
                return "red";
            }
        },
        displayMoves(poke) {
            // Toggle moves display for the clicked Pokemon
            if (this.currentPokemon === poke) {
                this.currentPokemon = null; // Hide moves if already selected
            } else {
                this.currentPokemon = poke; // Show moves for the selected Pokemon
            }
        },
        changePokeTo(poke){
            this.$emit("changePokeTo",poke)
        }
    },
    components: {
        viewPokeMove,
    }
}
</script>

<style scoped >
.changePoke{
    height:100vh;
    width:100vw;
    z-index: 3;
    display: flex;
    flex-direction: row;
    position: absolute;
    top:0;
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d86y3jj-26cb5089-c206-4f0d-83e3-3347c354ba17.png/v1/fit/w_800,h_480,q_70,strp/x_and_y_menu_background_1_by_phoenixoflight92_d86y3jj-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDgwIiwicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODZ5M2pqLTI2Y2I1MDg5LWMyMDYtNGYwZC04M2UzLTMzNDdjMzU0YmExNy5wbmciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.brFQ805zF5HwQabd2sYFB-M1oDUGSCy0Id0dbdqN9pQ');
}

.selectedPoke{
    width:50%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.availablePoke{
    height:100%;
    width:50%;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: flex-start;
    gap:5vh;
}
    
.poke{
    display: flex;
    flex-direction: column;
    align-items: center;
    height:25%;
}

.imgAndStats{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: relative;
    height: 100%;
}

.healthBar {
    align-self: center;
    width: 15vw;
  }
  
  .bar-background {
    display: flex;
    align-items: center;
    background: grey;
  }

  .bar-background > p{
    padding-left: 1vh;
    padding-right: 1vh;
    color: orange;
  }

  .bar {
    height: 4vh;
    background-color: green;
    margin-right: 1vw;
    transition: width 1s ease-in-out, background-color 1s ease-in-out; /* Smooth transitions */
  }

  .moves{
    width:30vw;
    height:30vh;
    display: flex;
    justify-content: flex-start;
    gap: 2vw;
  }
  
  .move{
    width:fit-content;
  }

  .pokeStats{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pokeStats::after{
    box-shadow: none;
  }

  .pokeStats > p {
    text-transform: uppercase;
  }
  .buttons{
    display: flex;
    justify-content: flex-start;
    width: 100%;
    gap: 3vw;
  }
  img{
    width:10vw;
    height:20vh;
  }
</style>