const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./lol/commands').filter(file => file.endsWith('.js'));
// If I use more than 1 commands directory: creates a object with the file and path
for (const file of commandFiles) {
	const command = require(`./lol/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try{
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      //Routes.applicationCommands(clientId), - adds global commands 
      Routes.applicationGuildCommands(clientId, guildId),
      {body: commands},
    );

    console.log('Successfully reloaded application (/) commands.');
  }
  catch (error){
    console.error(error);
  }
})();