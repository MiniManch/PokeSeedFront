<template>
    <div class="playerPanel" :class="{ opponentPanel: !isPlayer, userPanel: isPlayer }">
      <!-- Pokémon Stats -->
      <PokeStats
        :poke="poke"
        :currentHp="currentHp"
        :turn="turn"
        :isPlayer="isPlayer"
      />
  
      <!-- Pokémon Sprite -->
      <img 
        :src="pokeSprite" 
        class="Poke" 
        :class="{ 'userPoke': isPlayer, 'oppPoke': !isPlayer }"
        v-if="poke && currentHp" 
      />

      <!-- Moves and such -->
       <div class="moves" v-if="isPlayer">
        <div class="text"></div>
        <ul class="framed buttons compact options">
            <li><button class="button">Fight</button></li>
            <li><button class="pokemon button">PKMN</button></li>
            <li><button class="button">Item</button></li>
        </ul>

        <ul class="framed buttons compact options" v-if="fightMenu">
            <li><button class="button">Fight</button></li>
            <li><button class="pokemon">PKMN</button></li>
            <li><button class="button">Item</button></li>
            <li><button class="button">Run</button></li>
        </ul>

        <ul class="framed buttons compact options" v-if="itemMenu">
            <li><button class="button">Fight</button></li>
            <li><button class="pokemon">PKMN</button></li>
            <li><button class="button">Item</button></li>
            <li><button class="button">Run</button></li>
        </ul>
       </div>

    </div>
  </template>
  
  <script>
  import PokeStats from './PokeStats.vue';
  
  export default {
    props: {
      poke: {
        type: Object,
        required: true
      },
      currentHp: {
        type: Number,
        required: true
      },
      isPlayer: {
        type: Boolean,
        default: true
      },
      turn: {
        type: Boolean,
        default: false
      }
    },
    components: {
      PokeStats
    },
    computed: {
      pokeSprite() {
        // Use different sprites based on whether the Pokémon is the player's or the opponent's
        return this.isPlayer ? this.poke.backSprite : this.poke.frontSprite;
      }
    },
    methods: {
        openMenu(){

        }
    }
  };
  </script>
  
  <style scoped>
  .playerPanel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width:100%;
  }
  
  .userPanel {
    position: absolute;
    bottom: 0vh;
  }
  
  .opponentPanel {
    position: absolute;
  }
  
  .Poke {
    height: 50vh;
  }
  
  .userPoke {
    position: absolute;
    bottom: 10vh;
    left:8vw;
  }
  
  .oppPoke {
    position: absolute;
    top:0vh;
    right:10vw;
  }

  .options{
    position: absolute;
    right: 0;
    bottom: 10vh;
    height: 20vh;
    margin-right: 1vw;
    border-top: none;
    width:50%;

    font-size: 1.5em;
  }
  </style>
  