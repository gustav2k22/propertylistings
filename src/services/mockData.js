// Mock data for properties
// Using let instead of const so we can update the array
let mockProperties = [
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

// Function to get a single property by ID
export const getMockProperty = (id) => {
  return mockProperties.find(property => property.id === parseInt(id));
};

// Function to add a new property to mock data
export const addMockProperty = (property) => {
  // Generate a new ID that doesn't conflict with existing ones
  const maxId = mockProperties.length > 0 
    ? Math.max(...mockProperties.map(p => p.id))
    : 0;
  
  const newProperty = {
    ...property,
    id: maxId + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to the beginning of the array so it shows up first
  mockProperties = [newProperty, ...mockProperties];
  
  return newProperty;
};

// Function to get all mock properties
export const getAllMockProperties = () => {
  return [...mockProperties];
};

// Function to delete a mock property
export const deleteMockProperty = (id) => {
  const initialLength = mockProperties.length;
  mockProperties = mockProperties.filter(property => property.id !== parseInt(id));
  return initialLength !== mockProperties.length;
};
