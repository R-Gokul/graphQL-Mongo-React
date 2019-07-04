const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const {buildSchema } = require("graphql");
const mongoose = require('mongoose');
const bycript = require("bcryptjs");

const Events = require("./models/event");
const User  = require("./models/user");

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

        type User {
            _id: ID
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User]
        }
        type RootMutaion {
            createEvent(eventInput: EventInput!): Event
            createUser(userInput: UserInput!): User
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
        },
        createUser: (args) =>{
            console.log(args);
            return bycript.hash(args.userInput.password, 12).then(hash=>{
                return user = new User({
                    email: args.userInput.email,
                    password: hash
                });
            }).then(user =>{
                return user.save().then(result => {
                   // console.log("R", result);
                    return {...result._doc,password: "******", id:result._doc._id.toString()}
                })
            }).catch(err => {
                console.log(err);
                throw err;
            });
            
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


