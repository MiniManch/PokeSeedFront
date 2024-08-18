<template>
    <div class="ViewTrainers">
        <div class="container">
            hey
            <TrainerCard v-for="trainer in data" :key="trainer.id" :trainerData="trainer" />
        </div>
    </div>
</template>
<script>
import TrainerCard from './TrainerCard.vue';
export default {
    props: {
        data: {
            type: Array,
            required: true
        },
    },
    components:{
        TrainerCard
    },
    mounted(){
        console.log(this.data)
    }
}
</script>
<style scoped>
    .ViewTrainers{
        display: flex;
        justify-content: center;
        min-height:100%;
        min-width: 100%;
    }
    .container{
        display: flex;
        justify-content: flex-start;
        width:100%;
        flex-wrap: wrap
    }
</style>