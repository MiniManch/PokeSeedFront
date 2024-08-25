import axios from "axios";

export async function updateUserData(data,This) {
    try {
        const token = localStorage.getItem('PokeSeed_token'); // Get the token from localStorage
        const updates = data;

        const response = await axios.patch('/api/users/update', updates, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });

        This.message = response.data.message;
    } catch (error) {
        This.message = error.response?.data?.message || 'Error updating user';
    }
}

export async function getTrainerData(This) {
    try {
        const name = This.data.trainer;
        const token = localStorage.getItem('PokeSeed_token'); 

        const response = await axios.get(`/api/trainers/${name}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('inside Crud',response.data)
        This.trainerData = response.data; 
    } catch (error) {
        This.message = error.response?.data?.message || 'Error fetching trainer data';
        This.trainerData = null; // Optionally set it to null on error
    }
}

export async function fetchPokemonByName(name,This) {
    try {
      const response = await fetch(`/api/pokemon/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
      }
      This.pokemon = await response.json();
      This.getIcon(This.pokemon); // Call getIcon after fetching the Pokémon data
    } catch (error) {
      This.error = error.message;
      console.error('Error fetching Pokémon:', error);
    }
}

export async function fetchPokemonByType(This) {
    try {
        const response = await fetch(`/api/pokemon/type/${this.selectedType}`);
        if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
        }
        This.Pokemon = await response.json();
        console.log(this.Pokemon)
    } catch (error) {
        This.error = error.message;
        console.error('Error fetching Pokémon:', error);
    }
}

export async function fetchAllPokemon(This) {
    try {
        const response = await fetch('/api/pokemon');
        if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
        }
        This.Pokemon = await response.json();
    } catch (error) {
        This.error = error.message;
        console.error('Error fetching Pokémon:', error);
    }
}


export async function fetchAllTypes(This) {
    try {
        const response = await fetch(`/api/types`);
        if (!response.ok) {
        throw new Error('Failed to fetch Pokémon types');
        }
        This.allTypes = await response.json();
    } catch (error) {
        This.error = error.message;
        console.error('Error fetching Pokémon types:', error);
    }
}

export async function fetchAllTrainers(This) {
    try {
        const response = await fetch(`/api/trainers`);
        if (!response.ok) {
            throw new Error('Failed to fetch trainers');
        }
        const data = await response.json();
        This.data = data.filter(item => item.backSprite == "");
    } catch (error) {
        This.error = error.message;
        console.error('Error fetching trainers:', error);
    }
}