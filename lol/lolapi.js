const {lolURL, lolKey} = require('./lolConfig.json');
const fetch = require('node-fetch');

async function get(endPoint, id){
  const query =  encodeURI(id);
  return response = await fetch(`${lolURL}${endPoint}${query}`
        ,{method: 'GET', headers: {"X-Riot-Token": lolKey}})
        .then(response => response.json())
        .catch(e => console.log(e));
}

async function post(){

}

module.exports = {get};