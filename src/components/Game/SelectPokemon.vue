<template >
    <div class="SelectPokemon">
        <div class="pokeTypes">
            <PokeTypes />
        </div>
    </div>
</template>
<script>
import PokeTypes from '../Poke/PokeTypes.vue';
export default {
    components: {
        PokeTypes,
    },
    data(){
        return{
            Pokemon:null,
            PokeTypes:null,
        }
    },
    methods: {
        async checkTokenValidity() {
            const token = localStorage.getItem('PokeSeed_token');

            if (!token) {
                console.error('No token found in localStorage');
                return false;
            }

            try {
                const response = await fetch('/api/users/check-login', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });

                if (response.ok) {
                console.log('Token is valid');
                return true;
                } else {
                const errorData = await response.json();
                console.error('Token is invalid or expired:', errorData.message);
                return false;
                }
            } catch (error) {
                console.error('Error during token validation:', error.message);
                return false;
            }
        },
        async fetchAllTypes() {
            try {
                const response = await fetch(`/api/types`);
                if (!response.ok) {
                throw new Error('Failed to fetch Pokémon types');
                }
                this.PokeTypes = await response.json();
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching Pokémon types:', error);
            }
        },
            async fetchPokemon() {
            try {
                const response = await fetch('/api/pokemon');
                if (!response.ok) {
                throw new Error('Failed to fetch Pokémon');
                }
                this.Pokemon = await response.json();
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching Pokémon:', error);
            }
        }
    },
    created() {
        this.checkTokenValidity().then(isValid => {
            if (!isValid) {
                this.$router.push('/login');
            }else{
                this.fetchPokemon();
                this.fetchAllTypes();
            }
        });
    }
};
</script>

<style scoped>
.SelectPokemon{
    display: flex;
    justify-content: center;
}
.pokeTypes {
    width: fit-content;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center; /* Center vertically */
}
</style>
