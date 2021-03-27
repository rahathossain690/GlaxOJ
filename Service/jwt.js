const jwt = require('jsonwebtoken')


module.exports = {
    sign: (to_sign) => {
        return jwt.sign({
            secret: to_sign
          }, process.env.SESSION_SECRET, { expiresIn: 60 * 60 * 24 * 7 }); // 7 days
    },

    verify: (token) => {
        try {
            var decoded = jwt.verify(token, process.env.SESSION_SECRET);
            return decoded.secret;
        } catch(err) {
            return null;
        }
    }
}