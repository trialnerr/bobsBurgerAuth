const axios = require('axios');
const url = 'https://bobsburgers-api.herokuapp.com/characters/?limit=20';

async function getCharacters(n) {
  try {
    const response = await axios.get(
      `https://bobsburgers-api.herokuapp.com/characters/?limit=20&skip=${20*n}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getCharacters; 


