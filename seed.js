const bcrypt = require('bcryptjs');
const db = require('./db');

async function seedData() {
    try {
        console.log('Memulai proses seeding data...');

        // 1. Bersihkan tabel
        await db.query('TRUNCATE TABLE roles_menu, menu, users_roles, roles, users RESTART IDENTITY CASCADE');

        // 2. Buat User & Hash Password
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userRes = await db.query(
            'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING id',
            ['fathan', hashedPassword, 'Mochammad Fathan Fadillah']
        );
        const userId = userRes.rows[0].id;

        // 3. Buat Role (Administrator dan Staff Ops)
        const roleAdmin = await db.query("INSERT INTO roles (name) VALUES ('Administrator') RETURNING id");
        const roleStaff = await db.query("INSERT INTO roles (name) VALUES ('Staff Ops') RETURNING id");
        const adminId = roleAdmin.rows[0].id;
        const staffId = roleStaff.rows[0].id;

        // 4. Berikan Jabatan Ganda ke User (Anda akan memiliki 2 role)
        await db.query('INSERT INTO users_roles (user_id, roles_id) VALUES ($1, $2), ($1, $3)', [userId, adminId, staffId]);

        // 5. Buat Hierarki Menu (Menggunakan ejaan 'tittle')
        // 5. Buat Hierarki Menu (Mengikuti Soal Ujian)
        // MENU 1
        const m1 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1', '/m1', NULL) RETURNING id");
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.1', '/m1/1', $1)", [m1.rows[0].id]);
        const m1_2 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.2', '/m1/2', $1) RETURNING id", [m1.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.2.1', '/m1/2/1', $1)", [m1_2.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.2.2', '/m1/2/2', $1)", [m1_2.rows[0].id]);
        const m1_3 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.3', '/m1/3', $1) RETURNING id", [m1.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 1.3.1', '/m1/3/1', $1)", [m1_3.rows[0].id]);

        // MENU 2
        const m2 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2', '/m2', NULL) RETURNING id");
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.1', '/m2/1', $1)", [m2.rows[0].id]);
        const m2_2 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2', '/m2/2', $1) RETURNING id", [m2.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2.1', '/m2/2/1', $1)", [m2_2.rows[0].id]);
        
        const m2_2_2 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2.2', '/m2/2/2', $1) RETURNING id", [m2_2.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2.2.1', '/m2/2/2/1', $1)", [m2_2_2.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2.2.2', '/m2/2/2/2', $1)", [m2_2_2.rows[0].id]);
        
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.2.3', '/m2/2/3', $1)", [m2_2.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 2.3', '/m2/3', $1)", [m2.rows[0].id]);

        // MENU 3
        const m3 = await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 3', '/m3', NULL) RETURNING id");
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 3.1', '/m3/1', $1)", [m3.rows[0].id]);
        await db.query("INSERT INTO menu (tittle, url, parent_id) VALUES ('Menu 3.2', '/m3/2', $1)", [m3.rows[0].id]);

        // 6. Beri Akses SEMUA Menu ke Administrator agar bisa didemo-kan
        await db.query('INSERT INTO roles_menu (role_id, menu_id) VALUES ($1, $2), ($1, $3), ($1, $4)', [adminId, m1.rows[0].id, m2.rows[0].id, m3.rows[0].id]);

        // 6. Beri Akses Menu ke Administrator
        await db.query('INSERT INTO roles_menu (role_id, menu_id) VALUES ($1, $2)', [adminId, m1.rows[0].id]);

        console.log('Seeding data sukses!');
        process.exit();
    } catch (error) {
        console.error('Error saat seeding:', error);
        process.exit(1);
    }
}

seedData();