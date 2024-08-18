<template >
    <div class="TrainerCard">
        <div class="container framed">

            <div class="data">
                <h2>{{trainer.name}}</h2>
                <div class="rating">
                    <h3>Rating : {{trainer.rating}}</h3>
                    <img src="/images/star/star-50.png">
                </div>
                <div class="stats">
                    <div class="wins">
                        <p>Wins:{{trainer.wins}}</p>
                    </div>
                    <div class="champion">
                        <p>Championships:{{trainer.wins}}</p>
                        <img src="/images/crown/crown-50.png">
                    </div>
                    <div class="losses">
                        <p>Losses:{{trainer.wins}}</p>
                    </div>
                </div>
            </div>
            
            <div class="image">
                <img :src="trainer.frontSprite" alt="">
            </div>

        </div>
    </div>
</template>
<script>

// {
//       "name": "Cyrus",
//       "team": [],
//       "rating": "",
//       "wins": "",
//       "champion": "",
//       "losses": "",
//       "frontSprite": "https://res.cloudinary.com/dfvncr99h/image/upload/v1723573787/Poke/trainers/Cyrus_Front_tx4qqy.png",
//       "backSprite": ""
// },

export default {
    props: {
        trainerData: {
            type: Object,
            required: true
        },
    },
    data(){
        return{
            trainer:this.trainerData,
        }   
    },
    mounted(){
        console.log(this.trainerData)
        this.trainer.wins = Number(this.trainer.wins != '' ? this.trainer.wins : 0);
        this.trainer.champion = Number(this.trainer.champion != '' ? this.trainer.champion : 0);
        this.trainer.losses = Number(this.trainer.losses != '' ? this.trainer.losses : 0);
    }
}
</script>
<style scoped>
    .container{
        width:100%;
        display: flex;
    }

    h2{
        margin-bottom: 5vh;
        font-size: 2em;
    }

    .rating,.champion{
        display: flex;
        align-items: center;
        gap: 1vw;
    }

    div>img{
        width: 40px;
    }
    .image>img{
        width:200px;
    }
</style>