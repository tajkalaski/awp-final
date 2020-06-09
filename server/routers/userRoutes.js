const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Used for hashing passwords!

// I'll mock the users for now because yes
// let users = [
//     {
//         id: 1,
//         username: 'tajsonik',
//         password: 'asdf123'
//     },
//     {
//         id: 2,
//         username: 'tajsoniktest2',
//         password: 'abc456'
//     }
// ];

const User = require('../userDb');

// Creating more test data: We run through all users and add a hash of their password to each.
// In practice, you should hash when passwords are created, not later.
// users.forEach(async user => {
//     const hashedPassword = await new Promise((resolve, reject) => {
//         bcrypt.hash(user.password, 10, function(err, hash) {
//             if (err) reject(err); else resolve(hash);
//         });
//     });

//     user.hash = hashedPassword; // The hash has been made, and is stored on the user object.
//     delete user.password; // Let's remove the clear text password (it shouldn't be there in the first place)
//     console.log(`Hash generated for ${user.username}:`, user); // Logging for debugging purposes
// });

module.exports = (secret) => {

    router.post('/register', (req, res) => {
        const { username, password } = req.body 

        // const user = User.find((user) => user.username === username);
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    console.log(user);
                    return res.status(400).json({ msg: "User already exists" });
                } else {
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password
                });

                
                bcrypt.hash(newUser.password, 10, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
                  

                // newUser.hash = hashedPassword; // The hash has been made, and is stored on the user object.
                // delete newUser.password; // Let's remove the clear text password (it shouldn't be there in the first place)
                console.log(`Hash generated for ${newUser.username}:`, newUser); // Logging for debugging purposes
                }
            })
            .catch(err => console.log(err));

        // res.status(501).json({msg: "something went very wrong"});
    });

    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        console.log(req.body);
    
        if (!username || !password) {
            let msg = "Username or password missing!";
            res.status(401).json({msg: msg});
            return;
        }

        User.findOne({ username }).then(user => {
            if (user) {
                console.log(password);
                console.log(user.password)
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) { // If the password matched
                        const payload = { username };
                        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
                        res.json({
                            msg: `User '${username}' authenticated successfully`,
                            token: token
                        });
                    }
                    else res.status(401).json({msg: "Password mismatch!"})
                });
            } else {
                res.status(404).json({msg: "User not found!"});
            }
        })
    });

    return router;

}