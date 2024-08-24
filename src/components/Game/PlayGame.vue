<template>
    <div>
        <!-- Add button to open trainers to choose from, also display current team and trainer -->
        <Trainers @select="selectTrainer" />
        <!-- Additional game logic and UI components -->
    </div>
</template>

<script>
import axios from 'axios';
import Trainers from './Trainer/AllTrainers.vue';

export default {
    components: {
        Trainers,
    },
    data(){
        return{
            userData:null,
            message:null,
        }
    },
    methods:{
        selectTrainer(trainer) {
            this.updateUserData({'trainer':trainer.name});
        },
        async updateUserData(data) {
            try {
                const token = localStorage.getItem('PokeSeed_token'); // Get the token from localStorage
                const updates = data;

                const response = await axios.patch('/api/users/update', updates, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });

                this.message = response.data.message;
            } catch (error) {
                this.message = error.response?.data?.message || 'Error updating user';
            }
        },
        async getUserData() {
            try {
                const token = localStorage.getItem('PokeSeed_token'); // Get the token from localStorage
                const username = localStorage.getItem('PokeSeed_username'); // Get the username from localStorage
                
                // Make sure to use the username in the URL
                const response = await axios.get(`/api/users/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                this.userData = response.data;
                return true;
            } catch (error) {
                this.message = error.response?.data?.message || 'Error fetching user data';
                return false;
            }
        }
    },
    created(){
        this.getUserData().then(isValid => {
            if (!isValid) {
                this.$router.push('/login');
            }else{
                console.log('show the shit')
            }
        });
    }
}
</script>

<style scoped>
/* Add your styles here */
</style>
