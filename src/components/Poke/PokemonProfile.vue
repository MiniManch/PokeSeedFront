<template>
  <div :class="['PokeCard', pokemon.type]" v-if="pokemon">
    <div :class="['Container']">
      
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

  <div class="selectPokemon" v-if="userData && userData.team">
    <div v-for="poke in userData.team" :key="poke.name">
      {{ poke }}
    </div>
  </div>  
</template>


<script>
import typeIcons from "../../assets/data/typeIcons.json";
import { fetchPokemonByName } from "@/utils/crud";
import { getUserData } from "@/utils/auth";

export default {
  data() {
    return {
      typeIcons: typeIcons,
      pokeTypeIcon: null,
      pokemon: null,
      userData: null,
      showButton: false,
      replaceButton: false,
      alreadyInTeam: false,
      error:null,
    };
  },
  methods: {
    getIcon(type) {
      const iconObject = this.typeIcons.find((icon) => icon.name === type);
      if (iconObject) {
        this.pokeTypeIcon = iconObject.image;
      }
    },
    forSelection() {
      // Check if the user is logged in
      if (this.userData) {
        this.showButton = true;
      }

      // Check if the Pokémon is already in the user's team
      if (this.userData.team.includes(this.pokemon.name)) {
        this.alreadyInTeam = true;
      } else if (this.userData.team.length === 4) {
        // If the team is full, show the replace button
        this.replaceButton = true;
      }
    },
  },
  async mounted() {
    const pokeName = window.location.href.split('/').pop();

    try {
      const pokemonData = await fetchPokemonByName(pokeName);
      this.pokemon = pokemonData;
      this.getIcon(this.pokemon.type); // Call getIcon after setting pokemon

      const userData = await getUserData(this); // Fetch user data
      if (userData) {
        this.forSelection(); // Handle selection logic
      }
    } catch (error) {
      this.error = 'Error fetching data: ' + error.message;
      console.error(this.error);
    }
  }
};
</script>

<style scoped>
* {
  font-family: HomeVideo;
}

.PokeCard {
  min-height: fit-content;
  width: 80vw;
  height: fit-content;
  display: flex;
  justify-content: center;
  margin: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border: 2px solid;
  border-radius: 15px;
}

.Container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

 .statsSection {
  width: 48%; /* Take up 48% of the width each with some space between them */
  display: flex;
  flex-direction: column;
}

.imageAndData {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.typeAndSuch {
  margin-top: 2vh;
  margin-left: 1vh;
  gap: 5vh;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  font-size: 2em;
}

.ImageAndName {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}

.ImageAndName > img {
  width: 60%;
}

.statsSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stats > div > p {
  font-size: 1.2em;
}

h3 {
  font-size: 2em;
}

.movesSection {
  margin-top: 20px;
}

.movesList {
  list-style: none;
  padding: 0;
}

.movesList > li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
}

.moveEffect {
  margin: 0;
  margin-bottom: 1vh;
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

