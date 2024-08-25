<template>
    <div class="ViewTrainers">
        <div class="container">
            <div class="row" v-for="(trainerRow, index) in chunkedData" :key="index">
                <TrainerCard
                    v-for="trainer in trainerRow"
                    :key="trainer._id"
                    :trainerData="trainer"
                    @select="onTrainerSelected"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TrainerCard from './TrainerCard.vue';
import { fetchAllTrainers } from '@/utils/crud';
export default {
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
            const chunkSize = 3;
            const chunks = [];
            for (let i = 0; i < this.data.length; i += chunkSize) {
                chunks.push(this.data.slice(i, i + chunkSize));
            }
            return chunks;
        }
    },
    mounted() {
        fetchAllTrainers(this);
    },
    methods: {
        onTrainerSelected(trainer) {
            this.$emit('select', trainer);
        }
    }
}
</script>

<style scoped>
    .ViewTrainers {
        margin-top: 0;
        padding-top: 15vh;
        width: 100%;
    }
    .container {
        margin: 0 auto;
        width: fit-content;
        display: flex;
        flex-direction: column;
        gap: 2vh;
    }
    .row {
        display: flex;
        width: 100%;
        gap: 1vw;
    }
</style>
