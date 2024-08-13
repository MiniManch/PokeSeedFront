<template>
  <PokeTypes />
  <PokemonCard />
</template>

<script>
import PokeTypes from './components/PokeTypes.vue';
import PokemonCard from './components/PokemonCard.vue';


export default {
  name: 'App',
  components: {
    PokeTypes,
    PokemonCard
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
