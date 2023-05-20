const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/Users/UserModel");
const dotenv = require("dotenv");
dotenv.config();


const authCtrl = {

    register: async (req, res) => {
        try {
            const { email, fullname, password } = req.body;
            if (!fullname || !password || !email) {
                return res
                    .status(400)
                    .json({ msg: "Please enter all credentials required" });
            }

            if (password.length < 6)
                return res
                    .status(400)
                    .json({ msg: "Password must be at least 6 characters." });

            const isemailExist = await User.findOne({ email });

            if (isemailExist) {
                return res.status(401).json({
                    msg: "email number already exist please try with different email",
                });
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const saveData = await User.create({ fullname, password: passwordHash, email });

            res.status(201).json({ msg: "User registered successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).send("Not a registered user")
            }
            console.log(req.body.password, user.password)
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (!isMatch)
                return res.status(400).json({ msg: "Password is incorrect." });

            const token = jwt.sign({
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }, process.env.JWT_SECRET)

            res.send({ user, token })
        } catch (e) {
            res.status(500).send(e)
        }
    },

    //To verify the token stored in localStorage
    isTokenValid: async (req, res) => {
        try {
            const token = req.header("Authorization")
            if (!token) {
                return res.json(false);
            }
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if (!verified) {
                return res.json(false);
            }
            const user = await User.findById(verified.id);
            if (!user) {
                return res.json(false);
            }
            return res.json(true);
        } catch (err) {
            res.json(false); 
        }
    }
}
module.exports = authCtrl;