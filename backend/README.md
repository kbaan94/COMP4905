Using NodeJS for API authentication

This is an Authentication API using JWT's that you can plug inside your current project or you can start with a new one. Email & Password is used for authentication.

The API based on Node.js, Express, MongoDB & Redis.

Mongoose is used for storing Users in Database.
Redis is used for storing Refresh Tokens - to validate them as well at the same time Blacklisting them.


//Project set-up for backend

Step 2: cd into the backend(root) directory and run:

- run 'npm install' to install dependencies

Step 3: Open the sample.env file to copy paste its contents then create a new .env or simply copy from here:

PORT=3300
MONGODB_URI=mongodb://
DBHOST=localhost
DBUSER=
DBPASSWORD=
DBPORT=27017
DB_NAME=music_recommender
ACCESS_TOKEN_SECRET=GENERATE_FROM_GENERATE_KEYS_FILE_IN_HELPER
REFRESH_TOKEN_SECRET=GENERATE_FROM_GENERATE_KEYS_FILE_IN_HELPER

Step 4: Then generate the 256 bit keys using: 

- node ./helpers/generate_keys.js

Step 5: Make sure to install Redis like the following:

- sudo apt-get install redis-server

Step 6: Make sure to run redis right after:

- redis-server

Step 7: We must then install MongoDB

Visit the official mongodb installation website for more information:
 <https://docs.mongodb.com/manual/installation/> 

Step 8: Initiate mongo startup

- sudo service mongod start

Step 9: Finally once everything is properly and installed you may run the back end of the server by:

- npm run serve

