<template>
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
  <div v-else>
    <p>No tournament data available.</p>
  </div>
</template>

<script>
import axios from 'axios';
import { getUserData } from '@/utils/auth';
import { fetchTrainerDataAndAddToList } from '@/utils/crud'; 

export default {
  data() {
    return {
      // tournament: JSON.parse(localStorage.getItem('PokeSeed_tournamentTree')) || null,
      tournament:  null,
      userData: null,
      trainerData: [], // Store trainer data as an array
      error: null,
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
        // Fetch data for both players in each match
        for (const player of match.players) {
          const existingTrainer = this.trainerData.find((trainer) => trainer.name === player);
          if (!existingTrainer) {
            // Fetch only if not already fetched
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
};
</script>

<style scoped>
body {
  color: #fff;
  margin: 2em;
  background-color: #636e72;
  font-family: helvetica, arial, sans-serif;
}

br{
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.bracket {
  display: flex;
}

.round {
  flex: 1;
  display: flex;
  margin-right: 30px;
  flex-direction: column;
  justify-content: space-around;
}

.match {
  margin: 15px 0;
  overflow: hidden;
  border-radius: 5px; 
  min-width: fit-content;
}

.team {
  color: #fff;
  padding: 10px 8px;
  background-color: #74b9ff;
  min-width: 10vw;
}

.team:nth-child(odd) {
  border-bottom: 1px solid #8fc7ff;
}
</style>
