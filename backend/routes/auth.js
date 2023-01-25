const express = require('express');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const { findOne } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SIGNETURE = "shifa";

// createuser api
router.post('/createuser', [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry, the user with same email alresdy exist!" })
        }
        const salt = await bcrypt.genSaltSync(10);
        const secretPassword = await bcrypt.hashSync(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secretPassword,
        })
        // const data= user.id
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, SIGNETURE);
        return res.json({ authtoken })
        // }).then(user => res.json(user))
        // .catch(err=> res.json({error:"Please enter proper values!!"}))
        res.json({ "ok": "user created!" })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error!")
    }

})

//Authenticate User api
router.post('/login', [
    body("email", "Please enter correct credentials").isEmail(),
    body("password","Please enter correct credentials").isLength({ min: 5 }).exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({error:"Please try again!" })
        }
        const passwordCompare=bcrypt.compare(password,user.password);
        if(!passwordCompare)
        return res.status(400).json({error:"Please try again!" })

        const payload = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(payload, SIGNETURE);
        return res.json({email},{ authtoken })
        // }).then(user => res.json(user))
        // .catch(err=> res.json({error:"Please enter proper values!!"}))
        res.json({ "ok": "user created!" })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error!")
    }

})
module.exports = router;

