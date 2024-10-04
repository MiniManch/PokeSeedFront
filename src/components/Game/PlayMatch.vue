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
import typeEffectiveness from "@/assets/data/effectiveType.json";

import PlayerPanel from "./PlayerPanel.vue";
import ChangePoke from "./ChangePoke.vue";

export default {
  data() {
    const savedState = localStorage.getItem("PokeSeed_battleState");
    let gameState = savedState ? JSON.parse(savedState) : null;

    return {
      userData: JSON.parse(localStorage.getItem("PokeSeed_userData")),
      tournamentTree: JSON.parse(localStorage.getItem("PokeSeed_tournamentTree")),
      opponent: gameState ? gameState.opponent : null,
      match: null,
      oppPoke: gameState ? gameState.oppPoke : null,
      userPoke: gameState ? gameState.userPoke : null,
      battleBg: null,
      oppPokeHealth: gameState ? gameState.oppPokeHealth : null,
      userPokeHealth: gameState ? gameState.userPokeHealth : null,
      showChngPoke: false,
      userPokemon: gameState ? gameState.userPokemon : null,
      opponentPokemon: gameState ? gameState.oppPokemon : null,
      turn: Math.random() < 0.5 ? "user" : "opponent", // Randomize the first turn
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

    async loadFromLocalStorage() {
      const savedState = localStorage.getItem("PokeSeed_battleState");
      if (savedState) {
        const gameState = JSON.parse(savedState);

        this.userPokemon = gameState.userPokemon;
        this.userPoke = gameState.userPoke;
        this.userPoke.stats.currentHp = gameState.userPokeHealth;

        this.opponent = gameState.opponent; // Load the saved opponent object
        this.opponentPokemon = gameState.oppPokemon;
        this.oppPoke = gameState.oppPoke;
        this.oppPoke.stats.currentHp = gameState.oppPokeHealth;

        this.userPokemon.forEach((poke) => this.initializeMoves(poke));
        this.initializeMoves(this.oppPoke);

        return true;
      }
      return false;
    },

    async findGame() {
      const loadedFromLocalStorage = await this.loadFromLocalStorage();
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
            this.opponentPokemon = this.opponent.team;
            this.oppPoke = this.opponentPokemon[0];

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

        if (isPlayerAttacking) {
          const oppPokeIndex = this.opponentPokemon.findIndex(
            (poke) => poke.name === defendingPoke.name
          );
          if (oppPokeIndex !== -1) {
            this.opponentPokemon[oppPokeIndex].stats.currentHp =
              defendingPoke.stats.currentHp;
          }

          if (!this.handleFaint(defendingPoke, "opponent")) {
            console.log("Battle ended - all opponent Pokémon fainted.");
            return false;
          } else if (defendingPoke.stats.currentHp === 0) {
            return true; // Player keeps the turn
          }
        } else {
          const userPokeIndex = this.userPokemon.findIndex(
            (poke) => poke.name === defendingPoke.name
          );
          if (userPokeIndex !== -1) {
            this.userPokemon[userPokeIndex].stats.currentHp =
              defendingPoke.stats.currentHp;
          }

          if (!this.handleFaint(defendingPoke, "user")) {
            console.log("Battle ended - all user Pokémon fainted.");
            return false;
          } else if (defendingPoke.stats.currentHp === 0) {
            return true; // Opponent keeps the turn
          }
        }
      } else {
        console.log("Move missed!");
      }

      this.saveToLocalStorage();
      return true; // Switch turns if no faint
    },

    handleMoveUsage(move, user) {
      const isPlayer = user === "user";
      const attackerPoke = isPlayer ? this.userPoke : this.oppPoke;
      const defenderPoke = isPlayer ? this.oppPoke : this.userPoke;

      const moveIndex = attackerPoke.moves.findIndex((m) => m.name === move.name);
      const canBePlayed = moveIndex !== -1 && attackerPoke.moves[moveIndex].currentSp > 0;

      if (!canBePlayed) {
        return false;
      } else {
        const baseDamage = move.dmg;
        const finalDamage = this.calculateDamage(
          baseDamage,
          move.type,
          defenderPoke.type
        );

        const battleContinues = this.playMove(move, attackerPoke, defenderPoke, isPlayer);
        if (!battleContinues) return;

        defenderPoke.stats.currentHp -= finalDamage;
        console.log(
          `${attackerPoke.name} used ${move.name}. It dealt ${finalDamage} damage!`
        );

        if (defenderPoke.stats.currentHp <= 0) {
          console.log(`${defenderPoke.name} fainted!`);
          if (isPlayer) {
            this.handleFaint(defenderPoke, "opponent");
          } else {
            this.handleFaint(defenderPoke, "user");
          }
        } else {
          console.log(
            `${defenderPoke.name} survived with ${defenderPoke.stats.currentHp} HP.`
          );
          this.switchTurn();
        }

        this.saveToLocalStorage();
      }
    },

    calculateDamage(baseDamage, moveType, oppPokeType) {
      let damageMultiplier = 1;

      if (typeEffectiveness[moveType]?.super_effective.includes(oppPokeType)) {
        damageMultiplier += 0.25;
        console.log("It's super effective!");
      } else if (typeEffectiveness[moveType]?.not_effective.includes(oppPokeType)) {
        damageMultiplier -= 0.75;
        console.log("It's not very effective...");
      }

      return baseDamage * damageMultiplier;
    },

    changePlayingPokemon(poke) {
      const currentPokeIndex = this.userPokemon.findIndex(
        (p) => p.name === this.userPoke.name
      );

      if (currentPokeIndex !== -1) {
        this.userPokemon[currentPokeIndex] = this.userPoke;
      }

      this.userPoke = poke;
      this.showChngPoke = false;

      this.saveToLocalStorage();
    },

    handleOpponentTurn() {
      if (this.turn !== "opponent") return;
      console.log('oponent turn')
      const randomMoveIndex = Math.floor(Math.random() * this.oppPoke.moves.length);
      const chosenMove = this.oppPoke.moves[randomMoveIndex];

      const moveResult = this.playMove(chosenMove, this.oppPoke, this.userPoke, false);
      if (!moveResult) {
        console.log("Opponent lost the battle.");
      } else if (!chosenMove.currentSp || chosenMove.currentSp <= 0) {
        console.log(chosenMove)
        console.log("Opponent can't make a move.");
      }
    },

    switchTurn() {
      console.log(this.turn);
      this.turn = this.turn === "user" ? "opponent" : "user";
      if (this.turn === "opponent") this.handleOpponentTurn();
    },
    // Unified faint handler for both player and opponent Pokémon
    handleFaint(poke, playerType) {
      if (poke.stats.currentHp <= 0) {
        if (playerType === "user") {
          const nextPoke = this.userPokemon.find((p) => p.stats.currentHp > 0);
          if (nextPoke) {
            this.showChngPoke = true;
            return true; // Player can switch Pokémon
          } else {
            alert("You lost the battle.");
            return false; // All player Pokémon fainted
          }
        } else if (playerType === "opponent") {
          const nextPoke = this.opponentPokemon.find((p) => p.stats.currentHp > 0);
          if (nextPoke) {
            this.oppPoke = nextPoke;
            this.saveToLocalStorage();
            return true; // Opponent switches Pokémon
          } else {
            alert("You won the battle!");
            return false; // All opponent Pokémon fainted
          }
        }
      }
      return true; // Pokémon still in the battle
    },
  },

  components: {
    PlayerPanel,
    ChangePoke,
  },

  async mounted() {
    this.battleBg = this.getRandomBattleBg();
    await getUserData(this);

    // If no saved game state is found, proceed with loading the game
    if (!this.oppPoke || !this.opponent) {
      await this.findGame();
    } 
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
