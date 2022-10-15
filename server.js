const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());

const PORT = process.env.PORT || 3001;

const database = {
    users:[
        {
            id:'123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        }, 
        {
            id:'124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => res.status(200).send("ome")) // helper 

app.post('/signin',(req, res) => {
    console.log(database.users[0].password , req.body.password);
    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password){
        res.json('success');
    } else {
        res.status(400).json('Error logging in');
    }
})



app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));