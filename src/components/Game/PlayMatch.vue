<template>
  <div class="pokeBattle" :style="{ backgroundImage: 'url(' + battleBg + ')' }">
    <!-- Opponent Panel -->
    <PlayerPanel
      :poke="oppPoke"
      :currentHp="oppPoke.stats.currentHp"
      :isPlayer="false"
      :turn="false"
      v-if="oppPoke"
    />

    <!-- Player Panel -->
    <PlayerPanel
      :poke="userPoke"
      :currentHp="userPoke.stats.currentHp"
      :isPlayer="true"
      :turn="true"
      @displayChngPoke="showChngPoke = true"
      @moveUsed="handleMoveUsage(this.userPoke,this.oppPoke)"
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
import { getUserData } from "@/utils/auth";
import { getTrainerData } from "@/utils/crud";

import battleBgs from "@/assets/data/battleBgs.json";
import attackTypes from "@/assets/data/typeOfAttks.json";

import PlayerPanel from "./PlayerPanel.vue";
import ChangePoke from "./ChangePoke.vue";

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
      opponentPokemon: null, // Added opponent's Pokémon array
    };
  },
  methods: {
    // Initialize moves with currentSp if already exists, otherwise use sp value
    initializeMoves(pokemon) {
      pokemon.moves.forEach((move) => {
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
        oppPokemon: this.opponentPokemon, // Save opponent's full team
      };
      localStorage.setItem("PokeSeed_battleState", JSON.stringify(gameState));
    },

    // Load the game state from localStorage
    async loadFromLocalStorage() {
      const savedState = localStorage.getItem("PokeSeed_battleState");
      if (savedState) {
        const gameState = JSON.parse(savedState);

        // Load the user's Pokémon and health
        this.userPokemon = gameState.userPokemon;
        this.userPoke = gameState.userPoke;
        this.userPoke.stats.currentHp = gameState.userPokeHealth;

        // Load the opponent's Pokémon and health
        this.opponentPokemon = gameState.oppPokemon;
        this.oppPoke = gameState.oppPoke;
        this.oppPoke.stats.currentHp = gameState.oppPokeHealth;

        // Initialize moves for both user and opponent Pokémon
        this.userPokemon.forEach((poke) => this.initializeMoves(poke));
        this.initializeMoves(this.oppPoke);

        return true;
      }
      return false;
    },

    // Find the game and set up opponent and user data
    async findGame() {
      const loadedFromLocalStorage = await this.loadFromLocalStorage();

      // Only fetch the opponent if no opponent data was loaded
      if (!loadedFromLocalStorage || !this.opponent) {
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
            this.opponentPokemon = this.opponent.team; // Set opponent's full team
            this.oppPoke = this.opponentPokemon[0];

            // Initialize moves for both user and opponent Pokémon
            this.userPokemon = this.userData.team.map((obj) => {
              if (!obj.stats.currentHp) {
                obj.stats.currentHp = obj.stats.hp;
              }
              this.initializeMoves(obj);
              return obj;
            });
            this.userPoke = this.userPokemon[0];
            this.initializeMoves(this.oppPoke);
          }
        }

        this.saveToLocalStorage();
      }
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    playMove(move, pokemon,opponent) {
      const chanceOfMove = Math.floor(Math.random() * 101) < move.acc;
      const capitalizedType = this.capitalizeFirstLetter(move.type);
      const specialOrNormalAttack = attackTypes[capitalizedType]?.attack_type;
      const dmgOfMove =
        (move.dmg / 100) *
        (specialOrNormalAttack === "Normal"
          ? pokemon.stats.str
          : pokemon.stats.spAtk);

      if (chanceOfMove) {
        console.log(dmgOfMove, specialOrNormalAttack);
        console.log(opponent)
      } else {
        console.log("Move missed!");
      }
    },

    handleMoveUsage(move,pokemon,opponent) {
      const moveIndex = this.userPoke.moves.findIndex((m) => m.name === move.name);
      const canBePlayed =
        moveIndex !== -1 && this.userPoke.moves[moveIndex].currentSp > 0;

      if (!canBePlayed) {
        return false;
      } else {
        this.saveToLocalStorage(); // Save the updated state
      }
      this.playMove(move, pokemon,opponent);
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
      this.showChngPoke = false;

      // Save the updated state to localStorage
      this.saveToLocalStorage();
    },
  },
  async mounted() {
    this.battleBg = this.getRandomBattleBg();
    await getUserData(this);
    await this.findGame();
    console.log(this.opponent)
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
