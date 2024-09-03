<template>
    <div class="bracket" v-if="tournament">
      <div class="round" v-for="(round, index) in rounds" :key="index">
        <div class="match" v-for="match in round" :key="match.matchNumber">
          <div class="team">{{ getTeamName(match.players[0]) }}</div>
          <div class="team">{{ getTeamName(match.players[1]) }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No tournament data available.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {getUserData} from '@/utils/auth';

  export default {
    data() {
      return {
        tournament: null,
        userData:null,
        error:null,
        username: 'YOUR_USERNAME', // Replace with actual username
        trainerName: 'YOUR_TRAINER_NAME' // Replace with actual trainer name
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
  
        this.tournament.matches.forEach(match => {
          rounds[roundMapping[match.roundType]].push(match);
        });
  
        return rounds;
      }
    },
    methods: {
      async createTournament() {
        try {
          const response = await axios.post('/api/tournaments/new', {
            username: this.userData.username,
          });
          this.tournament = response.data;
        } catch (error) {
          console.error('Error creating tournament:', error);
        }
      },
      getTeamName(playerId) {
        if (!playerId) return 'TBD';
        // Logic to get team name from playerId
        // This can be fetched from a store or computed from data
        return 'Team Name'; // Replace with actual logic
      }
    },
    async mounted() {
        try {
            const userData = await getUserData(this);
            if (userData) {
                this.createTournament(),
                console.log (this.userData)
            }
        } catch (error) {
            this.error = "Error fetching data: " + error.message;
            console.error(this.error);
        }
    }
  };
  </script>
  
  <style scoped>
  body {
    color: #fff;
    margin: 2em;
    background-color: #636e72;
    font-family: helvetica, arial, sans-serif;
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
  }
  
  .team {
    color: #fff;
    padding: 10px 8px;
    background-color: #74b9ff;
  }
  
  .team:nth-child(odd) {
    border-bottom: 1px solid #8fc7ff;
  }
  </style>
  