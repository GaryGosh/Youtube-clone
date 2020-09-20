const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key')

const { User } = require('./model/user');
const { auth } = require('./middleware/auth');

app.use(express.static('client/build'));

router.use(function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


mongoose.connect(config.mongoURI, 
{useNewUrlParser: true}).then(() => console.log('DB connected'))
                        .catch(err => console.log(err));

/* app.get('/', (req, res) => {
    res.send('hello world')
}); */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({'Hello': 'I am happy to deploy my application'})
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})


app.post('/api/users/register', (req,res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            userData: doc
        })    
    })
})


app.post('/api/users/login', (req, res) => {
    //find email

    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user)
        return res.json({
            loginSuccess: false,
            message: "Login failed! Email not found"
        });
        //compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "Wrong password"
                })
            }
        })

        //generate token
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                });
        });

    });
});

app.get('/api/user/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ''}, (err, doc) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server at ${port}`);
});