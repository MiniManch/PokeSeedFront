<template>
  <div class="pokeBattle" :style="{ backgroundImage: 'url(' + battleBg + ')' }">
    <!-- Opponent Panel -->
    <PlayerPanel
      :poke="oppPoke"
      :currentHp="oppPoke.stats.currentHp"
      :isPlayer="false"
      :turn="false"
      v-if="oppPoke "
    />

    <!-- Player Panel -->
    <PlayerPanel
      :poke="userPoke"
      :currentHp="userPoke.stats.currentHp"
      :isPlayer="true"
      :turn="true"
      @displayChngPoke="showChngPoke = true"
      @moveUsed="handleMoveUsage"
      v-if="userPoke"
    />

  </div>
  <ChangePoke
    :selectedPoke="userPoke"
    :pokemon="userPokemon"
    v-if="userPoke && userData.team && showChngPoke"
    @changePokeTo="changePlayingPokemon"
  />
</template>

<script>
import { getUserData } from '@/utils/auth';
import { getTrainerData } from '@/utils/crud';
import battleBgs from "@/assets/data/battleBgs.json";
import PlayerPanel from './PlayerPanel.vue';
import ChangePoke from './ChangePoke.vue';

export default {
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("PokeSeed_userData")),
      tournamentTree: JSON.parse(localStorage.getItem("PokeSeed_tournamentTree")),
      opponent: null,
      match: null,
      oppPoke: null,
      userPoke: null,
      battleBg: null,
      oppPokeHealth: null,
      userPokeHealth: null,
      showChngPoke: false,
      userPokemon: null,
    };
  },
  methods: {
    // Initialize moves with currentSp if already exists, otherwise use sp value
    initializeMoves(pokemon) {
      pokemon.moves.forEach(move => {
        if (!move.currentSp && move.sp) {
          move.currentSp = move.sp; // Only initialize if currentSp is missing
        }
      });
    },

    getRandomBattleBg() {
      const randomBg = battleBgs[Math.floor(Math.random() * battleBgs.length)];
      return randomBg.link;
    },

    // Save the game state to localStorage
    saveToLocalStorage() {
      const gameState = {
        userPokemon: this.userPokemon,
        userPoke: this.userPoke,
        userPokeHealth: this.userPoke.stats.currentHp,
        oppPoke: this.oppPoke,
        oppPokeHealth: this.oppPoke.stats.currentHp,
      };
      localStorage.setItem("PokeSeed_battleState", JSON.stringify(gameState));
    },

    // Load the game state from localStorage
    loadFromLocalStorage() {
      const savedState = localStorage.getItem("PokeSeed_battleState");
      if (savedState) {
        console.log('yes state')
        const gameState = JSON.parse(savedState);
        this.userPokemon = gameState.userPokemon;
        this.userPoke = gameState.userPoke;
        this.userPoke.stats.currentHp = gameState.userPokeHealth
        this.oppPoke = gameState.oppPoke;
        this.oppPoke.stats.currentHp = gameState.oppPokeHealth;

        // Re-initialize moves with currentSp
        this.userPokemon.forEach(poke => this.initializeMoves(poke));
        this.initializeMoves(this.oppPoke);

        return true;
      }
      return false;
    },

    // Find the game and set up opponent and user data
    async findGame() {
      const loadedFromLocalStorage = this.loadFromLocalStorage();

      if (!loadedFromLocalStorage) {
        let games = [];
        for (const match of this.tournamentTree.matches) {
          if (match.players.includes(this.userData.trainer)) {
            games.push(match);
          }
        }

        this.match = games.reduce((max, obj) =>
          obj.matchNumber > max.matchNumber ? obj : max
        );

        for (const player of this.match.players) {
          if (player !== this.userData.trainer) {
            this.opponent = await getTrainerData(this, player);
            console.log(this.opponent)
            this.oppPoke = this.opponent.team[0];
            this.userPokemon = this.userData.team.map((obj) => {
              // Keep currentHp if it exists, otherwise set it to max hp
              if (!obj.stats.currentHp) {
                obj.stats.currentHp = obj.stats.hp;
              }
              this.initializeMoves(obj); // Initialize moves with currentSp
              return obj;
            });
            this.userPoke = this.userPokemon[0];

            // Initialize moves for the opponent's Pokémon as well
            this.initializeMoves(this.oppPoke);
          }
        }

        // Save the initialized game state to localStorage
        this.saveToLocalStorage();
      }
    },

    // Method to handle move usage and update currentSp
    handleMoveUsage(move) {
      const moveIndex = this.userPoke.moves.findIndex(m => m.name === move.name);
      if (moveIndex !== -1 && this.userPoke.moves[moveIndex].currentSp > 0) {
        // Decrement currentSp by 1 when the move is used
        this.userPoke.moves[moveIndex].currentSp -= 1;
        this.saveToLocalStorage(); // Save the updated state
      }
    },

    // Change the currently playing Pokémon
    changePlayingPokemon(poke) {
      const currentPokeIndex = this.userPokemon.findIndex(
        (p) => p.name === this.userPoke.name
      );

      if (currentPokeIndex !== -1) {
        // Put the current active Pokémon back into the user's Pokémon array
        this.userPokemon[currentPokeIndex] = this.userPoke;
      }

      // Set the new selected Pokémon as the active one
      this.userPoke = poke;

      // Close the change Pokémon screen
      this.showChngPoke = false;

      // Save the updated state to localStorage
      this.saveToLocalStorage();
    },
  },
  async mounted() {
    this.battleBg = this.getRandomBattleBg();
    await getUserData(this);
    await this.findGame();
  },
  components: {
    PlayerPanel,
    ChangePoke,
  },
};
</script>

<style>
.pokeBattle {
  position: relative;
  width: 80vw;
  height: 100vh;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.Poke {
  height: 50vh;
}
</style>
