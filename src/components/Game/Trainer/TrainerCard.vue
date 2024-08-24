<template>
    <div class="TrainerCard">
        <div class="container framed">
            <div class="images">
                <div class="image">
                    <img :src="trainerData.frontSprite" alt="">
                </div>
                <div class="image">
                    <img :src="trainerData.backSprite" alt="">
                </div>
            </div>
            <button class="button" @click="selectTrainer">Select Trainer!</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        trainerData: {
            type: Object,
            required: true
        },
    },
    methods: {
        selectTrainer() {
            this.$emit('select', this.trainerData);
        }
    }
}
</script>

<style scoped>
    .container {
        min-width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5vh;
        height: 40vh;
        padding: 0;
        padding-top: 2vh;
        padding-left: 2vh;
    }
    .images {
        display: flex;
        justify-content: center;
    }
    div > img {
        width: 40px;
    }
    .image > img {
        width: 8vw;
    }
</style>
