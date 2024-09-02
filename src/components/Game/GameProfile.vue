<template>
    <div class="GameProfile" v-if="trainerData">
        <div class="container">
            <div class="trainer">
                <div class="bgImage" :style="{ backgroundImage: `url(${userData.bg})` }">
                    <div class="profieImage" :style="{ backgroundImage: `url(${trainerData.profileImage})` }"></div>
                    <div class="pokemon">
                        <div 
                            class="poke"
                            v-for="poke in computedPoke"
                            :key="poke.name"
                            @mouseover="poke.isOpen = true"
                            @mouseleave="handleMouseLeave(poke)"
                        >
                            <img 
                                :src="poke.isOpen || poke.wasOpen ? openSrc : closeSrc" 
                                :alt="poke.name"
                                class="pokeBallImage"
                            >
                            <img 
                                class="openPoke animate__animated"
                                :src="poke.frontSprite"
                                :alt="poke.name"
                                v-show="poke.isOpen || poke.wasOpen"
                                :class="{
                                    'animate__zoomIn': poke.isOpen,
                                    'animate__zoomOut': !poke.isOpen && poke.wasOpen
                                }"
                                @animationend="handleAnimationEnd(poke)"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getTrainerData, fetchPokemonByName } from '@/utils/crud';
import { getUserData } from '@/utils/auth';

export default {
    data(){
        return{
            trainerData: null,
            userData: null,
            closeSrc: '/Images/profileImages/pokeball/close.png',
            openSrc: '/Images/profileImages/pokeball/open.png',
            computedPoke: []
        };
    },
    methods: {
        async setupTeamData() {
            if (this.userData && this.userData.team) {
                for (const poke of this.userData.team) {
                    let newPoke = await fetchPokemonByName(poke);
                    newPoke.isOpen = false;
                    newPoke.wasOpen = false; // Track if it was open to trigger zoomOut
                    this.computedPoke.push(newPoke);
                }
            }
        },
        handleMouseLeave(poke) {
            poke.wasOpen = true; // Mark that it was open so the zoomOut animation plays
            poke.isOpen = false;
        },
        handleAnimationEnd(poke) {
            if (!poke.isOpen) {
                poke.wasOpen = false; // Reset after the zoomOut animation ends
            }
        }
    },
    async created() {
        const isValid = await getUserData(this);
        if (!isValid) {
            this.$router.push('/login');
        } else {
            await getTrainerData(this, this.userData.trainer);
            this.setupTeamData();
        }
    }
};
</script>

<style scoped>
.GameProfile {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.trainer {
    width: 70%;
    height: 70%;
}
.bgImage {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.profieImage {
    position: absolute;
    top: 5%;
    right: 0;
    width: 40%;
    height: 90%;
    background-size: contain;
    background-position: top;
    background-repeat: no-repeat;
}
.pokemon {
    display: flex;
    gap: 2vw;
    height: 15vh;
    z-index: 1;
}

.poke {
    position: relative;
}
.pokeBallImage {
    width: 100px;
}

.openPoke {
    position: absolute;
    top: -40%;
    left: -50%;
    width: 10vw;
    z-index: 2;
}

.animate__animated.animate__zoomIn {
    --animate-duration: 0.5s;
}

.animate__animated.animate__zoomOut {
    --animate-duration: 0.5s;
}
</style>
