<template>
  <div class="PokeCard">
    <div v-if="pokemon" :class="['Container', pokemon.type]">
      
      <div class="imageAndData">
        <div class="typeAndSuch">
          <img :src="pokeTypeIcon" :alt="pokemon.type">
          <p>{{ pokemon.type }}</p>
        </div>
        <div class="ImageAndName">
          <h2>{{ pokemon.name }}</h2>
          <img :src="pokemon.frontSprite" alt="Front Sprite">
        </div>
      </div>
        
      <div class="statsSection">
        <div class="stats">
          <div class="statsTitle">
            <h3>Stats</h3>
          </div>
          <div >
            <p>STR: {{ pokemon.stats.str }}</p>
            <p>HP: {{ pokemon.stats.hp }}</p>
            <p>DEF: {{ pokemon.stats.def }}</p>
          </div>
        </div>

        <div class="movesSection">
          <h3>Moves</h3>
          <ul class="movesList">
            <li v-for="move in pokemon.moves" :key="move._id">
              <strong>{{ move.name }}</strong> ({{ move.type }}): 
              DMG: {{ move.dmg }}, ACC: {{ move.acc }}, SP: {{ move.sp }}
              <p v-if="move.effect" class="moveEffect">
                <br>
                <em>Effect:</em> {{ move.effect }} ({{ move.effect_acc }}% acc) ({{ move.effect_percent }} eff%)
              </p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import typeIcons from "../../assets/data/typeIcons.json";
export default {
  props: {
      choose:{
          type: Boolean,
          required: false,
      }
  },
  data(){
    return {
      typeIcons:typeIcons,
      pokeTypeIcon:null,
      pokemon:null,
    }
  },
  methods: {
    getIcon(item) {
      for (const iconObject of this.typeIcons) {
        if (iconObject.name === item.type) {
          this.pokeTypeIcon = iconObject.image;
        }
      }
    },
    choosePokemon(poke) {
      this.$emit('choosePokemon', poke);
    },
    async fetchPokemonByName(name) {
      try {
        const response = await fetch(`/api/pokemon/${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon');
        }
        this.pokemon = await response.json();
        this.getIcon(this.pokemon); // Call getIcon after fetching the Pokémon data
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching Pokémon:', error);
      }
    }
  },
  mounted() {
    const path = window.location.href.split('/');
    const pokeName = path[path.length - 1];
    this.fetchPokemonByName(pokeName);
  }
}
</script>

<style scoped>
* {
  font-family: HomeVideo;
}

.PokeCard {
  min-height: fit-content;
  width: 100vw;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.Container {
  width: 40vw;
  display: flex;
  flex-direction: column;
  border: 2px solid;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.imageAndData {
  width:100%;
  display: flex;
  margin-bottom: 20px;
}

.typeAndSuch {
  width: 15%;
  margin-top: 2vh;
  margin-left: 1vh;
  gap: 10vh;
}

.typeAndSuch > img {
  width: 80%;
}

.typeAndSuch > p {
  display: flex;
  text-orientation: upright;
  writing-mode: vertical-rl;
  margin: 0;
  letter-spacing: normal;
  font-size: 1.1em;
  margin-right: 1vh;
  font-size:2em;
}

.ImageAndName {
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size:4em;
}

.ImageAndName > img {
  width: 40%;
}

.statsSection, .movesSection {
  margin-top: 20px;
}
.statsSection{
  display: flex;
  justify-content: space-between;
  width:100%;
}

.statsList, .movesList {
  list-style: none;
  padding: 0;
}

.statsList > li, .movesList > li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
}

.stats{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stats > div >p {
  font-size: 1.2em;
}
.moveEffect{
  margin: 0;
  margin-bottom: 1vh;
}

h3{
  font-size: 2em;
}



.fairy {
  background: linear-gradient(135deg, #EE99AC, #FFCCD4);
}

.rock {
  background: linear-gradient(135deg, #B8A038, #D1C07E);
}

.steel {
  background: linear-gradient(135deg, #B8B8D0, #D0D0E0);
}

.water {
  background: linear-gradient(135deg, #6890F0, #98A9F0);
}

.ghost {
  background: linear-gradient(135deg, #705898, #9B81B8);
}

.psychic {
  background: linear-gradient(135deg, #F85888, #FF9CA6);
}

.poison {
  background: linear-gradient(135deg, #A040A0, #B070B0);
}

.flying {
  background: linear-gradient(135deg, #A890F0, #C6B7F0);
}

.fire {
  background: linear-gradient(135deg, #F08030, #FFA068);
}

.normal {
  background: linear-gradient(135deg, #A8A878, #C6C69E);
}

.grass {
  background: linear-gradient(135deg, #78C850, #A0D870);
}

.ice {
  background: linear-gradient(135deg, #98D8D8, #C2EBEB);
}

.fighting {
  background: linear-gradient(135deg, #C03028, #D87070);
}

.electric {
  background: linear-gradient(135deg, #F8D030, #FFE670);
}

.dark {
  background: linear-gradient(135deg, #705848, #9B7E68);
}

.ground {
  background: linear-gradient(135deg, #E0C068, #F2DE98);
}

.bug {
  background: linear-gradient(135deg, #A8B820, #C6D030);
}
</style>
