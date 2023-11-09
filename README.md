# NodeJS-Backend-System


//Node.js Backend-System
//Backend => NodeJS HTTP server + Database + Authentication
//server => should handle requests(process request and return response)

//NODEMON- Automatically restart the server
//install the nodemon using npm
//using npx nodemon filename.js(this will automatically rerun the file,if changes are made)

//Authentication
//Encryption is converting credentials to token ,and getting back credentails from token
//Hashing is only on way
//Here for every encryption method we need a unique secret key
//Use jsonwebtoken library for implementing encrption(sign()),decryption(verify())

//Mangoose
//It is a JS library that is used to connect to mongodb cluster,and give us methods to work on that cluster
//cluster contains many databases
//each database contains collections(tables)
//each collections contains documents(row)
