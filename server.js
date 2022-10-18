const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "root",
        database: "facespot",
    },
});

const app = express();

app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.json(database.users)); // helper

app.post("/signin", (req, res) => {
    db.select("email", "hash")
        .from("login")
        .where("email", "=", req.body.email)
        .then((data) => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db
                    .select("*")
                    .from("users")
                    .where("email", "=", req.body.email)
                    .then((user) => {
                        console.log(user);
                        res.json(user[0]);
                    })
                    .catch((err) => res.status(400).json("unable to get user"));
            } else {
                res.status(400).json("wrong credentials");
            }
        })
        .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    console.log(email);
    const hash = bcrypt.hashSync(password);
    db.transaction((trx) => {
        trx.insert({
            hash,
            email,
        })
            .into("login")
            .returning("email")
            .then((loginEmail) => {
                trx("users")
                    .returning("*")
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date(),
                    })
                    .then((user) => res.json(user[0]))
                    .catch((err) =>
                        res
                            .status(404)
                            .send(`Unable to register : ${err.detail}`)
                    );
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch((err) =>
        res.status(404).send(`Unable to register : ${err.detail}`)
    );
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
            res.status(200).json(entries[0].entries);
        })
        .catch((err) =>
            res.status(400).json("Unable to fetch user with given id")
        );
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where({ id })
        .then((user) => {
            if (user.length > 0) {
                res.json(user[0]);
            } else {
                res.status(400).json("user not found");
            }
        })
        .catch((err) => res.status(400).json("Error getting user"));
});

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
