<template>
    <div class="pokeBattle" :style="{ backgroundImage: 'url(' + battleBg + ')' }">
        <!-- opp panel -->
        <PokeStats
          :poke="oppPoke"
          :currentHp="oppPokeHealth"
          :turn="false"
          :isPlayer="false"
          v-if="oppPoke && oppPokeHealth"
        />

        <!-- player panel -->
        <PokeStats
        :poke="userPoke"
        :currentHp="userPokeHealth"
        :turn="true"
        :isPlayer="true"
        v-if="userPoke && userPokeHealth"
      />

    </div>
  </template>
  
  <script>
  import { getUserData } from '@/utils/auth';
  import { getTrainerData } from '@/utils/crud';
  import battleBgs from "@/assets/data/battleBgs.json";
  import PokeStats from './PokeStats.vue';
  
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
        userPokeHealth:null,
      };
    },
    methods: {
      getRandomBattleBg() {
        const randomBg = battleBgs[Math.floor(Math.random() * battleBgs.length)];
        return randomBg.link;
      },
      async findGame() {
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
            this.userPoke = this.userData.team[0];

            this.oppPokeHealth = this.opponent.team[0].stats.hp;
            this.userPokeHealth = this.userData.team[0].stats.hp;
          }
        }
      },
    },
    async mounted() {
      this.battleBg = this.getRandomBattleBg(); // Set battleBg during mounting
      await getUserData(this);
      await this.findGame();
    },
    components:{
        PokeStats,
    }
  };
  </script>
  
  <style>
  .pokeBattle {
    position: relative;
    width:80vw;
    height:100vh;
    margin: 0 auto;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* Add any additional styles you need */
  }

  </style>
  