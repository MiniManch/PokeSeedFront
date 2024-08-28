<template >
    <div class="GameProfile" v-if="trainerData">
        <div class="container">
            <div class="trainer">
                <div class="bgImage" :style="{ backgroundImage: `url(${data.bg})` }">
                    <div class="profieImage" :style="{ backgroundImage: `url(${trainerData.profileImage})` }"></div>
                </div>
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
            trainerData: null,
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
    }
}
</script>

<style scoped>
.GameProfile {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.container{
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.trainer{
    width:50%;
    height:50%;
}
.bgImage {
    position: relative;
    width: 100%;
    height: 80%;
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
}

.profieImage {
    position:absolute;
    top:5%;
    right:0;
    width: 50%;
    height: 90%;
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
}
</style>
