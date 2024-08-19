<template>
    <div class="ViewTrainers">
        <div class="container">
            <TrainerCard v-for="trainer in data" :key="trainer.id" :trainerData="trainer" />
        </div>
    </div>
</template>
<script>
import TrainerCard from './TrainerCard.vue';
export default {
    data() {
        return {
        data: [],
        };
    },
    components:{
        TrainerCard
    },
    mounted() {
        // Fetch initial data
        this.fetchAllTrainers();
    },
    methods:{
        async fetchAllTrainers() {
            try {
                const response = await fetch(`/api/trainers`);
                if (!response.ok) {
                throw new Error('Failed to fetch trainers');
                }
                this.data = await response.json();
                // console.log(this.allTrainers)
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching trainers:', error);
            }
        },
    }
}
</script>
<style scoped>
    .ViewTrainers{
        display: flex;
        justify-content: center;
        min-height:100%;
        min-width: 100%;
        margin:5vh;
        margin-top: 0;
        padding-top: 15vh;
    }
    .container{
        display: flex;
        justify-content: flex-start;
        width:100%;
        flex-wrap: wrap
    }
</style>