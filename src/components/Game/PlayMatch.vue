<template>
  
  <div class="pokeBattle" :style="{ backgroundImage: 'url(' + battleBg + ')' }">

    <!-- Opponent Panel -->
    <PlayerPanel
      :poke="oppPoke"
      :currentHp="oppPokeHealth"
      :isPlayer="false"
      :turn="false"
      v-if="oppPoke && oppPokeHealth"
    />

    <!-- Player Panel -->
    <PlayerPanel
      :poke="userPoke"
      :currentHp="userPokeHealth"
      :isPlayer="true"
      :turn="true"
      @displayChngPoke="showChngPoke = true"
      v-if="userPoke && userPokeHealth"
    />

  </div>
  <ChangePoke
    :selectedPoke='userPoke'
    :pokemon="userPokemon"
    v-if="userPoke && userData.team && showChngPoke"
    @changePokeTo="changePlayingPokemon"
    />
</template>

<script>
import { getUserData } from '@/utils/auth';
import { getTrainerData } from '@/utils/crud';
import battleBgs from "@/assets/data/battleBgs.json";
import PlayerPanel from './PlayerPanel.vue'; // Import PlayerPanel component
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
    // Method to get a random battle background
    getRandomBattleBg() {
      const randomBg = battleBgs[Math.floor(Math.random() * battleBgs.length)];
      return randomBg.link;
    },

    // Save current state to localStorage
    saveToLocalStorage() {
      const gameState = {
        userPokemon: this.userPokemon,
        userPoke: this.userPoke,
        userPokeHealth: this.userPokeHealth,
        oppPoke: this.oppPoke,
        oppPokeHealth: this.oppPokeHealth,
      };
      localStorage.setItem("PokeSeed_battleState", JSON.stringify(gameState));
    },

    // Restore game state from localStorage
    loadFromLocalStorage() {
      const savedState = localStorage.getItem("PokeSeed_battleState");
      if (savedState) {
        const gameState = JSON.parse(savedState);
        this.userPokemon = gameState.userPokemon;
        this.userPoke = gameState.userPoke;
        this.userPokeHealth = gameState.userPokeHealth;
        this.oppPoke = gameState.oppPoke;
        this.oppPokeHealth = gameState.oppPokeHealth;
        return true;
      }
      return false;
    },

    // Find the game and load player and opponent data
    async findGame() {
      // Try to load state from localStorage
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
            this.oppPoke = this.opponent.team[0];
            this.userPokemon = this.userData.team.map((obj) => {
              obj.stats.currentHp = obj.stats.hp;
              return obj;
            });
            this.userPoke = this.userPokemon[0];
            this.oppPokeHealth = this.oppPoke.stats.hp;
            this.userPokeHealth = this.userPoke.stats.hp;
          }
        }

        // Save the initialized game state to localStorage
        this.saveToLocalStorage();
      }
    },

    // Method to change the currently playing Pokémon
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

      // Update the user's Pokémon health in case it was changed in the UI
      this.userPokeHealth = this.userPoke.stats.hp;

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
