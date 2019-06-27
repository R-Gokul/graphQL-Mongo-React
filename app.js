const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const {buildSchema } = require("graphql");
const mongoose = require('mongoose');

const Events = require("./models/event");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next)=>{
    res.send("GraphQL");
});

app.use("/graphql", graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
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
            return Events.find().then(events => {
                return events.map(e =>{
                    return  {...e._doc,  _id: e._doc._id.toString()}
                });
            }).catch(err =>{
                throw err
            });
            return event.find();
        },
        createEvent: (args) => {
            // console.log(args.eventInput);
         
            const event =  new Events({
                title: args.eventInput.title,
                title :args.eventInput.title,
                description : args.eventInput.description,
                price : args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            event.save().then(result=>{
                //console.log("R", result);
                return {...result._doc}
            }).catch(err => {
                console.log(err);
                throw err;
            })

            return event
        }
    },
    graphiql: true
}))

mongoose
    .connect("mongodb+srv://gokul:L6Gddwr2q3N8EM9c@cluster0-3qgkc.mongodb.net/event-graph-react?retryWrites=true&w=majority")
    .then(()=>{
        console.log("Mongo Connected");
        app.listen(3000)
    })
    .catch((err)=>{ 
            console.log("Mongo Error");
            console.log(err)
    });


