Discord Minecraft Bot

A Discord bot to manage your Minecraft server's whitelist directly from Discord using RCON.

It is highly recommended to host this bot on the same machine as the Minecraft server for minimal latency. However, it can connect to any RCON host specified in the environment variables.

✨ Features

Discord-based Whitelisting: Allows users to add their Minecraft nicknames to the server's whitelist by sending a message in a specific channel.

Configurable Channels: Server administrators can set a specific channel for whitelist commands using a simple bot command. (Uses lowdb for storage).

RCON Integration: Securely communicates with the Minecraft server using the RCON protocol.

Rate Limiting: Prevents spam by limiting whitelist requests (one per 5 seconds).

Easy Configuration: Key settings are managed via environment variables.

⚙️ Prerequisites

Node.js (v18.x or higher recommended)

pnpm

A running Minecraft server with RCON enabled.

🚀 Installation & Setup

Clone the repository:

git clone [https://github.com/](https://github.com/)<your-username>/discord-minecraft-bot.git
cd discord-minecraft-bot


Install dependencies using pnpm:

pnpm install


Configure environment variables. Create a .env file in the root of the project and fill in the required values.

cp .env.example .env


🔧 Configuration (.env.example)

# Discord Bot Configuration
DISCORD_TOKEN="<your_discord_bot_token>"

# Minecraft RCON Configuration
# (It's recommended to set RCON_HOST to "localhost" if bot is on the same machine)
RCON_HOST="localhost"
RCON_PORT="<your_rcon_port>"
RCON_PASSWORD="<your_rcon_password>"


Note: The RCON port and password must match the ones set in your Minecraft server's server.properties file.

💬 Commands

/set-channel: (Admin only) Sets the current channel as the only channel where whitelist commands are accepted.

!whitelist <minecraft_username>: (In the set channel) Adds the specified Minecraft username to the server's whitelist.

(Note: Please update the commands above to match your actual implementation.)

▶️ Usage

Development

Run the bot for development (with auto-reloads if using nodemon or similar):

pnpm dev


(You might need to add a dev script to your package.json)

Production

Run the bot for production:

pnpm start


For more robust production use (auto-restarts, monitoring), it is recommended to use pm2:

# Start the bot with pm2
pm2 start pnpm --name "discord-mc-bot" -- start

# View logs
pm2 logs discord-mc-bot

# Stop
pm2 stop discord-mc-bot


📜 License

This project is licensed under the MIT License. See the LICENSE file for details.