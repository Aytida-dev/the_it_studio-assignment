const { db } = require('./db/connect');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = require('express')();
const bodyParser = require('body-parser');
const User = require('./schema/userSchema');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const { sendMail } = require('./sendmail');


const PORT = 8080;

app.get('/', (req, res) => {
    res.send({
        message: 'Backend system running'
    });
});

app.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();
        res.send(newUser);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

app.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

app.put('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

app.post('/user/sendMail', async (req, res) => {
    try {
        const { users } = req.body
        if (users.length === 0) {
            return res.status(400).send({
                message: "No users found"
            })
        }

        await sendMail(users)

        res.send({
            message: "Mail sent"
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

app.listen(PORT, async () => {
    try {
        console.log("connecting to db....");
        await db;
        console.log("Connected to db!");
    }
    catch (err) {
        console.log(err);
    }

    console.log(`Server started on port ${PORT}`);
})