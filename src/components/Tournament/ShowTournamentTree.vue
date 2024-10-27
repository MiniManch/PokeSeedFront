<template>
  <button @click="createTournament">Create New Tournament</button>
  <div class="bracket" v-if="tournament && userData">
    <div class="round" v-for="(round, index) in rounds" :key="index">
      <div class="match" v-for="match in round" :key="match.matchNumber">
        <div class="team">
          <div v-if="getTrainerDataForDisplay(match.players[0])">
            {{ match.players[0] }} 
            <br>
            {{ isPlayer(match.players[0]) ? '(P)' : `(Rating: ${getTrainerDataForDisplay(match.players[0]).rating})` }}
          </div>
        </div>
        <div class="team">
          <div v-if="getTrainerDataForDisplay(match.players[1])">
            {{ match.players[1] }} 
            <br>
            {{ isPlayer(match.players[1]) ? '(P)' : `(Rating: ${getTrainerDataForDisplay(match.players[1]).rating})` }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingModal :isLoading="showLoadingModal"/>
</template>

<script>
import axios from 'axios';
import { getUserData } from '@/utils/auth';
import { fetchTrainerDataAndAddToList } from '@/utils/crud'; 
import LoadingModal from '../General/LoadingModal.vue';

export default {
  data() {
    return {
      tournament: JSON.parse(localStorage.getItem('PokeSeed_tournamentTree')) || null,
      userData: null,
      trainerData: [], 
      error: null,
      showLoadingModal:true,
    };
  },
  computed: {
    rounds() {
      if (!this.tournament) return [];

      const roundMapping = {
        'Eighth Final': 0,
        'Quarter Final': 1,
        'Semi Final': 2,
        'Final': 3,
      };

      const rounds = [[], [], [], []];

      this.tournament.matches.forEach((match) => {
        rounds[roundMapping[match.roundType]].push(match);
      });

      return rounds;
    },
  },
  methods: {
    async fetchTrainerDataForTournament() {
      for (const match of this.tournament.matches) {
        for (const player of match.players) {
          const existingTrainer = this.trainerData.find((trainer) => trainer.name === player);
          if (!existingTrainer) {
            await fetchTrainerDataAndAddToList(this, player);
          }
        }
      }
    },
    getTrainerDataForDisplay(trainerName) {
      return this.trainerData.find((trainer) => trainer.name === trainerName);
    },
    async createTournament() {
      try {
        const response = await axios.post('/api/tournaments/new', {
          username: this.userData.username,
        });
        this.tournament = response.data;
        localStorage.setItem('PokeSeed_tournamentTree', JSON.stringify(this.tournament));
        localStorage.removeItem("PokeSeed_battleState");

        // Fetch trainer data after creating the tournament
        await this.fetchTrainerDataForTournament();
      } catch (error) {
        console.error('Error creating tournament:', error);
      }
    },
    isPlayer(trainer) {
      return trainer === this.userData.trainer;
    },
  },
  async mounted() {
    setTimeout(()=> {this.showLoadingModal=false}, 5000);
    try {
      await getUserData(this);

      if (!this.tournament) {
        await this.createTournament();
      } else {
        // Fetch trainer data for an existing tournament
        await this.fetchTrainerDataForTournament();
      }
    } catch (error) {
      this.error = 'Error fetching data: ' + error.message;
      console.error(this.error);
    }
  },
  components:{
    LoadingModal,
  }
};
</script>
<style scoped>
body {
  color: #fff;
  margin: 2em;
  background-color: #636e72;
}

.bracket {
  position: absolute;
  top:20%;
  display: flex;
  flex-direction: column-reverse; /* Stack rounds from bottom to top */
  align-items: center;
}

.round {
  display: flex;
  flex-direction: row; /* Horizontal alignment of matches in each round */
  justify-content: space-around;
  width: 100%;
  margin: 30px 0; /* Space between rounds */
}

.match {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
  border-radius: 5px;
  background-color: #2d3436;
  padding: 10px;
  min-width: fit-content;
}

.team {
  color: #fff;
  padding: 10px 8px;
  background-color: #74b9ff;
  min-width: 10vw;
  text-align: center;
}

.team:nth-child(odd) {
  border-bottom: 1px solid #8fc7ff;
}
</style>