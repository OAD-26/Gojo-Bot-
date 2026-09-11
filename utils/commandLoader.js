/**
 * Command Loader - Separate module to avoid circular dependencies
 */

const fs = require('fs');
const path = require('path');

function getAliases(command) {
  const aliases = [];

  if (Array.isArray(command.aliases)) aliases.push(...command.aliases);
  if (Array.isArray(command.alias)) aliases.push(...command.alias);
  else if (typeof command.alias === 'string') aliases.push(command.alias);

  return [...new Set(
    aliases
      .filter(Boolean)
      .map(alias => String(alias).trim().toLowerCase())
      .filter(alias => alias && alias !== command.name)
  )];
}

// Load all commands
const loadCommands = () => {
  const commands = new Map();
  const commandsPath = path.join(__dirname, '..', 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.log('Commands directory not found');
    return commands;
  }
  
  const categories = fs.readdirSync(commandsPath);
  
  categories.forEach(category => {
    const categoryPath = path.join(commandsPath, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      files.forEach(file => {
        try {
          const command = require(path.join(categoryPath, file));
          if (command.name) {
            const commandName = String(command.name).trim().toLowerCase();
            command.name = commandName;
            command.aliases = getAliases(command);

            if (commands.has(commandName) && commands.get(commandName) !== command) {
              console.warn(`Duplicate command name "${commandName}" in ${file}; keeping the first registered command.`);
              return;
            }

            commands.set(commandName, command);
            command.aliases.forEach(alias => {
              if (commands.has(alias)) {
                const existing = commands.get(alias);
                if (existing !== command) {
                  console.warn(`Alias "${alias}" from ${file} conflicts with "${existing.name}"; keeping the first registered command.`);
                  return;
                }
              }
              commands.set(alias, command);
            });
          }
        } catch (error) {
          console.error(`Error loading command ${file}:`, error.message);
        }
      });
    }
  });
  
  return commands;
};

module.exports = { loadCommands };

