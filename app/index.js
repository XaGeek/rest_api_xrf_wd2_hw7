// We import express
const express= require('express');

// We create an app using express
const app=express();

// Imports sql and body parser
const mysql = require('mysql');
const bodyparser = require('body-parser');

//Configuring express server
app.use(bodyparser.json());

// Creates the settings for the SQL server connection
var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'student',
	password: 'student',
	database: 'crud'
});

// Connects the server
mysqlConnection.connect((err)=> {
	if(!err)
		console.log('Connection Established Successfully');
	else
		console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

// Establish the server connection on the selected port
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));


/**
 * @api {Introduction} / Introduction
 * @apiName Intro
 * @apiGroup Intro
 *
 * @apiDescription This is the documentation for my HW4 REST API with CRUD operation. 
 *
 * In my last homework I did not use the "Request Body" and "Parameters" in my approach, thus those sections will not appear in the documentation.
 *
 * Same goes for the error handling section as there were no mentions nor directions to implement them in the previous assignment and thus they were not integrated.
 *
 */


// Creates a root route that responds with all cities in db (I know it's bad practice but it is more practical for this exercise)
app.get('/' , (req, res) => {

	// The SQL query to select all entries in the table city
	mysqlConnection.query('SELECT * FROM city', (err, rows, fields) => {
		if (!err)
			console.log("Served all database entries."),
			res.send(rows);
		else
			console.log(err);
	})
});

//URI parameters, request body, success response, response errors and examples of successful and successful responses

 
 
/**
 * @api {get} /city/:name Read City
 * @apiName GetCity
 * @apiGroup City
 *
 * @apiDescription This will fetch the data on the given city from the database.
 * Your request parameters must be specified into the url where 
 *
 * :name (string) is the Name of the city you want to look for.
 *
 * Then, the response will be the details of the city with the given name specified. Otherwise, if no match is found, it will return an empty list.
 *
 * @apiExample {Postman GET query} Example usage to search for the city of "Paris":
 * 	GET http://localhost:3000/city/Paris
 *
 * @apiSuccessExample Success (Found):
 *     HTTP/1.1 200 OK
 *	[
 *   		{
 *        	"ID": 2974,
 *        	"Name": "Paris",
 *        	"CountryCode": "FRA",
 *        	"District": "Île-de-France",
 *        	"Population": 2125246
 *   		}
 *	]
 *
 *
 * @apiSuccessExample Success (Not Found):
 *     HTTP/1.1 200 OK
 *	[]
 *
 * @apiSuccess {Integer} ID  ID of the City in the database.
 * @apiSuccess {String} Name  Name of the City.
 * @apiSuccess {String} CountryCode  Country code of the City.
 * @apiSuccess {String} District  District name of the City.
 * @apiSuccess {Integer} Population  Population of the City.
 *
 * @apiSampleRequest http://localhost:3000/city/Paris
 * 
 */
 
// Router to GET (SELECT) a city's details.
app.get('/city/:name' , (req, res) => {

// The SQL query to select the city with the name requested
mysqlConnection.query('SELECT * FROM city WHERE Name = ?',[req.params.name], (err, rows, fields) => {
	if (!err)
		console.log("GET city " + req.params.name),
		res.send(rows);
		
	else
		console.log(err);
	})
});


/**
 * @api {post} /city/:name/:contrycode/:district/:population Create City
 * @apiName PostCity
 * @apiGroup City
 * @apiDescription This will create a record for the specified city into the database.
 * Your request parameters must be specified into the url where 
 *
 * :name (string) is the Name of the city you want to create.
 *
 * :contrycode (string) is the Country Code of the city you want to create.
 *
 * :district (string) is the District of the city you want to create.
 *
 * :population (integer) is the Population of the city you want to create.
 *
 * Then, the response will be the details of the city created with a null value for ID as there were no specifications on how to determine the ID and the SQL table allows null values.
 *
 * @apiExample {Postman POST query} Example usage for the fictional city named "Noxus", with the country code "LOL", located in the district "Ionia" and with population = 45684:
 * 	POST http://localhost:3000/city/Noxus/LOL/Ionia/45684
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *	[
 *   		{
 *        	"ID": null,
 *        	"Name": "Noxus",
 *        	"CountryCode": "LOL",
 *        	"District": "Ionia",
 *        	"Population": 45684
 *   		}
 *	] 
 *
 * @apiSuccess {Integer} ID  ID of the City in the database.
 * @apiSuccess {String} Name  Name of the City.
 * @apiSuccess {String} CountryCode  Country code of the City.
 * @apiSuccess {String} District  District name of the City.
 * @apiSuccess {Integer} Population  Population of the City.
 *
 */

// Router to POST (INSERT) a city's details.
app.post('/city/:name/:countrycode/:district/:population', (req, res) => {

	// The SQL query to insted the city with the specified characteristics into the table
	mysqlConnection.query('INSERT INTO city (Name, CountryCode, District, Population) VALUES (?, ?, ?, ?)',
	[req.params.name, req.params.countrycode, req.params.district, req.params.population], (err, rows, fields) => {
		if (!err)
		
			// The SQL query to select the city we just inserted
			mysqlConnection.query('SELECT * FROM city WHERE Name = ?',[req.params.name], (err, rows, fields) => {
				if (!err)
					console.log("POST city ", req.params.name, req.params.countrycode, req.params.district, req.params.population),
					res.send(rows);
				else
					console.log(err);
			})
		else
			console.log(err);
		})
});


/**
 * @api {put} /city/:name/:population Update City
 * @apiName PutCity
 * @apiGroup City
 * @apiDescription This will update the population from the  specified city in the database.
 * Your request parameters must be specified into the url where 
 *
 * :name (string) is the Name of the city you want to modify.
 *
 * :population (integer) is the new Population value for the city you want to modify.
 *
 * Then, the response will be the details of the city modified.
 *
 * @apiExample {Postman PUT query} Example usage to set the population of the city named "Noxus" to 123456:
 * 	PUT http://localhost:3000/city/Noxus/123456
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *	[
 *   		{
 *        	"ID": null,
 *        	"Name": "Noxus",
 *        	"CountryCode": "LOL",
 *        	"District": "Ionia",
 *        	"Population": 123456
 *   		}
 *	]
 *
 * @apiSuccess {Integer} ID  ID of the City in the database.
 * @apiSuccess {String} Name  Name of the City.
 * @apiSuccess {String} CountryCode  Country code of the City.
 * @apiSuccess {String} District  District name of the City.
 * @apiSuccess {Integer} Population  Population of the City.
 *
 */

// Router to PUT (UPDATE) a city's details.
app.put('/city/:name/:population', (req, res) => {
	mysqlConnection.query('UPDATE city SET Population = ? WHERE Name = ?',[req.params.population, req.params.name], (err, rows, fields) => {
		if (!err)
		
			// The SQL query to select the city we just updated
			mysqlConnection.query('SELECT * FROM city WHERE Name = ?',[req.params.name], (err, rows, fields) => {
				if (!err)
					console.log("PUT city " + req.params.name, " to Population:", req.params.population),
					res.send(rows);
				else
					console.log(err);
			})
		else
			console.log(err);
		})
});



/**
 * @api {delete} /city/:name Delete City
 * @apiName DeleteCity
 * @apiGroup City
 * @apiDescription This will delete the specified city from the database.
 * Your request parameters must be specified into the url where 
 *
 * :name (string) is the Name of the city you want to delete.
 *
 * Then, the response will be a boolean value representing if at least an entry was deleted from the database or not.
 *
 * @apiExample {Postman DELETE query} Example usage to delete the city "Noxus":
 * 	DELETE http://localhost:3000/city/Noxus/
 *
 * @apiSuccess {Boolean} CityWasDeleted  Boolean representing if the city was deleted from the database or not. 
 *
 * @apiSuccessExample Success-Response (Deleted at least one entry):
 *     HTTP/1.1 200 OK
 *	true 
 *
 * @apiSuccessExample Success-Response (Deleted nothing):
 *     HTTP/1.1 200 OK
 *	false
 *
 */

// Router to DELETE (DELETE) a city's details.
app.delete('/city/:name', (req, res) => {


	// The SQL query to delete the city with the specified name
	mysqlConnection.query('DELETE FROM city WHERE Name = ?',[req.params.name], (err, rows, fields) => {
		if (!err)
		
			// We return a boolean value based on the number of rows affected by the delete operation
			console.log("ATTEMPT TO DELETE city " + req.params.name),
			console.log("Query affected", rows["affectedRows"], "row(s)."),
			console.log(Boolean(rows["affectedRows"])),
			res.send(Boolean(rows["affectedRows"]));
		else
			console.log(err);
		})
});
