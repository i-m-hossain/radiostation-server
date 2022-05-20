//external imports
const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("dotenv").config();
const cors = require("cors");

//internal imports
require("./lib/passport.js");
const port = process.env.PORT || 7000;
const isLoggedIn = require("./middleware/isLoggedIn");
const homeRouter = require("./router/homeRouter");
const loginRouter = require("./router/loginRouter");
const registerRouter = require("./router/registerRouter");
const successRouter = require("./router/successRouter");
const failedRouter = require("./router/failedRouter");
const logoutRouter = require("./router/logoutRouter");
const callbackRouter = require("./router/callbackRouter");
const { MongoClient, ObjectId } = require("mongodb");

//creating app instance
const app = express();
app.use(express.json());

//mongodb init
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krune.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("radioStations");
        const stations = database.collection("stations");

        //get all stations
        app.get("/stations", async (req, res) => {
            const query = {};
            const cursor = stations.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });
        //get single station
        app.get("/stations/:id", async (req, res) => {
            const stationId = req.params.id;
            const query = { _id: ObjectId(stationId) };
            const result = await stations.findOne(query);
            res.status(200).json(result);
        });

        //add station
        app.post("/stations", isLoggedIn, async (req, res) => {
            const { name, frequency } = req.body;
            const query = { name, frequency };
            const result = await stations.insertOne(query);
            console.log(result);
            res.status(200).json({
                message: "Station was added successfully",
            });
        });
        //update station
        app.put("/stations/:id", isLoggedIn, async (req, res) => {
            const stationId = req.params.id;
            const document = req.body;
            const filter = { _id: ObjectId(stationId) };
            const updateDoc = {
                $set: {
                    name: document.name,
                    image: document.frequency,
                },
            };
            const result = await stations.updateOne(filter, updateDoc);
            res.json(result);
        });
        //delete station
        app.delete("/stations/:id", isLoggedIn, async (req, res) => {
            const stationId = req.params.id;
            const query = { _id: ObjectId(stationId) };
            const result = await stations.deleteOne(query);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

//login with passport
app.use(
    cookieSession({
        name: "google-auth-session",
        keys: ["key1", "key2"],
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

//routes
app.use("/", homeRouter);
app.use("/failed", failedRouter);
app.use("/success", successRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/google/callback", callbackRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
