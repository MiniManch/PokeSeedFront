<template>
  <div class="pokeBattle" :style="{ backgroundImage: 'url(' + battleBg + ')' }">
    <!-- Opponent Panel -->
    <PlayerPanel
      :poke="oppPoke"
      :currentHp="oppPoke.stats.currentHp"
      :isPlayer="false"
      :turn="false"
      :isFainted="isOppFainted"
      v-if="oppPoke "
    />

    <!-- Player Panel -->
    <PlayerPanel
      :poke="userPoke"
      :currentHp="userPoke.stats.currentHp"
      :isPlayer="true"
      :turn="turn === 'user' && !processingLogs"
      :isFainted="isUserFainted"
      @displayChngPoke="showChngPoke = true"
      @moveUsed="handleMoveUsage"
      v-if="userPoke"
    />
    <div class="log">
      <BattleLog :logs="battleLogs" />
    </div>
  </div>
  <ChangePoke
    :selectedPoke="userPoke"
    :pokemon="userPokemon"
    v-if="userPoke && userData.team && showChngPoke"
    @changePokeTo="changePlayingPokemon"
    @closeChangePoke="closeChangePoke"
  />

</template>

<script>
import { getUserData } from "@/utils/auth";
import { getTrainerData } from "@/utils/crud";

import battleBgs from "@/assets/data/battleBgs.json";
import attackTypes from "@/assets/data/typeOfAttks.json";
import typeEffectiveness from "@/assets/data/effectiveType.json";
import BattleLog from "./BattleLog.vue";

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
      isUserFainted:false,
      isOppFainted:false,
      userPokemon: gameState ? gameState.userPokemon : null,
      opponentPokemon: gameState ? gameState.oppPokemon : null,
      turn: Math.random() < 0.5 ? "user" : "opponent",
      effectTrackers: [],
      battleLogs: [],
      logQueue: [], 
      processingLogs: false
    };
  },

  methods: {

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
        opponent: this.opponent,
        turn: this.turn,
        effectTrackers: this.effectTrackers,
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
        this.turn = gameState.turn || this.turn;
        this.effectTrackers = gameState.effectTrackers || [];

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
              // this.initializeMoves(obj);
              return obj;
            });
            this.userPoke = this.userPokemon[0];
            // this.initializeMoves(this.oppPoke);
          }
        }

        this.saveToLocalStorage();
      }
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    playMove(move, attackingPoke, defendingPoke,attackingPlayer) {
      this.processEffectTrackers()
      const defendingTeam = attackingPlayer === 'user' ? this.opponentPokemon : this.userPokemon;
      move.currentSp = move.currentSp - 1;
      const chanceOfMove = Math.floor(Math.random() * 101) < move.acc;

      const capitalizedType = this.capitalizeFirstLetter(move.type);
      const specialOrNormalAttack = attackTypes[capitalizedType]?.attack_type;
      const baseDamage =
        (move.dmg / 100) *
        (specialOrNormalAttack === "Normal"
          ? attackingPoke.stats.str
          : attackingPoke.stats.spAtk) - (defendingPoke.stats.def / 10);

      const dmgOfMove = Math.round(this.calculateDamage(baseDamage,move.type,defendingPoke.type) * 100) / 100;

      if (chanceOfMove) {
        const health_after = defendingPoke.stats.currentHp - dmgOfMove;
        defendingPoke.stats.currentHp = health_after > 0 ? health_after : 0;
        let pokeFromTeam = defendingTeam.filter((p) => p.name === defendingPoke.name)[0];
        pokeFromTeam.stats.currentHp = health_after > 0 ? health_after : 0;
        
        this.addLog(`${attackingPoke.name} used ${move.name} and dealt ${dmgOfMove} damage!`);
        this.applyMoveEffect(move,attackingPoke,defendingPoke);
        this.processEffectTrackers();

        return {
          moveHit: true,
          fainted: defendingPoke.stats.currentHp === 0
        };
      }
      return {
        moveHit: false,
        fainted: false
      };
    },

    handleMoveUsage(move, user) {
      const isPlayer = user === "user";
      const attackerPoke = isPlayer ? this.userPoke : this.oppPoke;
      const defenderPoke = isPlayer ? this.oppPoke : this.userPoke;

      const moveIndex = attackerPoke.moves.findIndex((m) => m.name === move.name);
      const canBePlayed = moveIndex !== -1 && attackerPoke.moves[moveIndex].currentSp > 0;

      if (!canBePlayed) {
        this.addLog(`${attackerPoke.name} cannot use ${move.name} due to insufficient SP.`);
        return false;
      }

      const { moveHit, fainted } = this.playMove(move, attackerPoke, defenderPoke,'user');

      if (!moveHit) {
        this.addLog(`${attackerPoke.name}'s move ${move.name} missed.`);
      }

      if (fainted) {
        this.addLog(`${defenderPoke.name} fainted!`);
        const faintHandled = this.handleFaint(defenderPoke, isPlayer ? "opponent" : "user");

        if (faintHandled) return;
      }

      this.switchTurn();
      this.saveToLocalStorage();
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
      this.switchTurn();
      this.switchTurn();
      this.addLog(`${this.userData.trainer} switched to ${this.userPoke.name}!`);


      this.saveToLocalStorage();
    },

    applyMoveEffect(move, attacker, defender) {
      const effectChance = Math.floor(Math.random() * 101) < move.effect_acc;
      if (!move.effect || move.effect_acc === 0 || !effectChance) return;

      const effectValue = Math.round(move.dmg * (move.effect_percent / 100)*10)/10; // Calculate effect value

      if (effectChance <= move.effect_acc) {
        switch (move.effect) {
          case 'attack down':
            defender.stats.attack -= effectValue;
            this.addEffectTracker('attack down', defender, effectValue, 1);
            this.addLog(`${attacker.name} reduced ${defender.name}'s attack by ${effectValue}`);
            break;

          case 'defense up':
            attacker.stats.defense += effectValue;
            this.addEffectTracker('defense up', attacker, effectValue, 1);
            this.addLog(`${attacker.name} increased their defense by ${effectValue}`);
            break;

          case 'defense down':
            defender.stats.defense -= effectValue;
            this.addEffectTracker('defense down', defender, effectValue, 1);
            this.addLog(`${attacker.name} reduced ${defender.name}'s defense by ${effectValue}`);
            break;

          case 'health up':
            attacker.stats.currentHp = Math.min(attacker.stats.hp, attacker.stats.currentHp + effectValue);
            this.addLog(`${attacker.name} restored ${effectValue} HP`);
            break;

          case 'skip':
            this.addEffectTracker('skip', defender, null, 1); // No need to revert skip
            this.addLog(`${attacker.name} skipped ${defender.name}'s next turn`);
            break;

          case 'melt':
            this.addEffectTracker('melt', defender, effectValue, move.melt_turns);
            this.addLog(`${attacker.name} inflicted melt on ${defender.name}, reducing their health for ${move.melt_turns} turns`);
            break;
        }
      }
    },

    addEffectTracker(effect, target, value, duration) {
      this.effectTrackers.push({ effect, target, value, duration });
    },

    processEffectTrackers() {
      this.effectTrackers = this.effectTrackers.filter((tracker) => {
        if (tracker.duration > 1) {
          tracker.duration -= 1;
          return true; // Keep this effect active
        } else {
          this.undoEffect(tracker); // Undo the effect after its duration expires
          return false; // Remove this effect from the tracker
        }
      });
    },

    undoEffect(tracker) {
      switch (tracker.effect) {
        case 'attack down':
          tracker.target.stats.attack += tracker.value;
          this.addLog(`${tracker.target.name}'s attack returned to normal`);
          break;

        case 'defense up':
          tracker.target.stats.defense -= tracker.value;
          this.addLog(`${tracker.target.name}'s defense returned to normal`);
          break;

        case 'defense down':
          tracker.target.stats.defense += tracker.value;
          this.addLog(`${tracker.target.name}'s defense returned to normal`);
          break;

        case 'melt':
          tracker.target.stats.currentHp -= tracker.value;
          this.addLog(`${tracker.target.name} took ${tracker.value} melt damage`);
          break;
      }
    },

    handleOpponentTurn() {
      if (this.turn !== "opponent") return;

      const randomMoveIndex = Math.floor(Math.random() * this.oppPoke.moves.length);
      const chosenMove = this.oppPoke.moves[randomMoveIndex];

      this.addLog(`Opponent's ${this.oppPoke.name} is using ${chosenMove.name}`);

      const { moveHit, fainted } = this.playMove(chosenMove, this.oppPoke, this.userPoke,'opponent');

      if (!moveHit) {
        this.addLog(`Opponent's move ${chosenMove.name} missed!`);
      }

      if (fainted) {
        this.addLog(`${this.userPoke.name} fainted!`);
        const faintHandled = this.handleFaint(this.userPoke, "user");

        if (faintHandled) return;
      }

      this.switchTurn();
      this.saveToLocalStorage();
    },

    switchTurn() {
      this.turn = this.turn === "user" ? "opponent" : "user";

      // If it's the opponent's turn, call the opponent's move automatically
      if (this.turn === "opponent") {
        setTimeout(() => this.handleOpponentTurn(), 1000); // Adding a slight delay for better flow
      }
    },

    handleFaint(poke, playerType) {
      if (poke.stats.currentHp <= 0) {
        if (playerType === "user") {
          const nextPoke = this.userPokemon.find((p) => p.stats.currentHp > 0);
          if (nextPoke) {
            this.showChngPoke = true;

            return true; 
          } else {
            alert("You lost the battle.");
            return false; 
          }
        } else if (playerType === "opponent") {
          const nextPoke = this.opponentPokemon.find((p) => p.stats.currentHp > 0 && p.name != poke.name);

          if (nextPoke) {
            this.oppPoke = nextPoke;
            this.addLog(`${this.opponent.name} switched to ${this.oppPoke.name}!`);

            // Automatically continue with the opponent's next turn if it's their turn
            if (this.turn === "opponent") {
              setTimeout(() => this.handleOpponentTurn(), 1000); // Add delay for better flow
            }

            this.saveToLocalStorage();
            return true; // Opponent switches Pokémon
          } else {
            alert("You won the battle!");
            return false; // All opponent Pokémon fainted
          }
        }
      }
      this.saveToLocalStorage();
      return true; // Pokémon still in the battle
    },
    
    addLog(message) {
      // Push the log message to the queue
      this.logQueue.push(message);

      // If not already processing logs, start
      if (!this.processingLogs) {
        this.processLogs();
      }
    },

    processLogs() {
      if (this.logQueue.length === 0) {
        this.processingLogs = false;
        return;  // No logs to process
      }

      this.processingLogs = true;

      // Display the first message in the queue
      const nextLog = this.logQueue.shift();
      this.battleLogs = [nextLog];

      // After 5 seconds, show the next log
      setTimeout(() => {
        this.processLogs();
      }, 2000);  // Adjust delay as needed
    },
    closeChangePoke(){
      this.showChngPoke = false;
    }

  },

  components: {
    PlayerPanel,
    ChangePoke,
    BattleLog
  },

  async mounted() {
    this.battleBg = this.getRandomBattleBg();
    if (!await getUserData(this)){
      this.$router.push('/login');
    }
    else{
    // If no saved game state is found, proceed with loading the game
      if (!this.oppPoke || !this.opponent) {
        await this.findGame();
      } 

      if (this.turn === "opponent") {
        setTimeout(() => this.handleOpponentTurn(), 1000); // Adding a slight delay for better flow
      }
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
.log{
  position: absolute;
  bottom:10vh;
  left:10vh;
}
</style>
