const db = require('../db');

exports.getMenus = async (req, res) => {
    try {
        const roleId = req.user.role_id; // Didapatkan dari token JWT

        // Ambil semua menu dari database
        const menuQuery = await db.query('SELECT id, tittle, url, parent_id FROM menu ORDER BY id ASC');
        const menus = menuQuery.rows;

        // Fungsi ajaib (Recursive) untuk menyusun menu datar menjadi bertingkat (Tree)
        const buildTree = (data, parentId = null) => {
            return data
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    id: item.id,
                    title: item.tittle, // Mengubah ejaan tittle kembali menjadi title untuk JSON Frontend
                    url: item.url,
                    children: buildTree(data, item.id) // Fungsi memanggil dirinya sendiri mencari anak menu
                }));
        };

        // Mulai menyusun menu dari parent_id yang kosong (NULL / tingkat teratas)
        const menuTree = buildTree(menus, null);

        res.json({ 
            message: "Menu berhasil dimuat",
            role_aktif: roleId,
            menus: menuTree 
        });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error });
    }
};