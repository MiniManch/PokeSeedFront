<template>
  <!-- <HomeComp /> -->
   <ViewTrainers :data="onlyNpcTrainers"/>
</template>

<script>
// import HomeComp from './components/HomeComp.vue'
import ViewTrainers from './components/Trainers/ViewTrainers.vue';

export default {
  name: 'App',
  components: {
    // HomeComp,
    ViewTrainers
  },
  data() {
    return {
      selectedPokemon: null,
      allTypes: [],
      allTrainers: [],
      error: null
    };
  },
  computed:{
    onlyNpcTrainers(){
      return this.allTrainers.filter(trainer => trainer.backSprite == '');
    }
  },
  methods: {
    async fetchAllTypes() {
      try {
        const response = await fetch(`/api/types`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon types');
        }
        this.allTypes = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching Pokémon types:', error);
      }
    },

    async fetchAllTrainers() {
      try {
        const response = await fetch(`/api/trainers`);
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        this.allTrainers = await response.json();
        // console.log(this.allTrainers)
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching trainers:', error);
      }
    },

    async fetchPokemonByName(name) {
      try {
        const response = await fetch(`/api/pokemon/${name}`);
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
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  background-color:#FAF9F6;
}
</style>
