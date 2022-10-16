const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            entries: 0,
            joined: new Date(),
        },
    ],
    logic: [
        {
            id: "987",
            hash: "",
            email: "john@gmail.com",
        },
    ],
};

app.get("/", (req, res) => res.json(database.users)); // helper

app.post("/signin", (req, res) => {
    console.log(database.users[0].password, req.body.password);
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("Error logging in");
    }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, (err, hash) => {
        console.log(hash);
    });
    database.users.push({
        id: "12355",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if (!found) res.status(400).json("no such user");
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) res.status(400).json("no such user");
});

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
