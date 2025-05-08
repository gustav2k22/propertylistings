import { pool } from '../config/database.js';

export const getAllProperties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
};

export const createProperty = async (req, res) => {
  const { title, description, price, location, image_url } = req.body;

  if (!title || !price || !location) {
    return res.status(400).json({ message: 'Title, price, and location are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO properties (title, description, price, location, image_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, price, location, image_url]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
}; 