<template>
  <div class="containerOfPokeCard">
    <!-- Modal Component -->
    <Modal
      v-if="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :type="modalType"
      @close="closeModal"
    />
    <YesOrNoModal 
      v-if="showYNModal"
      :title= "modalTitle"
      :message="modalMessage"
      @close="toggleYesNoModal"
      @yes="acceptReplace"
    />

    <div :class="['PokeCard', pokemon.type]" v-if="pokemon">
      <div :class="['Container']">
        <!-- existing PokeCard content -->
        <div class="imageAndData">
          <div class="typeAndSuch">
            <img :src="pokeTypeIcon" :alt="pokemon.type" />
            <p>{{ pokemon.type }}</p>
          </div>
          <div class="ImageAndName">
            <h2>{{ pokemon.name }}</h2>
            <img :src="pokemon.frontSprite" alt="Front Sprite" />
          </div>
        </div>

        <div class="statsSection">
          <div class="stats">
            <div class="statsTitle">
              <h3>Stats</h3>
            </div>
            <div>
              <p>STR: {{ pokemon.stats.str }}</p>
              <p>HP: {{ pokemon.stats.hp }}</p>
              <p>DEF: {{ pokemon.stats.def }}</p>
              <p>SPEED: {{ pokemon.stats.speed }}</p>
              <p>Sp.ATK: {{ pokemon.stats.spAtk }}</p>
              <p>Sp.DEF: {{ pokemon.stats.spDef }}</p>
            </div>
          </div>

          <div class="movesSection">
            <h3>Moves</h3>
            <ul class="movesList">
              <li v-for="move in pokemon.moves" :key="move._id">
                <strong>{{ move.name }}</strong> ({{ move.type }}):
                DMG: {{ move.dmg }}, ACC: {{ move.acc }}, SP: {{ move.sp }}
                <p v-if="move.effect" class="moveEffect">
                  <br />
                  <em>Effect:</em> {{ move.effect }} ({{ move.effect_acc }}%
                  acc) ({{ move.effect_percent }} eff%)
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ul class="framed buttons selectPokemon" v-if="userData && showButton ">
        <li v-if="replaceButton && !showPokeToReplace">
          <button class="button" type="submit" @click="showTeamToReplace">Replace a Pokémon in your team with {{ pokemon.name }}!</button>
        </li>
        <li v-if="alreadyInTeam">{{ pokemon.name }} is already in your team</li>
        <li v-if="!alreadyInTeam && !teamFull ">
          <button class="button" type="submit" @click="addToTeam">Add {{ pokemon.name }} to your team!</button>
        </li>
        
      </ul>

      <div v-if="showPokeToReplace">
          <PokemonToReplace :pokemon="userData.team" @select="replacePokemon"/>
      </div>
      
    </div>
  </div>
</template>

<script>
import typeIcons from "../../assets/data/typeIcons.json";
import { fetchPokemonByName, addPokemonToTeam, replacePokemonInTeam } from "@/utils/crud";
import { getUserData } from "@/utils/auth";
import Modal from "@/components/General/PopUpModal.vue";
import PokemonToReplace from "./PokemonToReplace.vue";
import YesOrNoModal from "../General/YesOrNoModal.vue";

export default {
  components: {
    Modal,
    PokemonToReplace,
    YesOrNoModal
  },
  data() {
    return {
      typeIcons: typeIcons,
      pokeTypeIcon: null,
      pokemon: null,
      userData: null,
      showButton: false,
      replaceButton: false,
      alreadyInTeam: false,
      teamFull:false,
      oldPoke:null,
      error: null,
      token: localStorage.getItem("PokeSeed_token"),
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      modalType: "",
      showYNModal:false,
      showPokeToReplace:false,
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
      if (this.userData) {
        this.showButton = true;
      }

      if (this.userData.team.includes(this.pokemon.name)) {
        this.alreadyInTeam = true;
        this.replaceButton = false;
      } else if (this.userData.team.length >= 4) {
        this.replaceButton = true;
      } else {
        this.replaceButton = false;
        this.alreadyInTeam = false;
      }
      this.teamFull = this.userData.team.length == 4;
    },
    async addToTeam() {
      try {
        await addPokemonToTeam(this.userData, this.pokemon.name, this.token);
        this.modalTitle = "Success!";
        this.modalMessage = `${this.pokemon.name} has been added to your team.`;
        this.modalType = "primary";
        this.showModal = true;

        await this.refreshUserData();
      } catch (error) {
        this.modalTitle = "Error";
        this.modalMessage = error.message || "Failed to add Pokémon to your team.";
        this.modalType = "error";
        this.showModal = true;
      }
    },
    async showTeamToReplace() {
      this.showPokeToReplace = true;
    },
    async refreshUserData() {
      const userData = await getUserData(this);
      if (userData) {
        this.forSelection(); // Refresh button state
      }
    },
    closeModal() {
      this.showModal = false;
    },
    toggleYesNoModal(){
      this.showYNModal = !this.showYNModal;
    },
    replacePokemon(poke){
      this.modalTitle = `Are you sure?`;
      this.modalMessage = `do you want to replace ${this.pokemon.name} with ${poke}`;
      this.oldPoke = poke;
      this.toggleYesNoModal();
    },
    async acceptReplace(){
      await replacePokemonInTeam({user:this.userData,newPokemon:this.pokemon.name,pokemon:this.oldPoke,token:this.token}).then( 
        await this.refreshUserData()
      )
      this.toggleYesNoModal();
      this.showPokeToReplace = false;
      this.modalTitle = `Success!`;
      this.modalMessage = `${this.pokemon.name} was successfully added to your team instead of ${this.oldPoke}`;
      this.showModal = true;
      this.oldPoke = null;
    }
  },
  async mounted() {
    const pokeName = window.location.href.split("/").pop();

    try {
      const pokemonData = await fetchPokemonByName(pokeName);
      this.pokemon = pokemonData;
      this.getIcon(this.pokemon.type);

      const userData = await getUserData(this);
      if (userData) {
        this.forSelection();
      }
    } catch (error) {
      this.error = "Error fetching data: " + error.message;
      console.error(this.error);
    }
  },
};
</script>

<style scoped>
* {
  font-family: HomeVideo;
}

.containerOfPokeCard {
  padding-top: 15vh;
}

.PokeCard {
  min-height: fit-content;
  width: 80vw;
  height: fit-content;
  margin: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border: 2px solid;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.Container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.imageAndData {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 48%;
}

.typeAndSuch {
  margin-top: 2vh;
  margin-left: 1vh;
  gap: 5vh;
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  font-size: 2em;
}

.ImageAndName {
  width: 80%;
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
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stats {
  width: fit-content;
}

.stats > div > p {
  font-size: 1em;
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

.selectPokemon {
  display: flex;
  justify-content: center;
  width: fit-content;
}

.button {
  font-size: 1.2em;
  padding-right: 1vw;
  cursor: pointer;
}

/* Type Background Colors */
.fairy {
  background: linear-gradient(135deg, #ee99ac, #ffccd4);
}
.rock {
  background: linear-gradient(135deg, #b8a038, #d1c07e);
}
.steel {
  background: linear-gradient(135deg, #b8b8d0, #d0d0e0);
}
.water {
  background: linear-gradient(135deg, #6890f0, #98a9f0);
}
.ghost {
  background: linear-gradient(135deg, #705898, #9b81b8);
}
.psychic {
  background: linear-gradient(135deg, #f85888, #ff9ca6);
}
.poison {
  background: linear-gradient(135deg, #a040a0, #b070b0);
}
.flying {
  background: linear-gradient(135deg, #a890f0, #c6b7f5);
}
.bug {
  background: linear-gradient(135deg, #a8b820, #d0de67);
}
.ice {
  background: linear-gradient(135deg, #98d8d8, #b3e7e7);
}
.fire {
  background: linear-gradient(135deg, #f08030, #f4a861);
}
.dragon {
  background: linear-gradient(135deg, #7038f8, #a079f4);
}
.dark {
  background: linear-gradient(135deg, #705848, #a39182);
}
.electric {
  background: linear-gradient(135deg, #f8d030, #fde085);
}
.fighting {
  background: linear-gradient(135deg, #c03028, #dc6b66);
}
.grass {
  background: linear-gradient(135deg, #78c850, #a5d68c);
}
.ground {
  background: linear-gradient(135deg, #e0c068, #f4e0a6);
}
.normal {
  background: linear-gradient(135deg, #a8a878, #d3d3b3);
}

</style>