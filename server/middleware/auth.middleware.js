const jwt = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' })
        }

        const token = header.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Invalid token' })
    }
}
