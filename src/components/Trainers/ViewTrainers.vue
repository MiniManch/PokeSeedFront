<template>
    <div class="ViewTrainers">
        <div class="container">
            <div class="row" v-for="(trainerRow, index) in chunkedData" :key="index">
                <TrainerCard v-for="trainer in trainerRow" :key="trainer.id" :trainerData="trainer" />
            </div>
        </div>
    </div>
</template>

<script>
import TrainerCard from './TrainerCard.vue';

export default {
    props:{
        choose:{
            type:Boolean,
            required:false
        }
    },
    data() {
        return {
            data: [],
        };
    },
    components: {
        TrainerCard
    },
    computed: {
        chunkedData() {
            // Chunk data into arrays of 3
            const chunkSize = 3;
            const chunks = [];
            for (let i = 0; i < this.data.length; i += chunkSize) {
                chunks.push(this.data.slice(i, i + chunkSize));
            }
            return chunks;
        }
    },
    mounted() {
        // Fetch initial data
        this.fetchAllTrainers();
    },
    methods: {
        async fetchAllTrainers() {
            try {
                const response = await fetch(`/api/trainers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trainers');
                }
                const data = await response.json();
                if(this.choose){
                    this.data = data.filter(item => item.backSprite != "");
                }else{
                    this.data = data.filter(item => item.backSprite == "");
                }
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching trainers:', error);
            }
        },
    }
}
</script>

<style scoped>
    .ViewTrainers {
        display: flex;
        justify-content: center;
        margin-top: 0;
        padding-top: 15vh;
    }
    .container {
        display: flex;
        flex-direction: column; /* Stack rows vertically */
        align-items: center;
        width: 85%;
        gap: 2vh; /* Space between rows */
    }
    .row {
        display: flex;
        justify-content: space-between; /* Align cards to the left in each row */
        width: 100%;
        gap:1vw;
    }
</style>
