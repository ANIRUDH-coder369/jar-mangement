const User = require('../model/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, role: user.role }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}


