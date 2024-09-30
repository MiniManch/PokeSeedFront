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
import { getUserData } from "@/utils/auth";
import { getTrainerData } from "@/utils/crud";

import battleBgs from "@/assets/data/battleBgs.json";
import attackTypes from "@/assets/data/typeOfAttks.json";

import PlayerPanel from "./PlayerPanel.vue";
import ChangePoke from "./ChangePoke.vue";

export default {
  data() {
    const savedState = localStorage.getItem("PokeSeed_battleState");
    let gameState = savedState ? JSON.parse(savedState) : null;

    return {
      userData: JSON.parse(localStorage.getItem("PokeSeed_userData")),
      tournamentTree: JSON.parse(localStorage.getItem("PokeSeed_tournamentTree")),
      opponent: gameState ? gameState.opponent : null, // Use opponent from saved gameState if it exists
      match: null,
      oppPoke: gameState ? gameState.oppPoke : null, 
      userPoke: gameState ? gameState.userPoke : null,
      battleBg: null,
      oppPokeHealth: gameState ? gameState.oppPokeHealth : null,
      userPokeHealth: gameState ? gameState.userPokeHealth : null,
      showChngPoke: false,
      userPokemon: gameState ? gameState.userPokemon : null,
      opponentPokemon: gameState ? gameState.oppPokemon : null,
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
        oppPokemon: this.opponentPokemon,
        opponent: this.opponent, // Save the opponent object
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

        // Load the opponent's Pokémon, health, and team
        this.opponent = gameState.opponent; // Load the saved opponent object
        this.opponentPokemon = gameState.oppPokemon;
        this.oppPoke = gameState.oppPoke;
        this.oppPoke.stats.currentHp = gameState.oppPokeHealth;

        // Initialize moves for both user and opponent Pokémon
        this.userPokemon.forEach((poke) => this.initializeMoves(poke));
        this.initializeMoves(this.oppPoke);

        return true; // Return true if loading from localStorage was successful
      }
      return false; // No saved state, return false
    },

    // Find the game and set up opponent and user data
    async findGame() {
      const loadedFromLocalStorage = await this.loadFromLocalStorage();
      console.log(loadedFromLocalStorage)
      // Only fetch the opponent if no opponent data was loaded
      if (!loadedFromLocalStorage || !this.opponent) {
        console.log('failed to load from local storage')
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

    playMove(move, attackingPoke, defendingPoke, isPlayerAttacking) {
      const chanceOfMove = Math.floor(Math.random() * 101) < move.acc;
      const capitalizedType = this.capitalizeFirstLetter(move.type);
      const specialOrNormalAttack = attackTypes[capitalizedType]?.attack_type;
      const dmgOfMove =
        (move.dmg / 100) *
        (specialOrNormalAttack === "Normal"
          ? attackingPoke.stats.str
          : attackingPoke.stats.spAtk);

      if (chanceOfMove) {
        const health_after = defendingPoke.stats.currentHp - dmgOfMove;
        defendingPoke.stats.currentHp = health_after > 0 ? health_after : 0;

        // Update the current Pokémon's health in the entire team (user or opponent)
        if (isPlayerAttacking) {
          const oppPokeIndex = this.opponentPokemon.findIndex(
            (poke) => poke.name === defendingPoke.name
          );
          if (oppPokeIndex !== -1) {
            this.opponentPokemon[oppPokeIndex].stats.currentHp = defendingPoke.stats.currentHp;
          }
        } else {
          const userPokeIndex = this.userPokemon.findIndex(
            (poke) => poke.name === defendingPoke.name
          );
          if (userPokeIndex !== -1) {
            this.userPokemon[userPokeIndex].stats.currentHp = defendingPoke.stats.currentHp;
          }
        }
      } else {
        console.log("Move missed!");
      }

      this.saveToLocalStorage(); // Save the updated state
    },

    handleMoveUsage(move, user) {
    const isPlayer = user === 'user';
    const moveIndex = this.userPoke.moves.findIndex((m) => m.name === move.name);
    const canBePlayed =
      moveIndex !== -1 && this.userPoke.moves[moveIndex].currentSp > 0;

    if (!canBePlayed) {
      return false;
    } else {
      if (isPlayer) {
        this.playMove(move, this.userPoke, this.oppPoke, true);  // Player attacking
      } else {
        this.playMove(move, this.oppPoke, this.userPoke, false); // Opponent attacking
      }
    }

    this.saveToLocalStorage(); // Save the updated state
  },
    // checkPokeAndChange(poke,player){
      
    // },
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

    // If no saved game state is found, proceed with loading the game
    if (!this.oppPoke || !this.opponent) {
      await this.findGame();
    } else {
      console.log("Loaded opponent from localStorage:", this.opponent);
    }
    console.log(JSON.parse(localStorage.getItem("PokeSeed_battleState")));
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
