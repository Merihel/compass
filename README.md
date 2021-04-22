# Compass
Compass is a web-based application that connects to your Discord. Featuring users biography, game list, linking with Steam, PSN and other game services. Manage users, events, connections, ... with the dedicated Discord Bot.

## Technologies used  
**NodeJS**
For Discord bot and backend  

**Moleculer**
The framework for micro-services, deploying a REST API, and using the MySQL adapter `moleculer-db-adapter-sequelize`  

**Discord-js**
The JS lib to exploit Discord's API  

**Nodemailer**
To send emails with Node  

**React**
As frontend framework  

**Semantic UI**
 A lib for frontend UI  

## To work with Compass

 1. Clone repo
 2. `npm install` or `yarn` to install Node dependencies
 3. To the root of the project, add a `.env` file with following content :  

    **JWT_SECRET**  a secret key for the JWT  

	**BOT_TOKEN** your discord bot token (see https://discord.com/developers/applications)  

	**HTTP** *(for website)* a value between `http://` and `https://`  

	**HOST** *(for website)* the host (ip or domain name)  

	**WEB_PORT** *(for website)* the port in use  

	**MAIL_HOST** *(mail config)* the host of the mail server  

	**MAIL_PORT** *(mail config)* the port of the SMTP  

	**MAIL_ID** *(mail config)* the mail account identifier  

	**MAIL_PASS** *(mail config)* the mail account pass  

	**DB_NAME** *(db config)* the database schema name (database loaded on DB_HOST, port 3306)  

	**DB_USER** *(db config)* the database username  

	**DB_PASS** *(db config)* the database password  

	**DB_HOST** *(db config)* the database host  

4. Add a `config.json` at the root of the project with an object containing following key/values :  

	**pre** the Discord bot command prefixe  

    **guildName** the Discord guild name  

	**guildId** the Discord guild id  
