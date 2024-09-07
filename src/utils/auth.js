import axios from "axios";
import  {fetchPokemonByName} from './crud.js';

export async function checkTokenValidity() {
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
}

export async function getUserData(This) {
    try {
        const token = localStorage.getItem('PokeSeed_token'); // Get the token from localStorage
        const username = localStorage.getItem('PokeSeed_username'); // Get the username from localStorage
        
        // Make sure to use the username in the URL
        const response = await axios.get(`/api/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let userData = response.data.user;
        
        // Await for all promises to resolve
        userData.team = await Promise.all(userData.team.map(async (poke) => await fetchPokemonByName(poke)));
        
        This.userData = userData;
        localStorage.setItem('PokeSeed_userData', JSON.stringify(This.userData));
        
        return true;
    } catch (error) {
        This.message = error.response?.data?.message || 'Error fetching user data';
        return false;
    }
}
