<template>
  <div class="viewMoveContainer">
    <img :src="getIcon(move)" alt="" class="typeIcon"/>
    <p>{{ move.name }}</p>
    <div class="moveStats">
      <div class="stat">
        <img src="../../../public/Images/icons/damage/damage.png" alt="" />
        {{ move.dmg }}
      </div>
      <div class="stat">
        <img src="../../../public/Images/icons/accuracy/accuracy64.png" alt="" />
        {{ move.acc }}
      </div>
      <div class="stat" v-if="move.effect != ''">
        <img src="../../../public/Images/icons/effect/effect.png" alt="" />
        {{ move.effect }}
      </div>
    </div>
  </div>
</template>

<script>
import typeIcons from "@/assets/data/typeIcons.json";
export default {
  props: {
    move: {
      type: Object,
    },
  },
  methods: {
    getIcon(move) {
      const icon = typeIcons.filter((obj) => obj.name == move.type)[0];
      return icon.image;
    },
  },
};
</script>

<style scoped>
.viewMoveContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1vh;
  height:100%;
}
img {
  width: 2vw;
}
.typeIcon{
    margin-left: 30%;
}
.stat {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1vh;
  margin-bottom: 1vh;
}
.moveStats {
  border: none;
  box-shadow: none;
}
</style>
