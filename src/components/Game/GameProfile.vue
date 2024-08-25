<template >
    <div class="GameProfile" v-if="trainerData">
        <div class="container">
            <div class="trainer">
                <img :src="trainerData.frontSprite" alt="">
            </div>
            <div class="pokemon"></div>
        </div>
    </div>
</template>
<script>
import { getTrainerData } from '@/utils/crud';

export default {
    data(){
        return{
            trainerData:null,
        }
    },
    props:{
        data:{
            type: Object,
            required: true,
        }
    },
    created(){
        getTrainerData(this)
    },
}

</script>
<style scoped>
.GameProfile{
    width:100vw;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>