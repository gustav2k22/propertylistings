import { pool, isConnected, connectionError } from '../config/database.js';
import * as fallbackController from './fallbackController.js';

export const getAllProperties = async (req, res) => {
  // If we know the database connection failed, use fallback immediately
  if (connectionError) {
    console.log('Using fallback controller for getAllProperties due to known connection error');
    return fallbackController.getAllProperties(req, res);
  }
  
  try {
    const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // If there's a database error, use the fallback controller
    console.log('Using fallback controller for getAllProperties due to query error');
    return fallbackController.getAllProperties(req, res);
  }
};

export const getPropertyById = async (req, res) => {
  // If we know the database connection failed, use fallback immediately
  if (connectionError) {
    console.log('Using fallback controller for getPropertyById due to known connection error');
    return fallbackController.getPropertyById(req, res);
  }
  
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    
    // If there's a database error, use the fallback controller
    console.log('Using fallback controller for getPropertyById due to query error');
    return fallbackController.getPropertyById(req, res);
  }
};

export const createProperty = async (req, res) => {
  const { title, description, price, location, image_url } = req.body;

  if (!title || !price || !location) {
    return res.status(400).json({ message: 'Title, price, and location are required' });
  }

  // If we know the database connection failed, use fallback immediately
  if (connectionError) {
    console.log('Using fallback controller for createProperty due to known connection error');
    return fallbackController.createProperty(req, res);
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO properties (title, description, price, location, image_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, price, location, image_url]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating property:', error);
    
    // If there's a database error, use the fallback controller
    console.log('Using fallback controller for createProperty due to query error');
    return fallbackController.createProperty(req, res);
  }
};

export const deleteProperty = async (req, res) => {
  // If we know the database connection failed, use fallback immediately
  if (connectionError) {
    console.log('Using fallback controller for deleteProperty due to known connection error');
    return fallbackController.deleteProperty(req, res);
  }
  
  try {
    const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    
    // If there's a database error, use the fallback controller
    console.log('Using fallback controller for deleteProperty due to query error');
    return fallbackController.deleteProperty(req, res);
  }
}; 