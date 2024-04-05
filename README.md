# Restaurant Booking API by Michael Wang




To seed the DB with test data from the seeders folder:

sequelize db:seed:all




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