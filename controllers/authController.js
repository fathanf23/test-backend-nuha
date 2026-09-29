const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userQuery.rows.length === 0) return res.status(401).json({ message: 'User tidak ditemukan' });
        
        const user = userQuery.rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah' });

        const roleQuery = await db.query(`
            SELECT r.id, r.name 
            FROM roles r 
            JOIN users_roles ur ON r.id = ur.roles_id 
            WHERE ur.user_id = $1
        `, [user.id]);
        
        const roles = roleQuery.rows;

        if (roles.length > 1) {
            return res.json({
                message: 'Silakan pilih role Anda',
                require_role_selection: true,
                user_id: user.id,
                roles: roles
            });
        }

        const token = jwt.sign({ user_id: user.id, role_id: roles[0].id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ message: 'Login sukses', token, role: roles[0].name });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error });
    }
};

exports.selectRole = async (req, res) => {
    const { user_id, role_id } = req.body;
    const token = jwt.sign({ user_id, role_id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ message: 'Role berhasil dipilih', token });
};