const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require('mongoose');
const graphiQlSchema =  require("./graphql/schema/index");
const graphiQlResolvers =  require("./graphql/resolver/index");
const isAuth = require('./middleware/isAuth');

const app = express();
app.use(bodyParser.json());
app.use(isAuth);

app.get("/", (req, res, next)=>{
    res.send("GraphQL");
});

app.use("/graphql", graphqlHttp({
    schema: graphiQlSchema,
    rootValue: graphiQlResolvers,
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


