<template>
  <NavBar />
  <router-view></router-view> <!-- This should display your home page component -->
</template>

<script>
import NavBar from './components/General/NavBar.vue'
import 'animate.css';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data() {
    return {
      selectedPokemon: null,
      allTypes: [],
      error: null
    };
  },
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
