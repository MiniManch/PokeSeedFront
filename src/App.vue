<template>
  <!-- <PokeTypes /> -->
  <PokemonCard v-if="selectedPokemon" :pokemon="selectedPokemon" />
</template>

<script>
// import PokeTypes from './components/PokeTypes.vue';
import PokemonCard from './components/PokemonCard.vue';

export default {
  name: 'App',
  components: {
    // PokeTypes,
    PokemonCard
  },
  data() {
    return {
      selectedPokemon: null,
      allTypes: [],
      allTrainers: [],
      error: null
    };
  },
  methods: {
    // Fetch all Pokémon types
    async fetchAllTypes() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/types`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon types');
        }
        this.allTypes = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching Pokémon types:', error);
      }
    },

    // Fetch all trainers
    async fetchAllTrainers() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/trainers`);
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        this.allTrainers = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching trainers:', error);
      }
    },

    // Fetch a specific Pokémon by name
    async fetchPokemonByName(name) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/pokemon/${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon');
        }
        this.selectedPokemon = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching Pokémon:', error);
      }
    }
  },
  mounted() {
    // Fetch initial data
    this.fetchAllTypes();
    this.fetchAllTrainers();
  }
}
</script>

<style>
@font-face {
  font-family: 'HomeVideo';
  src: url('@/assets/fonts/homeVideo/HomeVideo.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'HomeVideo';
  src: url('@/assets/fonts/homeVideo/HomeVideoBold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: 'Mangabey';
  src: url('@/assets/fonts/Mangabey.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

html, body{
  min-height:100vh;
  min-width:100vw;
  overflow-x: hidden;
}
</style>
