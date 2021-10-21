const {SlashCommandBuilder} = require('@discordjs/builders');
const {summonerByNameEndPoint, rankedSummonerEndPoint} = require('../lolConfig.json');
const lolapi = require('../lolapi.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('summoner')
          .setDescription('Player info')
          .addStringOption(option =>
            option.setName('username')
              .setDescription("Summoner's name")
              .setRequired(true)),
  async execute(interaction){
    await interaction.deferReply();
    // Gets the username passed with the command
    const summonerName = interaction.options.getString('username');

    // Request the JSON with player information, then takes the id, name and level
    const {id, name, summonerLevel} = await lolapi.get(summonerByNameEndPoint, summonerName);
    
    // Error when the name is passed in the command, the name is wrong and the summoner doesn't exists
    if(id === undefined){
      interaction.editReply("Summoner doesn't exists!!");
      return;
    }

    // Request the JSON with ranked queues information using the player id
    const responseRanked = await lolapi.get(rankedSummonerEndPoint, id)
    

    var rankedInfo = "";
    const summonerInfo = `Name: ${name}\nLevel: ${summonerLevel}\n\n`;

    // responseRanked is a array with the ranked queues, if the player has a tier
    for(const rankedQueueInfo of responseRanked){
      const {queueType, tier, rank, leaguePoints, wins, losses} = rankedQueueInfo;
      const winrate = ((wins / (wins + losses)) * 100).toFixed(1);
      rankedInfo += `${queueType}\n${tier} ${rank}\nLP: ${leaguePoints}\nWins: ${wins}\nLosses: ${losses}\nWinRate: ${winrate}%\n\n`;
    }
    interaction.editReply(summonerInfo + rankedInfo);
  },
};// end module.exports