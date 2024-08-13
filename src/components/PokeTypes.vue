<template >
    <div class="PokeTypes">
        <div class="Container">
            <TypeCard :PokeType="item" v-for="item in data" :key="item.name" />
        </div>
    </div>
</template>

<script>
import TypeCard from './TypeCard.vue';
import typeData from '@/assets/data/typeIcons.json';

export default {
    data(){
        return{
            data : typeData,
        }
    },
    components:{
        TypeCard,
    }
}
</script>
<style scoped>

.Container{
    height:50vh;
    width:50%;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap:2vw;
}
    
</style>