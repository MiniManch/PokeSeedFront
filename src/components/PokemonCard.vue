<template>
  <div class="PokeCard">
    <div v-if="pokemon" class="Container" :style="{ background: `linear-gradient(90deg, ${pokemon.typeData.color} 0%, black 35%, white 100%)`}">
      <div class="typeAndSuch">
        <img :src="pokemon.typeData.image" :alt="pokemon.type">
        <p>some text</p>
      </div>
      <div class="ImageAndName">
        <h2>{{ pokemon.name }}</h2>
        <img :src="pokemon.frontSprite" alt="Front Sprite">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
      pokemon: {
          type: Object,
          required: true
      },
  },
}
</script>

<style scoped>
* {
  font-family: HomeVideo;
}
.PokeCard {
  height: 20vw;
  width: 20vw;
}

.Container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  border: 2px solid ;
  border-radius: 15px;
}

.typeAndSuch, .ImageAndName {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.typeAndSuch {
  width: 15%;
  align-items: center;
  margin-top: 2vh;
  margin-left: 1vh;
}

.typeAndSuch > img {
  width: 80%;
}

.typeAndSuch > p {
  text-orientation: upright;
  writing-mode: vertical-rl;
  margin: 0;
  letter-spacing: normal;
  font-size: 1.1em;
  margin-right: 1vh;
}

.ImageAndName {
  width: 85%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.ImageAndName > img {
  width: 100%;
}

</style>
