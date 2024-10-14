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
    <div class="moves" v-if="isPlayer && !showMoves">
      <ul class="framed buttons compact options">
        <li><button class="button" @click="openFightMenu">Fight</button></li>
        <li><button class="pokemon button" @click="openChngPoke">PKMN</button></li>
        <li><button class="button">Item</button></li>
      </ul>
    </div>

    <!-- Moves Menu -->
    <div class="movesList" v-if="isPlayer && showMoves">
      <ul class="framed buttons compact move-options">
        <li v-for="move in poke.moves" :key="move.name">
          <button
            class="button"
            @click="useMove(move)"
            :disabled="!turn"
          >
          {{ move.name }} <br> (PP: {{ move.currentSp }}/{{ move.sp }})
        </button>
        </li>
      </ul>
      <button class="button back" @click="closeFightMenu">Back</button>
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

.options, .move-options {
  position: absolute;
  right: 0;
  bottom: 10vh;
  height: 20vh;
  margin-right: 1vw;
  width: 50%;
  font-size: 1.5em;
  background: white;
}

.movesList .button {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.back {
  margin-top: 15px;
  width: auto;
}
</style>
