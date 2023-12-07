const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];


    try {
        if (token) {

            const decoded = jwt.verify(token, "masai");

            if (decoded) {
                console.log(decoded);
                req.body.userId = decoded.userId;
                req.body.name = decoded.username;
                next();
            } else {
                res.status(401).send({ "msg": "Invalid token" });
            }
        } else {
            res.status(401).send({ "msg": "Please login" });
        }
    } catch (err) {
        res.status(500).send({ "error": err.message });
    }
};

module.exports = {
    auth
};
