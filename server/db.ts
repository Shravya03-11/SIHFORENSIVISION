import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'forensivision.db');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'evidence');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('Failed to write database file to disk:', err);
  }
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('Loaded existing persistent ForensiVision SQLite database from:', DB_PATH);
    } catch (e) {
      console.warn('Could not read existing database, initializing new database:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    console.log('Initializing fresh ForensiVision SQLite database at:', DB_PATH);
    dbInstance = new SQL.Database();
  }

  initSchema(dbInstance);
  saveDatabase();
  return dbInstance;
}

function initSchema(db: Database) {
  db.run('PRAGMA foreign_keys = ON;');

  // 1. USERS
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 2. CASES
  db.run(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      case_number TEXT UNIQUE NOT NULL,
      case_name TEXT NOT NULL,
      description TEXT,
      investigator TEXT,
      location TEXT,
      incident_date TEXT,
      status TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 3. EVIDENCE
  db.run(`
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_type TEXT,
      file_size TEXT,
      storage_path TEXT,
      device_vendor TEXT,
      device_model TEXT,
      device_type TEXT,
      camera_count INTEGER,
      video_codec TEXT,
      md5 TEXT,
      sha256 TEXT,
      acquisition_status TEXT,
      integrity_status TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
  `);

  // 4. ANALYSIS_RESULTS
  db.run(`
    CREATE TABLE IF NOT EXISTS analysis_results (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      evidence_id TEXT,
      camera_id TEXT,
      timestamp TEXT,
      detection_type TEXT,
      object_type TEXT,
      confidence REAL,
      description TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    );
  `);

  // 5. TIMELINE_EVENTS
  db.run(`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      camera_id TEXT,
      timestamp TEXT,
      event_type TEXT,
      subject_id TEXT,
      description TEXT,
      confidence REAL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
  `);

  // 6. RECOVERY_ITEMS
  db.run(`
    CREATE TABLE IF NOT EXISTS recovery_items (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      evidence_id TEXT,
      camera_id TEXT,
      timestamp TEXT,
      status TEXT,
      description TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    );
  `);

  // 7. CHAIN_OF_CUSTODY
  db.run(`
    CREATE TABLE IF NOT EXISTS chain_of_custody (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      evidence_id TEXT,
      action TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details TEXT,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    );
  `);

  // 8. REPORTS
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      report_number TEXT UNIQUE NOT NULL,
      generated_by TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      file_path TEXT,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
  `);

  // 9. VIDEOS (Requirement 11)
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      evidence_id TEXT,
      filename TEXT NOT NULL,
      file_size TEXT,
      duration REAL,
      resolution TEXT,
      fps REAL,
      codec TEXT,
      storage_path TEXT,
      processing_status TEXT, -- 'UPLOADED', 'PROCESSING', 'ANALYZED', 'READY'
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    );
  `);

  // 10. VIDEO_FRAMES (Requirement 11)
  db.run(`
    CREATE TABLE IF NOT EXISTS video_frames (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL,
      timestamp TEXT,
      frame_number INTEGER,
      frame_path TEXT,
      camera_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
    );
  `);

  // 11. RECOVERY_RESULTS (Requirement 11)
  db.run(`
    CREATE TABLE IF NOT EXISTS recovery_results (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      evidence_id TEXT,
      recovery_id TEXT NOT NULL,
      camera_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      segment_name TEXT NOT NULL,
      status TEXT NOT NULL, -- 'RECOVERABLE', 'PARTIAL', 'CORRUPTED'
      confidence REAL NOT NULL,
      preview_path TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    );
  `);

  // Seed default demonstration records if empty
  seedDemonstrationData(db);
}

function seedDemonstrationData(db: Database) {
  // Check if users exist
  const userCheck = db.exec('SELECT COUNT(*) as count FROM users');
  const userCount = userCheck.length > 0 && userCheck[0].values.length > 0 ? (userCheck[0].values[0][0] as number) : 0;

  if (userCount === 0) {
    console.log('Seeding initial demonstration data into SQLite database...');
    // Demo users: Forensic Investigator & Vance
    db.run(
      `INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'usr-demo-01',
        'Forensic Investigator',
        'investigator@forensivision.demo',
        'Forensic@123',
        'Digital Forensics Analyst',
        '2026-01-15T08:00:00Z',
      ]
    );
    db.run(
      `INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'usr-8841',
        'Investigator M. Vance, D-ABFDE',
        'm.vance@forensivision.gov',
        'SigmaVault#4029', // In production, bcrypt; for prototype credentials
        'Senior Digital Video Forensic Examiner',
        '2024-01-15T08:00:00Z',
      ]
    );
    db.run(
      `INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'usr-8842',
        'Analyst S. Chen',
        's.chen@forensivision.gov',
        'Forensic#2026',
        'Forensic Video Technician',
        '2024-02-10T09:00:00Z',
      ]
    );

    // Demonstration Case: FV-2026-001 Warehouse Theft Investigation
    const caseId = 'case-fv-2026-001';
    db.run(
      `INSERT INTO cases (id, case_number, case_name, description, investigator, location, incident_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caseId,
        'FV-2026-001',
        'Warehouse Theft Investigation',
        'Unauthorized physical breach and high-value logistics inventory diversion at Metro North Distribution Vault 4. 8-channel synchronous CCTV bitstream acquired via direct forensic write-blocker connection.',
        'Investigator M. Vance, D-ABFDE',
        'Metro North Distribution Center, Sector 4',
        '2026-08-14 22:30:00 UTC',
        'Under Analysis',
        '2026-08-15T02:15:00Z',
        '2026-08-15T03:00:00Z',
      ]
    );

    // Second Case: FV-2026-002 Retail Boulevard Incident
    db.run(
      `INSERT INTO cases (id, case_number, case_name, description, investigator, location, incident_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'case-fv-2026-002',
        'FV-2026-002',
        'Retail Boulevard Intersection Incident',
        'Multi-vehicle collision and pedestrian hit-and-run at 5th & Boulevard crossing. Surveillance captured on CP Plus and Dahua commercial storefront systems.',
        'Analyst S. Chen',
        'Intersection 5th Ave & Retail Blvd',
        '2026-08-20 14:15:00 UTC',
        'Acquisition',
        '2026-08-20T16:00:00Z',
        '2026-08-20T16:30:00Z',
      ]
    );

    // Evidence for Case 1
    const evidenceId = 'ev-9942';
    db.run(
      `INSERT INTO evidence (id, case_id, filename, file_type, file_size, storage_path, device_vendor, device_model, device_type, camera_count, video_codec, md5, sha256, acquisition_status, integrity_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        evidenceId,
        caseId,
        'warehouse_dvr.img',
        'Forensic Raw DD Image (.img)',
        '3.84 GB',
        '/uploads/evidence/warehouse_dvr.img',
        'Hikvision Digital Technology',
        'DS-7732NI-I4 / 16P Pro Embedded NVR',
        'Stand-Alone NVR',
        8,
        'H.265+ (Smart Codec) @ 60.00 FPS',
        '7d92fa4b8e2193b0a734df981e18d6c2',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'Acquired',
        'INTEGRITY VERIFIED',
        '2026-08-15T02:44:19Z',
      ]
    );

    // Chain of Custody for Case 1
    const custodyEvents = [
      {
        action: 'Physical Storage Media Ingested',
        details: 'Seagate 4TB NVR drive connected via Tableau T8u forensic SATA write-blocker in physical write-blocked mode.',
        ts: '2026-08-15 02:20:00 UTC',
      },
      {
        action: 'Cryptographic Baseline Established',
        details: 'Initial physical bitstream hashes calculated: SHA-256: e3b0c442... | MD5: 7d92fa4b...',
        ts: '2026-08-15 02:44:19 UTC',
      },
      {
        action: 'Bitstream Master Image Cloned',
        details: 'Forensic DD raw bitstream verified against master hardware. Zero-block parity validated.',
        ts: '2026-08-15 03:02:40 UTC',
      },
      {
        action: 'Forensic Working Copy Mounted',
        details: 'Target image warehouse_dvr.img allocated to read-only memory buffer for multi-camera demuxing.',
        ts: '2026-08-15 03:10:15 UTC',
      },
      {
        action: 'Analysis Session Initialized',
        details: 'AI object tracking and multi-camera correlation pipeline executed on working copy.',
        ts: '2026-08-15 03:22:00 UTC',
      },
    ];

    for (let i = 0; i < custodyEvents.length; i++) {
      const c = custodyEvents[i];
      db.run(
        `INSERT INTO chain_of_custody (id, case_id, evidence_id, action, performed_by, timestamp, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          `coc-${Date.now()}-${i}`,
          caseId,
          evidenceId,
          c.action,
          'Investigator M. Vance, D-ABFDE',
          c.ts,
          c.details,
        ]
      );
    }

    // Timeline events
    const timelineData = [
      {
        camera: 'CAM-01',
        time: '22:31:12',
        type: 'Motion',
        subject: 'ENV-01',
        desc: 'Motion detected along perimeter fence gate line',
        conf: 91,
      },
      {
        camera: 'CAM-02',
        time: '22:35:44',
        type: 'Person',
        subject: 'SUB-8821',
        desc: 'Individual enters secondary parking bay',
        conf: 94,
      },
      {
        camera: 'CAM-03',
        time: '22:38:21',
        type: 'Vehicle',
        subject: 'VEH-EX88',
        desc: 'Unregistered dark SUV arrives at loading ramp dock 2',
        conf: 89,
      },
      {
        camera: 'CAM-04',
        time: '22:41:32',
        type: 'Person',
        subject: 'SUB-8821',
        desc: 'Person detected moving with duffle bag toward staging bay',
        conf: 96,
      },
      {
        camera: 'CAM-06',
        time: '22:44:08',
        type: 'Exit',
        subject: 'SUB-8821',
        desc: 'Person exits loading dock through emergency egress door',
        conf: 93,
      },
    ];

    for (let i = 0; i < timelineData.length; i++) {
      const t = timelineData[i];
      db.run(
        `INSERT INTO timeline_events (id, case_id, camera_id, timestamp, event_type, subject_id, description, confidence, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `tl-${Date.now()}-${i}`,
          caseId,
          t.camera,
          t.time,
          t.type,
          t.subject,
          t.desc,
          t.conf,
          '2026-08-15T03:30:00Z',
        ]
      );
    }

    // Analysis results
    const analysisData = [
      {
        camera: 'CAM-04',
        time: '22:41:32',
        type: 'Person',
        obj: 'Individual (Hooded male, height approx 5ft 11in)',
        conf: 94.2,
        desc: 'Subject carrying high-capacity duffle bag matches SUB-8821',
      },
      {
        camera: 'CAM-03',
        time: '22:38:21',
        type: 'Vehicle',
        obj: 'Dark SUV / Late Model Crossover',
        conf: 89.6,
        desc: 'Vehicle license plate obscured by mud, rear taillight cluster identified',
      },
      {
        camera: 'CAM-04',
        time: '22:42:05',
        type: 'Object',
        obj: 'Heavy Cargo Duffle / Backpack',
        conf: 87.4,
        desc: 'Contraband duffle with reflective shoulder strap',
      },
      {
        camera: 'CAM-01',
        time: '22:31:12',
        type: 'Motion',
        obj: 'Perimeter Boundary Sensor Trip',
        conf: 91.0,
        desc: 'Focal breach detected in Sector 1 camera zone',
      },
    ];

    for (let i = 0; i < analysisData.length; i++) {
      const a = analysisData[i];
      db.run(
        `INSERT INTO analysis_results (id, case_id, evidence_id, camera_id, timestamp, detection_type, object_type, confidence, description, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `ar-${Date.now()}-${i}`,
          caseId,
          evidenceId,
          a.camera,
          a.time,
          a.type,
          a.obj,
          a.conf,
          a.desc,
          '2026-08-15T03:40:00Z',
        ]
      );
    }

    // Recovery items
    const recoveryData = [
      {
        id: 'REC-001',
        camera: 'CAM-03',
        time: '22:18:41',
        status: 'Recoverable',
        desc: 'Unallocated sector 0x00A4F820 carving intact H.265 I-frame sequence (Loading Bay)',
      },
      {
        id: 'REC-002',
        camera: 'CAM-04',
        time: '22:22:17',
        status: 'Partial',
        desc: 'Orphaned cluster run 0x00B10300 - 32 frames carved with partial macroblock corruption',
      },
      {
        id: 'REC-003',
        camera: 'CAM-02',
        time: '22:15:03',
        status: 'Recoverable',
        desc: 'Deleted cyclic file header 0x00938C10 reconstructed via DHAV frame boundary scan',
      },
      {
        id: 'REC-004',
        camera: 'CAM-01',
        time: '21:58:30',
        status: 'Corrupted',
        desc: 'Overwritten sector track 0x00800040 - keyframe payload fragmented beyond reconstruction',
      },
    ];

    for (const r of recoveryData) {
      db.run(
        `INSERT INTO recovery_items (id, case_id, evidence_id, camera_id, timestamp, status, description, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          caseId,
          evidenceId,
          r.camera,
          r.time,
          r.status,
          r.desc,
          '2026-08-15T03:50:00Z',
        ]
      );
    }

    // Reports
    db.run(
      `INSERT INTO reports (id, case_id, report_number, generated_by, generated_at, file_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'rep-001',
        caseId,
        'REP-FV-2026-001-A',
        'Investigator M. Vance, D-ABFDE',
        '2026-08-15T04:30:00Z',
        '/reports/REP-FV-2026-001-A.pdf',
      ]
    );

    // Initial Video Record (Requirement 11)
    const videoId = 'vid-fv-001';
    db.run(
      `INSERT INTO videos (id, case_id, evidence_id, filename, file_size, duration, resolution, fps, codec, storage_path, processing_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        videoId,
        caseId,
        evidenceId,
        'ch04_cctv_vault_corridor.mp4',
        '212.6 KB',
        15.0,
        '1280x720',
        30.0,
        'h264',
        '/uploads/evidence/sample_cctv.mp4',
        'READY',
        '2026-08-15T02:30:00Z',
      ]
    );

    // Initial Video Frames (Requirement 11)
    const frameSeeds = [
      { num: 30, time: '00:00:01.000', cam: 'CAM-01' },
      { num: 90, time: '00:00:03.000', cam: 'CAM-02' },
      { num: 180, time: '00:00:06.000', cam: 'CAM-03' },
      { num: 270, time: '00:00:09.000', cam: 'CAM-04' },
      { num: 360, time: '00:00:12.000', cam: 'CAM-05' },
    ];
    for (let i = 0; i < frameSeeds.length; i++) {
      const f = frameSeeds[i];
      db.run(
        `INSERT INTO video_frames (id, video_id, timestamp, frame_number, frame_path, camera_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          `frm-${videoId}-${i + 1}`,
          videoId,
          f.time,
          f.num,
          '/uploads/frames/sample_cctv_frame_1.jpg',
          f.cam,
          '2026-08-15T02:31:00Z',
        ]
      );
    }

    // Initial Recovery Results (Requirement 11 & Requirement 6)
    const recoveryResultSeeds = [
      {
        recId: 'REC-001',
        cam: 'CAM-03',
        time: '22:18:41',
        segment: 'video_segment_001.mp4',
        status: 'RECOVERABLE',
        conf: 98.4,
        preview: '/uploads/evidence/sample_cctv.mp4',
      },
      {
        recId: 'REC-002',
        cam: 'CAM-04',
        time: '22:22:17',
        segment: 'video_segment_002.h264',
        status: 'PARTIAL',
        conf: 76.1,
        preview: '',
      },
      {
        recId: 'REC-003',
        cam: 'CAM-06',
        time: '22:31:04',
        segment: 'video_segment_003.raw',
        status: 'CORRUPTED',
        conf: 34.0,
        preview: '',
      },
      {
        recId: 'REC-004',
        cam: 'CAM-01',
        time: '22:34:50',
        segment: 'video_segment_004.mp4',
        status: 'RECOVERABLE',
        conf: 94.7,
        preview: '/uploads/evidence/sample_cctv.mp4',
      },
    ];

    for (let i = 0; i < recoveryResultSeeds.length; i++) {
      const rr = recoveryResultSeeds[i];
      db.run(
        `INSERT INTO recovery_results (id, case_id, evidence_id, recovery_id, camera_id, timestamp, segment_name, status, confidence, preview_path, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `rec-res-${i + 1}`,
          caseId,
          evidenceId,
          rr.recId,
          rr.cam,
          rr.time,
          rr.segment,
          rr.status,
          rr.conf,
          rr.preview,
          '2026-08-15T03:55:00Z',
        ]
      );
    }

    console.log('Demonstration data successfully seeded.');
  }

  // Ensure recovery_results is seeded if empty (for existing databases)
  try {
    const rrCheck = db.exec('SELECT COUNT(*) as count FROM recovery_results');
    const rrCount = rrCheck.length > 0 && rrCheck[0].values.length > 0 ? (rrCheck[0].values[0][0] as number) : 0;
    if (rrCount === 0) {
      const caseId = 'case-fv-2026-001';
      const evidenceId = 'ev-9942';
      const recoveryResultSeeds = [
        {
          recId: 'REC-001',
          cam: 'CAM-03',
          time: '22:18:41',
          segment: 'video_segment_001.mp4',
          status: 'RECOVERABLE',
          conf: 98.4,
          preview: '/uploads/evidence/sample_cctv.mp4',
        },
        {
          recId: 'REC-002',
          cam: 'CAM-04',
          time: '22:22:17',
          segment: 'video_segment_002.h264',
          status: 'PARTIAL',
          conf: 76.1,
          preview: '',
        },
        {
          recId: 'REC-003',
          cam: 'CAM-06',
          time: '22:31:04',
          segment: 'video_segment_003.raw',
          status: 'CORRUPTED',
          conf: 34.0,
          preview: '',
        },
        {
          recId: 'REC-004',
          cam: 'CAM-01',
          time: '22:34:50',
          segment: 'video_segment_004.mp4',
          status: 'RECOVERABLE',
          conf: 94.7,
          preview: '/uploads/evidence/sample_cctv.mp4',
        },
      ];
      for (let i = 0; i < recoveryResultSeeds.length; i++) {
        const rr = recoveryResultSeeds[i];
        db.run(
          `INSERT INTO recovery_results (id, case_id, evidence_id, recovery_id, camera_id, timestamp, segment_name, status, confidence, preview_path, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `rec-res-${i + 1}`,
            caseId,
            evidenceId,
            rr.recId,
            rr.cam,
            rr.time,
            rr.segment,
            rr.status,
            rr.conf,
            rr.preview,
            '2026-08-15T03:55:00Z',
          ]
        );
      }
      saveDatabase();
    }
  } catch (err) {
    console.warn('recovery_results table check notice:', err);
  }
}

// Database helper functions
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDatabase();
  const stmt = db.prepare(sql);
  if (params && params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return results;
}

export async function executeGetOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await executeQuery<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function executeRun(sql: string, params: any[] = []): Promise<void> {
  const db = await getDatabase();
  db.run(sql, params);
  saveDatabase();
}
