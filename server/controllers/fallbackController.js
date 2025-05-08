// Mock data for when the database is unavailable
const mockProperties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    description: "A beautiful modern apartment located in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and a spacious balcony.",
    price: 350000,
    location: "Downtown, City Center",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    created_at: "2025-04-15T10:30:00Z",
    updated_at: "2025-04-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet suburban neighborhood. Features 4 bedrooms, 3 bathrooms, a large backyard, and a two-car garage. Perfect for growing families.",
    price: 450000,
    location: "Greenfield Suburb",
    image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    created_at: "2025-04-10T14:45:00Z",
    updated_at: "2025-04-10T14:45:00Z"
  },
  {
    id: 3,
    title: "Luxury Beachfront Villa",
    description: "Exclusive beachfront villa with panoramic ocean views. Features include a private pool, 5 bedrooms, gourmet kitchen, and direct beach access. The ultimate luxury living experience.",
    price: 1200000,
    location: "Coastal Paradise",
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    created_at: "2025-03-25T09:15:00Z",
    updated_at: "2025-03-25T09:15:00Z"
  },
  {
    id: 4,
    title: "Cozy Mountain Cabin",
    description: "Charming cabin nestled in the mountains. Features a stone fireplace, wooden beams, and a wraparound deck with stunning forest views. Perfect for nature lovers.",
    price: 275000,
    location: "Mountain Heights",
    image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
    created_at: "2025-04-05T16:20:00Z",
    updated_at: "2025-04-05T16:20:00Z"
  },
  {
    id: 5,
    title: "Urban Loft Apartment",
    description: "Stylish loft apartment in a converted warehouse. Features high ceilings, exposed brick walls, and large windows. Located in a trendy neighborhood with easy access to restaurants and shops.",
    price: 320000,
    location: "Arts District",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    created_at: "2025-04-20T11:10:00Z",
    updated_at: "2025-04-20T11:10:00Z"
  }
];

// In-memory storage for new properties when database is unavailable
let nextId = 6;
let properties = [...mockProperties];

export const getAllProperties = (req, res) => {
  res.json(properties);
};

export const getPropertyById = (req, res) => {
  const id = parseInt(req.params.id);
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json(property);
};

export const createProperty = (req, res) => {
  const { title, description, price, location, image_url } = req.body;

  if (!title || !price || !location) {
    return res.status(400).json({ message: 'Title, price, and location are required' });
  }

  const newProperty = {
    id: nextId++,
    title,
    description: description || '',
    price,
    location,
    image_url: image_url || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add to the beginning so it shows up first
  properties = [newProperty, ...properties];
  
  res.status(201).json(newProperty);
};

export const deleteProperty = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = properties.length;
  
  properties = properties.filter(p => p.id !== id);
  
  if (properties.length === initialLength) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json({ message: 'Property deleted successfully' });
};
