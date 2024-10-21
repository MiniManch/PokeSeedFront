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

    <!-- Player's Action Menu -->
      <ul class="framed buttons compact options" id="mainMenu" v-if="isPlayer && !showMoves" >
        <li><button class="" @click="openFightMenu">Fight</button></li>
        <li><button class="" @click="openChngPoke">Pokemon</button></li>
        <li><button class="">Item</button></li>
      </ul>

    <!-- Moves Menu -->
    <div class="movesList" v-if="isPlayer && showMoves">
      <ul class="framed buttons compact move-options">
        <div class="movesContainer">
          <li v-for="move in poke.moves" :key="move.name">
            <button
              class="button"
              @click="useMove(move)"
              :disabled="!turn"
            >
            {{ move.name }} <br> (PP: {{ move.currentSp }}/{{ move.sp }})
          </button>
          </li>
        </div>
      <button class="back" @click="closeFightMenu"><img src="../../../public/Images/back/back-50.png" alt="" id="backButtonImage"></button>
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
    },
  },
  data() {
    return {
      showMoves: false
    };
  },
  components: {
    PokeStats
  },
  computed: {
    pokeSprite() {
      return this.isPlayer ? this.poke.backSprite : this.poke.frontSprite;
    },
  },
  methods: {
    openFightMenu() {
      this.showMoves = true;
    },
    closeFightMenu() {
      this.showMoves = false;
    },
    openChngPoke() {
      this.$emit("displayChngPoke");
    },
    useMove(move){
      this.$emit('moveUsed',move,'user');
    } 
  },
  mounted(){
    console.log('turn',this.turn);
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
  width: 100%;
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
  left: 8vw;
}

.oppPoke {
  position: absolute;
  top: 0vh;
  right: 10vw;
}

.options{
  width: 50%;
}

.options, .move-options {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  right: 0;
  bottom: 10vh;
  height: 20vh;
  width: 50%;
  margin-right: 1vw;
  font-size: 1.5em;
  background: white;
}

.movesContainer{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: 3vw;
}

#mainMenu {
  display: flex;
  align-items: center;
  font-size: 2em;
}

#mainMenu > li{
  margin-left: auto;
  width:5vw;
}


.movesList  {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.back {
  width: auto;
  justify-self: flex-start;
}

.buttons{
  border-top:none;
}
</style>
