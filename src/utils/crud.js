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

export async function getTrainerData(This,trainerName) {
    try {
        const name = trainerName;
        const token = localStorage.getItem('PokeSeed_token'); 

        const response = await axios.get(`/api/trainers/${name}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    } catch (error) {
        This.message = error.response?.data?.message || 'Error fetching trainer data';
        This.trainerData = null; // Optionally set it to null on error
    }
}

export async function fetchTrainerDataAndAddToList(This, trainerName) {
    try {
      const token = localStorage.getItem('PokeSeed_token'); 
  
      const response = await axios.get(`/api/trainers/${trainerName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Add the response to the trainerData array
      This.trainerData.push(response.data);
    } catch (error) {
      This.message = error.response?.data?.message || 'Error fetching trainer data';
      This.trainerData = null;
    }
  }
  

export async function fetchPokemonByName(name) {
    try {
      const response = await fetch(`/api/pokemon/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      throw error; 
    }
  }

export async function fetchPokemonByType(This) {
    try {
        const response = await fetch(`/api/pokemon/type/${This.selectedType}`);
        if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
        }
        This.Pokemon = await response.json();
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

export async function addPokemonToTeam(user, pokemonName, token) {
    console.log(user.username)
    try {
        const response = await axios.post(
            `/api/users/${user.username}/team`, 
            { pokemonName },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error('Failed to add Pokémon');
        }

        return response.data; // Return the updated team or response data
    } catch (error) {
        console.error('Error adding Pokémon to team:', error);
        throw new Error(error.response?.data?.message || 'Error adding Pokémon to team');
    }
}

export async function replacePokemonInTeam({user, pokemon,newPokemon, token}) {
    try {
        const response = await axios.patch(
            `/api/users/${user.username}/team`, 
            { oldPokemonName: pokemon, newPokemonName: newPokemon },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error('Failed to replace Pokémon');
        }
        else{
            return true;
        }

    } catch (error) {
        console.error('Error replacing Pokémon in team:', error);
        throw new Error(error.response?.data?.message || 'Error replacing Pokémon in team');
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
        This.data = data;
    } catch (error) {
        This.error = error.message;
        console.error('Error fetching trainers:', error);
    }
}

export async function  fetchTournamentData(tournamentId) {
    try {
        const response = await axios.get('/api/tournaments', {
        params: { id: tournamentId } // or { name: this.tournamentName }
        });
        return(response.data)
    } catch (error) {
        console.error('Error fetching tournament:', error);
    }
}

export async function fetchAllOppTrainers(This) {
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

