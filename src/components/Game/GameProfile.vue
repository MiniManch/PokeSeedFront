<template >
    <div class="GameProfile" v-if="trainerData">
        <div class="container">
            <div class="trainer">
                <div class="bgImage" :style="{ backgroundImage: `url(${userData.bg})` }">
                    <div class="profieImage" :style="{ backgroundImage: `url(${trainerData.profileImage})` }"></div>
                </div>
            </div>
            <div class="pokemon">
                <div class="poke" v-for="poke in userData.team" :key="poke.name">
                    <img src="/Images/profileImages/pokeball/close.png" :alt="poke.name">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getTrainerData } from '@/utils/crud';
import { getUserData } from '@/utils/auth';
// import {updateUserData} from '@/utils/crud';

export default {
    data(){
        return{
            trainerData: null,
            userData: null,
        }
    },
    created(){
        getUserData(this).then(isValid => {
            if (!isValid) {
                this.$router.push('/login');
            }else{
                getTrainerData(this,this.userData.trainer)
            }
        });
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
    width:70%;
    height:70%;
}
.bgImage {
    position: relative;
    width: 100%;
    height: 100%;
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
