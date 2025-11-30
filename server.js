
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
// Use the PORT environment variable provided by the host (Render), or default to 3001
const PORT = process.env.PORT || 3001;

// --- DATABASE ADAPTER (SQLite + PostgreSQL Support) ---
class DatabaseAdapter {
    constructor() {
        this.type = process.env.DATABASE_URL ? 'postgres' : 'sqlite';
        this.client = null;
        
        console.log("----------------------------------------");
        console.log(`[System] Initializing Database Mode: ${this.type.toUpperCase()}`);
        console.log(`[System] Env DATABASE_URL Found: ${!!process.env.DATABASE_URL}`);
        console.log("----------------------------------------");

        if (this.type === 'postgres') {
            console.log("Initializing PostgreSQL Connection (Supabase) via postgres.js...");
            try {
                const postgres = require('postgres');
                this.client = postgres(process.env.DATABASE_URL.trim(), {
                    ssl: { rejectUnauthorized: false }, // Fix for Supabase/Render SSL handshake issues
                    max: 10, // Connection pool size
                    idle_timeout: 20, // Idle connection timeout in seconds
                    connect_timeout: 10, // Connect timeout in seconds
                });
                
                // Test connection
                this.client`SELECT 1`.then(() => {
                    console.log("SUCCESS: Connected to PostgreSQL DB.");
                }).catch(err => {
                    console.error("CRITICAL: Failed to connect to PostgreSQL:", err.message);
                });

            } catch (e) {
                console.error("Missing 'postgres' module. Install it with `npm install postgres`.");
                process.exit(1);
            }
        } else {
            console.log("Initializing SQLite Connection...");
            const sqlite3 = require('sqlite3').verbose();
            this.client = new sqlite3.Database('./database.sqlite');
        }
    }

    _prepareSql(sql) {
        if (this.type === 'postgres') {
            let i = 1;
            return sql.replace(/\?/g, () => `$${i++}`);
        }
        return sql;
    }

    run(sql, params = [], callback) {
        if (this.type === 'postgres') {
            // postgres.js uses `unsafe` for raw SQL strings with parameters
            this.client.unsafe(this._prepareSql(sql), params)
                .then(() => { if (callback) callback(null); })
                .catch((err) => { if (callback) callback(err); });
        } else {
            this.client.run(sql, params, function(err) {
                if (callback) callback(err);
            });
        }
    }

    all(sql, params = [], callback) {
        if (this.type === 'postgres') {
            this.client.unsafe(this._prepareSql(sql), params)
                .then((rows) => { if (callback) callback(null, rows); })
                .catch((err) => { if (callback) callback(err, []); });
        } else {
            this.client.all(sql, params, (err, rows) => {
                if (callback) callback(err, rows);
            });
        }
    }

    get(sql, params = [], callback) {
        if (this.type === 'postgres') {
            this.client.unsafe(this._prepareSql(sql), params)
                .then((rows) => { if (callback) callback(null, rows.length > 0 ? rows[0] : null); })
                .catch((err) => { if (callback) callback(err, null); });
        } else {
            this.client.get(sql, params, (err, row) => {
                if (callback) callback(err, row);
            });
        }
    }

    async initSchema() {
        const schema = [
            `CREATE TABLE IF NOT EXISTS settings (section TEXT PRIMARY KEY, data TEXT)`,
            `CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, data TEXT)`,
            `CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, technicianId TEXT, status TEXT, data TEXT)`,
            `CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, status TEXT, data TEXT)`,
            `CREATE TABLE IF NOT EXISTS locations (id TEXT PRIMARY KEY, data TEXT)`
        ];

        console.log("[System] Verifying Database Schema...");
        
        // Execute sequentially to prevent race conditions on connection pool
        for (const query of schema) {
            await new Promise((resolve) => {
                this.run(query, [], (err) => {
                    if (err) console.error("Schema Error:", err);
                    resolve();
                });
            });
        }
        console.log("[System] Schema Verified.");
    }
}

const db = new DatabaseAdapter();

// --- MIDDLEWARE ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

function checkAndSeed(tableName, dataItems) {
    db.get(`SELECT count(*) as count FROM ${tableName}`, [], (err, row) => {
        // If error (e.g. table doesn't exist yet because schema init is async), just skip for now
        if (err) return; 

        const count = row ? (row.count || row.COUNT) : 0;
        if (count == 0) {
            console.log(`[Safe Seed] Table '${tableName}' is empty. Seeding defaults...`);
            if (tableName === 'settings') {
                 dataItems.forEach(item => {
                     db.run("INSERT INTO settings (section, data) VALUES (?, ?)", [item.key, JSON.stringify(item.value)]);
                 });
            } else if (tableName === 'jobs') {
                 dataItems.forEach(item => {
                     db.run("INSERT INTO jobs (id, technicianId, status, data) VALUES (?, ?, ?, ?)", [item.id, item.technicianId, item.status, JSON.stringify(item)]);
                 });
            } else {
                 // employees, locations (id, data)
                 dataItems.forEach(item => {
                     db.run(`INSERT INTO ${tableName} (id, data) VALUES (?, ?)`, [item.id, JSON.stringify(item)]);
                 });
            }
        } else {
            console.log(`[Safe Seed] Table '${tableName}' has data. Preserving existing data.`);
        }
    });
}

// --- CONFIGURATION ---
const GMAIL_USER = process.env.GMAIL_USER || 'your-email@gmail.com'; 
const GMAIL_PASS = process.env.GMAIL_PASS || 'your-app-password';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS }
});

app.post('/api/send-email', (req, res) => {
    const { to, subject, text, html } = req.body;
    transporter.sendMail({ from: GMAIL_USER, to, subject, text, html }, (error, info) => {
        if (error) return res.status(500).json({ error: error.toString() });
        res.json({ success: true, message: 'Email sent: ' + info.response });
    });
});

// --- API ENDPOINTS ---

app.get('/api/init', (req, res) => {
    const responseData = {};
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if(err) {
            console.error("API Init Error:", err);
            return res.status(500).json({error: err.message});
        }
        if(rows) rows.forEach(r => responseData[r.section] = JSON.parse(r.data));
        
        db.all("SELECT * FROM employees", [], (err, emps) => {
            responseData.employees = emps ? emps.map(e => JSON.parse(e.data)) : [];
            db.all("SELECT * FROM jobs", [], (err, jobs) => {
                responseData.jobCards = jobs ? jobs.map(j => JSON.parse(j.data)) : [];
                db.all("SELECT * FROM bookings", [], (err, books) => {
                    responseData.bookings = books ? books.map(b => JSON.parse(b.data)) : [];
                    db.all("SELECT * FROM locations", [], (err, locs) => {
                        responseData.locations = locs ? locs.map(l => JSON.parse(l.data)) : [];
                        
                        // INCLUDE DB META INFO
                        responseData.meta = {
                            databaseType: db.type,
                            isRender: !!process.env.RENDER
                        };
                        
                        res.json(responseData);
                    });
                });
            });
        });
    });
});

app.post('/api/settings/:section', (req, res) => {
    const { section } = req.params;
    const data = JSON.stringify(req.body);
    db.run(`INSERT INTO settings (section, data) VALUES (?, ?) ON CONFLICT(section) DO UPDATE SET data = ?`, 
        [section, data, data], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});

app.post('/api/employees', (req, res) => {
    const emp = req.body;
    const data = JSON.stringify(emp);
    db.run(`INSERT INTO employees (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = ?`, 
        [emp.id, data, data], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});
app.delete('/api/employees/:id', (req, res) => {
    db.run(`DELETE FROM employees WHERE id = ?`, [req.params.id], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});

app.post('/api/jobs', (req, res) => {
    const job = req.body;
    const data = JSON.stringify(job);
    db.run(`INSERT INTO jobs (id, technicianId, status, data) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET technicianId = ?, status = ?, data = ?`, 
        [job.id, job.technicianId, job.status, data, job.technicianId, job.status, data], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});
app.delete('/api/jobs/:id', (req, res) => {
    db.run(`DELETE FROM jobs WHERE id = ?`, [req.params.id], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});

app.post('/api/bookings', (req, res) => {
    const booking = req.body;
    const data = JSON.stringify(booking);
    db.run(`INSERT INTO bookings (id, status, data) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET status = ?, data = ?`, 
        [booking.id, booking.status, data, booking.status, data], 
        (err) => { if(err) res.status(500).send(err.message); else res.json({success: true}); }
    );
});

app.post('/api/locations', (req, res) => {
    const locs = req.body; 
    db.run("DELETE FROM locations", [], (err) => {
        if (err) return res.status(500).send(err.message);
        let completed = 0;
        if (locs.length === 0) return res.json({success: true});
        locs.forEach(l => {
            db.run("INSERT INTO locations (id, data) VALUES (?, ?)", [l.id, JSON.stringify(l)], (err) => {
                completed++;
                if (completed === locs.length) res.json({success: true});
            });
        });
    });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// --- ADMIN TOOLS ---

// RESET (Admin Button Click Only)
app.post('/api/admin/seed', (req, res) => {
    // This is the ONLY place where data is wiped.
    const tables = ['settings', 'employees', 'jobs', 'bookings', 'locations'];
    let completed = 0;
    tables.forEach(table => {
        db.run(`DELETE FROM ${table}`, [], () => {
            completed++;
            if (completed === tables.length) {
                // Manually call seed logic again after wipe
                checkAndSeed('settings', getDefaultSettingsAsArray());
                checkAndSeed('employees', getDefaultEmployees());
                checkAndSeed('locations', getDefaultLocations());
                checkAndSeed('jobs', getDefaultJobs());
                res.json({ success: true, message: "Database reset and seeded with mock data." });
            }
        });
    });
});

// NUKE (Delete All)
app.post('/api/admin/nuke', (req, res) => {
    const tables = ['settings', 'employees', 'jobs', 'bookings', 'locations'];
    let completed = 0;
    tables.forEach(table => {
        db.run(`DELETE FROM ${table}`, [], () => {
            completed++;
            if (completed === tables.length) {
                const adminEmp = getDefaultEmployees()[0]; // Restore at least the admin
                db.run("INSERT INTO employees (id, data) VALUES (?, ?)", [adminEmp.id, JSON.stringify(adminEmp)]);
                res.json({ success: true, message: "Database completely cleared (Admin restored)." });
            }
        });
    });
});

app.get('/api/admin/backup', (req, res) => {
    const backupData = { timestamp: new Date().toISOString() };
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if(rows) rows.forEach(r => backupData[r.section] = JSON.parse(r.data));
        db.all("SELECT * FROM employees", [], (err, emps) => {
            backupData.employees = emps ? emps.map(e => JSON.parse(e.data)) : [];
            db.all("SELECT * FROM jobs", [], (err, jobs) => {
                backupData.jobCards = jobs ? jobs.map(j => JSON.parse(j.data)) : [];
                db.all("SELECT * FROM bookings", [], (err, books) => {
                    backupData.bookings = books ? books.map(b => JSON.parse(b.data)) : [];
                    db.all("SELECT * FROM locations", [], (err, locs) => {
                        backupData.locations = locs ? locs.map(l => JSON.parse(l.data)) : [];
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Content-Disposition', `attachment; filename=pro_pest_backup_${Date.now()}.json`);
                        res.send(JSON.stringify(backupData, null, 2));
                    });
                });
            });
        });
    });
});

app.post('/api/admin/restore', upload.single('backupFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No backup file uploaded.');
    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading backup file');
        try {
            const backup = JSON.parse(data);
            const tables = ['settings', 'employees', 'jobs', 'bookings', 'locations'];
            let cleared = 0;
            tables.forEach(table => {
                db.run(`DELETE FROM ${table}`, [], () => {
                    cleared++;
                    if (cleared === tables.length) {
                        const sections = ['company', 'hero', 'about', 'services', 'whyChooseUs', 'process', 'serviceArea', 'safety', 'bookCTA', 'bookingModal', 'contact', 'creatorWidget', 'faqs', 'testimonials', 'bankDetails', 'seo'];
                        sections.forEach(sec => {
                            if (backup[sec]) db.run("INSERT INTO settings (section, data) VALUES (?, ?)", [sec, JSON.stringify(backup[sec])]);
                        });
                        if (backup.employees) backup.employees.forEach(i => db.run("INSERT INTO employees (id, data) VALUES (?, ?)", [i.id, JSON.stringify(i)]));
                        if (backup.jobCards) backup.jobCards.forEach(i => db.run("INSERT INTO jobs (id, technicianId, status, data) VALUES (?, ?, ?, ?)", [i.id, i.technicianId, i.status, JSON.stringify(i)]));
                        if (backup.bookings) backup.bookings.forEach(i => db.run("INSERT INTO bookings (id, status, data) VALUES (?, ?, ?)", [i.id, i.status, JSON.stringify(i)]));
                        if (backup.locations) backup.locations.forEach(i => db.run("INSERT INTO locations (id, data) VALUES (?, ?)", [i.id, JSON.stringify(i)]));
                        res.json({ success: true, message: 'System restored successfully.' });
                        fs.unlink(req.file.path, () => {});
                    }
                });
            });
        } catch (e) {
            res.status(500).send('Invalid backup file format.');
        }
    });
});

// --- DATA HELPERS ---

function getDefaultSettingsAsArray() {
    return Object.entries(getDefaultSettings()).map(([key, value]) => ({ key, value }));
}

function getDefaultEmployees() {
    return [
        {
            id: 'emp-001',
            fullName: 'Ruaan Van Wyk',
            email: 'ruaan@propesthunters.co.za', 
            pin: '2024',            
            loginName: 'ruaan',
            jobTitle: 'Owner / Master Technician',
            permissions: { isAdmin: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true },
            idNumber: '8501015000080',
            tel: '082 555 1234',
            startDate: '2006-05-01',
            doctorsNumbers: [], documents: [], profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 'emp-002',
            fullName: 'Sarah Johnson',
            email: 'admin@test.com',
            pin: '1234',            
            loginName: 'sarah',
            jobTitle: 'Office Manager',
            permissions: { isAdmin: true, canDoAssessment: false, canCreateQuotes: true, canExecuteJob: false, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true },
            idNumber: '9002020000080',
            tel: '013 752 4899',
            startDate: '2015-03-15',
            doctorsNumbers: [], documents: [], profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
        }
    ];
}

function getDefaultLocations() {
    return [
      { id: 'loc-1', name: "Nelspruit HQ", address: "Unit 4, Rapid Falls Industrial Park", phone: "013 752 4899", email: "nelspruit@propesthunters.co.za", isHeadOffice: true, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
      { id: 'loc-2', name: "White River Branch", address: "Shop 12, Casterbridge Lifestyle Centre", phone: "013 750 1234", email: "whiteriver@propesthunters.co.za", isHeadOffice: false, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800" }
    ];
}

function getDefaultJobs() {
    return [
        { 
            id: 'job-001', refNumber: 'JOB-24010', clientName: 'Mr. J. Smith', 
            clientAddressDetails: { street: '12 Impala Street', suburb: 'West Acres', city: 'Nelspruit', province: 'MP', postalCode: '1200' },
            contactNumber: '082 111 2222', email: 'john@gmail.com', propertyType: 'Residential', assessmentDate: new Date().toISOString(), technicianId: 'emp-001', selectedServices: ['srv-02'], checkpoints: [], isFirstTimeService: true, treatmentRecommendation: 'Cockroach flush needed in kitchen.', quote: { lineItems: [], subtotal: 950, vatRate: 0.15, total: 1092.50, notes: '' }, status: 'Job_Scheduled', history: [] 
        }
    ];
}

function getDefaultSettings() {
    return {
        company: {
            name: "Pro Pest Hunters",
            regNumber: "2015/123456/07",
            vatNumber: "4010123456",
            phone: "+27 13 752 4899",
            email: "info@propesthunters.co.za",
            address: "Unit 4, Rapid Falls Industrial Park, Riverside, Nelspruit, 1200",
            logo: "https://i.ibb.co/zHBzVwRV/image.png",
            yearsExperience: 18,
            socials: { 
                facebook: "https://facebook.com/propesthunters", 
                instagram: "https://instagram.com/propesthunters_lowveld", 
                linkedin: "https://linkedin.com/company/pro-pest-hunters" 
            },
            hours: { weekdays: "07:30 - 17:00", saturday: "08:00 - 13:00", sunday: "Emergency Only" }
        },
        hero: {
            headline: "The Lowveld’s #1 Defense Against Pests.",
            subheadline: "Safe for Families. Lethal for Pests. Guaranteed Results.",
            buttonText: "Get Your Free Quote",
            overlayOpacity: 60,
            mediaType: 'video',
            mediaImages: [], 
            mediaVideo: "https://cdn.pixabay.com/video/2020/05/25/40133-424930159_large.mp4",
            carouselInterval: 3000
        },
        about: {
            title: "Protecting Lowveld Homes Since 2006",
            text: "Born in the heart of Mpumalanga, Pro Pest Hunters began with a single bakkie and a mission to provide ethical, environmentally responsible pest control. Today, we are the region's most trusted partner for residential, commercial, and agricultural pest management. We understand the unique challenges of the Lowveld climate—from termite seasons to humidity-loving roaches—and tailor our solutions accordingly.",
            missionTitle: "Our Mission",
            missionText: "To safeguard health and property through advanced Integrated Pest Management (IPM) techniques that prioritize safety and sustainability.",
            ownerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800", 
            items: [
                { text: "Owner Managed", iconName: "Users" }, 
                { text: "Eco Friendly", iconName: "Leaf" },
                { text: "SABS Approved", iconName: "CheckCircle2" },
                { text: "HACCP Compliant", iconName: "Shield" }
            ]
        },
        services: [
            { 
                id: 'srv-01', 
                title: 'Termite Defense', 
                description: 'Complete eradication of subterranean and harvester termites.', 
                fullDescription: 'Termites cause billions in damage annually. Our localized drill-and-inject treatment creates a chemical barrier around your foundation, preventing entry for up to 5 years. We also treat lawns for harvester termites that destroy gardens.',
                details: ['5 Year Written Guarantee', 'Foundation Drilling', 'Lawn Treatment', 'Pre-Construction Soil Poisoning'], 
                iconName: 'Bug', 
                visible: true, 
                featured: true,
                price: 'From R1,800',
                image: "https://images.unsplash.com/photo-1627931818298-251f0b093375?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-02', 
                title: 'Cockroach Flush', 
                description: 'Eliminate German and American roaches from kitchens and drains.', 
                fullDescription: 'We use a 3-stage attack: A flushing agent to drive them out, a residual spray for long-term killing, and pheromone gels to target the nests. Safe for food preparation areas when protocols are followed.',
                details: ['Odorless Gel Options', 'Drain Fogging', 'Pet Safe', '3-Month Warranty'], 
                iconName: 'Zap', 
                visible: true, 
                featured: true,
                price: 'From R950',
                image: "https://images.unsplash.com/photo-1627373809657-37b58580252e?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-03', 
                title: 'Rodent Control', 
                description: 'Rat and mouse baiting stations for homes and warehouses.', 
                fullDescription: 'Rodents carry disease and destroy wiring. We deploy tamper-proof bait stations containing single-feed wax blocks. These are secured so pets cannot access them. We also offer advice on rodent-proofing your building.',
                details: ['Tamper-Proof Boxes', 'External Perimeter', 'Roof Void Treatment', 'Monitoring Service'], 
                iconName: 'Rat', 
                visible: true, 
                featured: false,
                price: 'From R1,200',
                image: "https://plus.unsplash.com/premium_photo-1664303387813-91e84db95c64?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-04', 
                title: 'Ant Management', 
                description: 'Stop sugar ants and garden ants from invading your home.', 
                fullDescription: 'Ants are persistent. Our perimeter spray creates a "no-go" zone around your house. For internal nests, we use undetectable bait granules that workers carry back to the queen, destroying the colony from within.',
                details: ['Internal & External', 'Lawn Spraying', 'Queen Elimination', 'Seasonal Treatment'], 
                iconName: 'Flower2', 
                visible: true, 
                featured: false,
                price: 'From R850',
                image: "https://images.unsplash.com/photo-1596566678604-585805400569?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-05', 
                title: 'Bed Bug Heat Treatment', 
                description: 'The only sure way to kill bed bugs and their eggs.', 
                fullDescription: 'Chemicals often fail against modern bed bugs. We wash linens and treat mattresses and base sets with specialized chemical applications and steam heat where applicable to ensure 100% eradication.',
                details: ['Mattress Treatment', 'Base Set Injection', 'Egg Destruction', 'Discreet Service'], 
                iconName: 'BedDouble', 
                visible: true, 
                featured: false,
                price: 'Quote on Inspection',
                image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-06', 
                title: 'Commercial Hygiene', 
                description: 'HACCP compliant pest control for restaurants and hotels.', 
                fullDescription: 'We provide the files, bait stations, fly units, and documentation required for health inspections. Monthly servicing ensures you never have a pest breakout that affects your reputation.',
                details: ['Health Inspector Files', 'Monthly Contracts', 'Fly Control Units', 'Audit Ready'], 
                iconName: 'Building', 
                visible: true, 
                featured: false,
                price: 'Contract Based',
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800"
            },
             { 
                id: 'srv-07', 
                title: 'Mosquito Fogging', 
                description: 'Reduce mosquito populations for outdoor events or wet seasons.', 
                fullDescription: 'Ideal for weddings, lodges, or homes near water. We use thermal fogging to knock down adult mosquitoes and larvicides in standing water to prevent breeding.',
                details: ['Thermal Fogging', 'Larvicide Treatment', 'Event Preparation', 'Malaria Prevention'], 
                iconName: 'CloudRain', 
                visible: true, 
                featured: false,
                price: 'From R1,500',
                image: "https://images.unsplash.com/photo-1563384358-15c0d2979262?auto=format&fit=crop&q=80&w=800"
            },
            { 
                id: 'srv-08', 
                title: 'Wood Borer Beetle', 
                description: 'Treatment for furniture and structural timber.', 
                fullDescription: 'Beetles can destroy roof trusses and antique furniture. We offer injection treatments and surface spraying to penetrate wood and kill larvae.',
                details: ['Certificate of Clearance', 'Roof Truss Treatment', 'Furniture Injection', 'Long Term Protection'], 
                iconName: 'Trees', 
                visible: true, 
                featured: false,
                price: 'Quote on Inspection',
                image: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=800"
            }
        ],
        whyChooseUs: { 
            title: "Why Choose Us", 
            subtitle: "The Pro Pest Difference", 
            items: [
                { title: "Registered Pros", text: "All staff are registered with the Dept of Agriculture (P-Registration).", iconName: "Award" },
                { title: "Rapid Response", text: "Same-day service for emergencies in Nelspruit & White River.", iconName: "Clock" },
                { title: "Iron-Clad Guarantee", text: "If the pests come back within the warranty period, so do we. Free.", iconName: "Shield" },
                { title: "Pet & Child Safe", text: "We use advanced gels and baits that minimize exposure to loved ones.", iconName: "HeartHandshake" },
                { title: "Competitive Pricing", text: "Top-tier service without the corporate price tag.", iconName: "DollarSign" },
                { title: "Local Knowledge", text: "We know the Lowveld bugs better than anyone.", iconName: "MapPin" }
            ] 
        },
        process: { 
            title: "Our Process", 
            subtitle: "Simple, Effective, Safe", 
            steps: [
                { step: 1, title: "Inspection", description: "We visit your property to identify the pest and the root cause.", iconName: "Search" },
                { step: 2, title: "Custom Plan", description: "We select the safest, most effective treatment for your specific situation.", iconName: "FileText" },
                { step: 3, title: "Treatment", description: "Our qualified techs apply the solution with surgical precision.", iconName: "Zap" },
                { step: 4, title: "Prevention", description: "We seal entry points and advise on how to stop them returning.", iconName: "Shield" }
            ] 
        },
        serviceArea: { 
            title: "Areas We Serve", 
            description: "Proudly covering the entire Lowveld and Escarpment region.", 
            towns: ["Nelspruit", "White River", "Barberton", "Hazyview", "Malelane", "Komatipoort", "Sabie", "Lydenburg"], 
            mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mpumalanga_Municipalities_2016_Ehlanzeni.svg/800px-Mpumalanga_Municipalities_2016_Ehlanzeni.svg.png" 
        },
        safety: { 
            title: "Safety Compliance", 
            description: "We adhere to the strictest safety standards. All chemicals are SABS approved and applied according to Act 36 of 1947.", 
            badge1: "Pet Safe", 
            badge2: "Eco Friendly", 
            badge3: "Registered", 
            certificates: [
                "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/SABS_logo.svg/1200px-SABS_logo.svg.png",
                "https://sapca.org.za/wp-content/uploads/2020/02/sapca-logo.png"
            ] 
        },
        bookCTA: { title: "Ready to be Pest Free?", subtitle: "Book a consultation today and get 10% off your first treatment.", buttonText: "Book Now", bgImage: undefined },
        bookingModal: { 
            headerTitle: "Book a Service", 
            headerSubtitle: "Select a service and time that suits you. We will confirm via WhatsApp.", 
            stepServiceTitle: "Select Service", 
            stepDateTitle: "Choose Date", 
            stepDetailsTitle: "Your Details", 
            successTitle: "Booking Received!", 
            successMessage: "We will confirm shortly.", 
            termsText: "T&Cs apply: Cancellation within 2 hours may incur a fee." 
        },
        creatorWidget: {
            logo: "https://i.ibb.co/TDC9Xn1N/JSTYP-me-Logo.png",
            whatsappIcon: "https://i.ibb.co/Z1YHvjgT/image-removebg-preview-1.png",
            emailIcon: "https://i.ibb.co/r2HkbjLj/image-removebg-preview-2.png",
            background: "https://i.ibb.co/dsh2c2hp/unnamed.jpg",
            slogan: "Jason's Solution To Your Problems, Yes me!",
            ctaText: "Need a Website, Mobile App or custom tool? Get in touch."
        },
        contact: { title: "Contact Us", subtitle: "We are waiting for your call", formTitle: "Send a Message", mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.6789!2d30.9694!3d-25.4753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI4JzMxLjEiUyAzMMKwNTgnMTAuMCJF!5e0!3m2!1sen!2sza!4v1600000000000!5m2!1sen!2sza" },
        faqs: [
             { id: 'faq-1', question: "Is the treatment safe for my pets?", answer: "Yes. For most treatments (gel, bait stations), pets can remain inside. For spray treatments, we recommend keeping pets outside for 2 hours until the surfaces are dry. We use pet-friendly formulations." },
             { id: 'faq-2', question: "Do I need to empty my kitchen cupboards?", answer: "Generally, no. We use precision gel baits that are applied to hinges and corners. If we need to flush a heavy infestation, we will advise you beforehand to clear specific shelves." },
             { id: 'faq-3', question: "How long does a termite treatment last?", answer: "Our drill-and-inject termite treatments come with a 5-year guarantee. We use high-quality termiticides that bond with the soil." },
             { id: 'faq-4', question: "Do you offer warranties?", answer: "Yes. General pest control usually carries a 3-month warranty. If pests return within that time, we re-treat the affected area for free." },
             { id: 'faq-5', question: "Are you registered?", answer: "Absolutely. All our technicians are registered with the Department of Agriculture and carry their P-Registration cards." },
             { id: 'faq-6', question: "What areas do you cover?", answer: "We cover Nelspruit, White River, Barberton, Hazyview, Malelane, and surrounding farms/lodges." },
             { id: 'faq-7', question: "Do you do snake removal?", answer: "Yes, we have certified snake handlers on the team for emergency removals." },
             { id: 'faq-8', question: "How much does it cost?", answer: "It depends on the size of the property and the pest. A standard 3-bedroom home treatment starts from around R850." }
        ],
        testimonials: [
             { id: 'test-1', name: "Sarah Jenkins", location: "White River", text: "Absolutely fantastic service. Had a terrible ant problem in the kitchen. The technician was polite, on time, and the ants were gone within 2 days. Highly recommend!", rating: 5 },
             { id: 'test-2', name: "Mike Van Der Merwe", location: "Nelspruit", text: "Called them for a termite inspection. Thorough and honest. Didn't try to upsell me on things I didn't need. Good local business.", rating: 5 },
             { id: 'test-3', name: "The Olive Garden B&B", location: "Barberton", text: "We use Pro Pest Hunters for our monthly hospitality contract. They are always professional and keep our paperwork for health inspections perfect.", rating: 5 },
             { id: 'test-4', name: "Thabo M", location: "Kanyamazane", text: "Quick response. They came on a Saturday to help with a wasps nest. Very brave guys!", rating: 4 },
             { id: 'test-5', name: "Elize Kotze", location: "West Acres", text: "Friendly staff and safe for my dogs. Will definitely use them again for my annual spray.", rating: 5 }
        ],
        bankDetails: {
            bankName: "FNB",
            accountName: "Pro Pest Hunters Pty Ltd",
            accountNumber: "6289 4512 300",
            branchCode: "250 655"
        },
        seo: { 
            metaTitle: "Pro Pest Hunters | Best Pest Control in Nelspruit & Lowveld", 
            metaDescription: "Professional pest control services in Nelspruit, White River & Barberton. Safe for pets & families. Termites, Ants, Roaches. Get a free quote today!", 
            keywords: "pest control nelspruit, pest control white river, termite treatment, cockroach removal, exterminator lowveld, pro pest hunters", 
            ogImage: "https://images.unsplash.com/photo-1588615419996-53d937a0a09d?auto=format&fit=crop&q=80&w=1200",
            ogTitle: "Pro Pest Hunters - Expert Pest Control",
            ogDescription: "Guaranteed results against termites, ants, and roaches. Serving the Lowveld since 2006.",
            canonicalUrl: "https://www.propesthunters.co.za",
            robotsDirective: "index, follow",
            structuredDataJSON: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Pro Pest Hunters",
                "image": "https://i.ibb.co/zHBzVwRV/image.png",
                "telephone": "+27137524899",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Unit 4, Rapid Falls Industrial Park",
                    "addressLocality": "Nelspruit",
                    "addressRegion": "Mpumalanga",
                    "postalCode": "1200",
                    "addressCountry": "ZA"
                },
                "priceRange": "$$"
            }, null, 2)
        }
    };
}

// --- APP STARTUP ---
// Initialize Schema sequentially before starting the server
db.initSchema()
    .then(() => {
        // Once schema is ready, check for seed data
        checkAndSeed('settings', getDefaultSettingsAsArray());
        checkAndSeed('employees', getDefaultEmployees());
        checkAndSeed('locations', getDefaultLocations());
        checkAndSeed('jobs', getDefaultJobs());

        // Start listening
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize database schema:", err);
        process.exit(1);
    });
