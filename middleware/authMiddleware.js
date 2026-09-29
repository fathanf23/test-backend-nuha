const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Ambil token dari header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });

    // Format token biasanya "Bearer eyJhb..."
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Format token salah' });

    try {
        // Verifikasi token menggunakan secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data (user_id & role_id) ke dalam request
        next(); // Lanjut ke proses berikutnya
    } catch (error) {
        res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    }
};