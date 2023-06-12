
# Pizza API

This application serves the purpose of exposing a REST API to be consumed by a client
(not required to be implemented) for a restaurant. The database model will be at the
end of this document. We will have pizzas, salesman, order and order item.

The required entities should be created so sequelize or the ORM library chosen works
properly with the database. We’ve created a mock database that you will be able to
connect and read (but you won’t be able to update/delete any record). The credentials
will be given together with this document.
## Tech Stack

**Back-end:** Node, Express, PostgresSQL, Typescript, Prisma, jest and Supertest, nodemailer


## How it works?


## Requirements

The API has the following endpoints:

● GET /orders: returns the list of current orders ids (all the orders on the table
“order”)

● GET /order/:id: returns the details of a single order

● PUT /order: this endpoint will receive a new order with all the order items that
the client wants (you can hardcode the pizzas’ ids). This endpoint will have to
execute a round robin with all the salesmen to choose to which salesman the
order goes to. We’ve created a column called round_robin_index in the salesmen
table to help with this functionality. So the first time an order arrives, it will have
to be assigned to the salesman with the round_robin_index 1, the second order
to the one with the index 2 and so on. Once all the salesmen have been
assigned with an order, it should restart with the salesmen with index 1. And
again to the whole loop over and over again. If you would need any change on
the database you can comment on the code what would you change on the
database and instead use a file on the project as the database.
1

● POST /thank-you: this last endpoint will receive an email address
and it has to send an email to the address and thank the client for the order. 


## Installation




```bash
  1. Clone the repository
  2. In the pizza-api folder run 'npm i'
  3. To change the db URL go to .env file and put the new URL
  4. To run the server 'npm start' or "nodemon"
  5. To manage the data on the DB with the Prisma run 'npx prisma studio'
  6. The application will be available at 'http://localhost:3002'
  7. To populate the Database with pizza's information and Salesman information use Thunder with the endpoint: "/generate" 
  8. To run the tests first start the server and then 'npx jest'
```
    
