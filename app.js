const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const {buildSchema } = require("graphql");


const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next)=>{
    res.send("GraphQL");
})
let events = []; 
app.use("/graphql", graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutaion {
            createEvent(eventInput: EventInput!): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutaion
        }
    `),
    rootValue: {
        events: () =>{
            return events;
        },
        createEvent: (args) => {
            // console.log(args.eventInput);
            event = {
            title :args.eventInput.title,
            description : args.eventInput.description,
            price : args.eventInput.price
            }
            events.push(event)
            return event
        }
    },
    graphiql: true
}))


app.listen(3000)