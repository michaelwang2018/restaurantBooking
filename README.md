# Restaurant Booking API by Michael Wang

## Overview
This repository is for a backend social Restaurant Booking API. It can be run locally using node, and will run on http://localhost:3000 as defined in api.js

Here's a description of the API's:

### GET /restaurants
The entry point! This API is designed to return a list of restaurants (max 10) that both have a table available large enough to accomodate the party size as well as accomodate the group's dietary restrictions. This endpoint expects to receive a body with a string of Eater names separated by a comma & space that represents the proposed reservation party, as well as a string datetime stamp (timezone is preferred unless you're booking for UTC). In the base test data, George is Vegan & Elise is Vegetarian, and there are no reservations.

Here is an example of a proper request body using our base test data:

{
    "eaters": "Scott, George, Elise",
    "time": "Apr 8 2024 19:00 PST"
}

Which would yield the only restaurant that has endorsements for both Vegan and Vegetarian food and has available tables that can support 3 people:

[
    "Falling Piano Brewing Co"
]

There are many failure points for this request. 
If an eater isn't included, the request will fail with:

No eaters provided



### POST /reservations
Now to the fun part, to actually creating reservations! After retrieving your list of suitable restaurant(s), you can now make a decision on where your party will eat. This API expects to receive a body with a string representing the Eaters' names, a datetime string, and a restaurant name as a string.

Here's an example:

{
    "eaters": "Scott, George, Elise",
    "time": "Apr 8 2024 19:00 PST",
    "restaurant": "Falling Piano Brewing Co"
}

When successful, it will return a message with your reservation id like so:

Reservation created with id: 2

### DELETE /reservations
Oh no! Your plans fell through? Not to worry, as you can delete reservation through this endpoint. Throw in the reservation id you'd like cancelled, and optionally, the name of the Eater cancelling to ensure someone isn't cancelling the wrong/unauthorized reservation.

Here's an example body:

{
    "id": "2",
    "eater":"Scott"
}

And an example response, confirming the deleted reservation data:
{
    "id": 2,
    "restaurant": "Falling Piano Brewing Co",
    "eaters": "Scott, George, Elise",
    "tableSize": 4,
    "time": "2024-04-09 03:00:00.000 +00:00",
    "createdAt": "2024-04-05 12:22:56.844 +00:00",
    "updatedAt": "2024-04-05 12:22:56.844 +00:00"
}

If the eater in the request isn't on the reservation, it will fail with:

    Eater not found in reservation. Unauthorized to delete reservation.


## Setup Guide
Now, everyone's favorite thing! Setup!

This guide assumes you have node installed. If not, please install from https://nodejs.org/en

To get started, run the following command in terminal:
    npm install 

Surprisingly painless! (hopefully)... 
Once all the dependencies are installed, you should be able to run the either of the following commands to start the local server:
    npm start
    node src/index.js
    
The database should already be seeded with test data from the seeders folder. If you feel like adding your own, you can replace the data in the files in the seeders folder and run the following command to put them in the DB:
    sequelize db:seed:all

For viewing & interacting with the database while testing, I'd recommend either downloading DB Browser for SQLite at https://sqlitebrowser.org/ or installing an extension into your IDE, such as the SQLite Viewer VS Code extension




Original Project Description:

## Rec project: Restaurant Booking API with a social Twist 

This is designed to be close to actual work - search, use any language and libraries, use a database. Feel free to use the database for as much or as little as you would do in real-life, there is no need to implement something in code if you would normally do with a database operation. Write this as if it were production code, and add any tests you think are important. 

### Product requirements 

We’re building the backend for an app that allows users to do the following: with a group of friends, find a restaurant that fits the dietary restrictions of the whole group, with an available table at a specific time, and then create a reservation for that group and time. 
Our world has the following: 
### ● Eaters 
    ○ Name 
    ○ Zero or more dietary restrictions (“Gluten Free”, “Vegetarian”, “Paleo”, etc.) 
### ● Restaurants 
    ○ Name 
    ○ Zero or more endorsements (“Vegan-friendly”, “Gluten-Free-Friendly”, “Paleo-friendly”) 
### ● Tables 
    ○ Capacity (e.g. Seats 4 people) 
### ● Reservations 
    ○ Table 
    ○ Diners 
    ○ Time 

Assume that reservations last 2 hours. Users may not double-book or have overlapping reservations. Eg. Jane may not have a reservation at McDonalds at 7pm and at Burger King at 7:30pm. 

To start the project, create diners, restaurants, and tables in bulk or hard-code these. We do not need API endpoints to create these. We have linked a Google Sheet of data you can use to start. (This is not supposed to be representative of the database structure, you likely want to model this differently in your solution). 

With this starting point, build endpoints to do the following: 
● An endpoint to find restaurants with an available table for a group of users at a specific time. 
    ○ Example: Scott, George and Elise are looking for a reservation at 7:30pm on Tuesday. Return a list of restaurants with an available table (for that many people or more) at that time, which meets all of the group’s dietary requirements. 
● An endpoint that creates a reservation for a group of users. This will always be called after the search endpoint above.
● An endpoint to delete an existing reservation. 

### Out of scope 

Only the API is in scope - the UI is out of scope. Authentication is out of scope. Don’t worry about hosting this somewhere publicly accessible - we can run it on your local machine. 

### Deliverable 

Please send us a link to a git repo


Name	No. of two-top tables	No. of four-top tables	No. of six-top tables	Endorsements			
Lardo	4	2	1	Gluten Free Options			
Panadería Rosetta	3	2	0	Vegetarian-Friendly, Gluten Free Options			
Tetetlán	4	2	1	Paleo-friendly, Gluten Free Options			
Falling Piano Brewing Co	5	5	5				
u.to.pi.a	2	0	0	Vegan-Friendly, Vegetarian-Friendly			