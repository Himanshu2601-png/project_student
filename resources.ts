import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import db from '../db/index.js';

const router = express.Router();

// Upload Resource
router.post('/upload', authenticateToken, upload.single('file'), (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { title, description, branch, semester, subject, year } = req.body;
  const userId = req.user?.id;
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO resources (title, description, branch, semester, subject, year, file_url, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(title, description, branch, semester, subject, year, fileUrl, userId);
    res.status(201).json({ message: 'Resource uploaded successfully', resourceId: info.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Resources (with filters)
router.get('/', (req, res) => {
  const { branch, semester, subject, year, search } = req.query;
  
  let query = `
    SELECT r.*, u.name as uploader_name 
    FROM resources r 
    JOIN users u ON r.uploaded_by = u.id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (branch) {
    query += ' AND r.branch = ?';
    params.push(branch);
  }
  if (semester) {
    query += ' AND r.semester = ?';
    params.push(semester);
  }
  if (subject) {
    query += ' AND r.subject LIKE ?';
    params.push(`%${subject}%`);
  }
  if (year) {
    query += ' AND r.year = ?';
    params.push(year);
  }
  if (search) {
    query += ' AND (r.title LIKE ? OR r.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY r.created_at DESC';

  try {
    const stmt = db.prepare(query);
    const resources = stmt.all(...params);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single Resource
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT r.*, u.name as uploader_name 
      FROM resources r 
      JOIN users u ON r.uploaded_by = u.id 
      WHERE r.id = ?
    `);
    const resource = stmt.get(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Resource (Admin or Owner)
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM resources WHERE id = ?');
    const resource = stmt.get(req.params.id) as any;

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is admin or owner
    if (req.user?.role !== 'admin' && req.user?.id !== resource.uploaded_by) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deleteStmt = db.prepare('DELETE FROM resources WHERE id = ?');
    deleteStmt.run(req.params.id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
