const PRODUCTS = [
  {
    handle: "berlin-universal-corner-sofa-bed-with-storage",
    title: "Berlin Universal Corner Sofa Bed with Storage",
    price: 350.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-1.jpg?v=1784750296",
    bestseller: true,
    sale: false
  },
  {
    handle: "classic-italian-chesterfield-32-seater-fabric-sofa-timeless",
    title: "Classic Italian Chesterfield 3+2 Seater Fabric Sofa – Timeless",
    price: 850.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/chesterfield-sofa-2-seater-1.webp?v=1784750161",
    bestseller: true,
    sale: false
  },
  {
    handle: "8-door-wardrobe-full-set",
    title: "8 Door Wardrobe Full Bedroom Set",
    price: 850.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/8-door-wardrobe-1.png?v=1784747601",
    bestseller: true,
    sale: false
  },
  {
    handle: "simple-bunk-bed-with-mattresses",
    title: "Solid Wooden Double Kids Bunk Bed with 2 Mattresses",
    price: 350.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/double-bunk-bed-1.jpg?v=1784750270",
    bestseller: true,
    sale: false
  },
  {
    handle: "berlin-sofa-bed-dark-gray-velvet",
    title: "Berlin sofa bed dark gray velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-1.jpg?v=1784750296",
    bestseller: false,
    sale: true
  },
  {
    handle: "paradise-sofabed-grey",
    title: "Paradise Sofabed Grey",
    price: 179.0,
    compareAtPrice: 210.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/paradise-gray-sofa-bed-1.jpg?v=1784720642",
    bestseller: false,
    sale: true
  },
  {
    handle: "new-leather-grey-sofa-bed-with-storage-51-105",
    title: "New Leather Grey Sofa Bed with Storage 51-105",
    price: 313.0,
    compareAtPrice: 328.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gray-sofa-bed-1.webp?v=1784725800",
    bestseller: false,
    sale: true
  },
  {
    handle: "dylan-5-seater-corner-sofa-jumbo-cord",
    title: "Dylan 5 seater corner sofa Jumbo cord",
    price: 430.0,
    compareAtPrice: 450.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dylan-corner-sofa-5-seater-1.webp?v=1784720361",
    bestseller: false,
    sale: true
  },
  {
    handle: "5-piece-patio-dining-set-with-glass-table-amp-wicker-chairs-gray",
    title: "5-Piece Patio Dining Set with Glass Table & Wicker Chairs – Gray",
    price: 165.0,
    compareAtPrice: 180.0,
    category: "Outdoor Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/rattan-dining-set.jpg?v=1784720298",
    bestseller: false,
    sale: true
  },
  {
    handle: "still-sofabed-grey",
    title: "Still Sofa bed Grey",
    price: 252.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/still-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "arte-sofabed-blue",
    title: "Arte Sofabed Blue",
    price: 252.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/arte-blue-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "melis-sofabed-grey",
    title: "Melis Sofabed Grey",
    price: 252.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/melis-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "eliza-sofabed-grey",
    title: "Eliza Sofabed Grey",
    price: 252.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/eliza-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "dizayn-sofabed-grey",
    title: "Dizayn Sofabed Grey",
    price: 252.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dizayn-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "victoria-3-piece-garden-corner-sofa-set-rattan-outdoor-patio-lounge-for-garden-backyard",
    title: "Garden Rattan Corner Sofa Set – Outdoor Patio Lounge for Garden & Backyard",
    price: 280.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/rattan-corner-sofa-1.jpg?v=1784720361",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashwin-32-seater-high-back-corner-sofa",
    title: "Ashwin 3+2 Seater High Back Corner Sofa",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashwin-corner-sofa-high-back-1.jpg?v=1784747938",
    bestseller: false,
    sale: false
  },
  {
    handle: "kuzey-grey-gold-sofa-collection",
    title: "Kuzey Grey &  Gold Sofa Collection",
    price: 252.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kuzey-gray-sofa-1.webp?v=1784725799",
    bestseller: false,
    sale: false
  },
  {
    handle: "6-door-dressing-wardrobe",
    title: "6 Door Dressing Wardrobe",
    price: 450.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-wardrobe-1.png?v=1784747575",
    bestseller: false,
    sale: false
  },
  {
    handle: "5-door-wardrobe-full-bedroom-set-with-mirrors-and-storage",
    title: "5 Door Wardrobe Full Bedroom Set with Mirrors and Storage",
    price: 550.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/5-door-mirror-wardrobe-1.png?v=1784747690",
    bestseller: false,
    sale: false
  },
  {
    handle: "4-door-wardrobe-set",
    title: "4 Door Wardrobe Bedroom Set",
    price: 400.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/4-door-wardrobe-1.png?v=1784747719",
    bestseller: false,
    sale: false
  },
  {
    handle: "3-door-wardrobe-plan",
    title: "3 Door Wardrobe with Shelving and Hanging Rail",
    price: 189.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/3-door-wardrobe-plan-1.png?v=1784747805",
    bestseller: false,
    sale: false
  },
  {
    handle: "2-door-wardrobe-gent-full-set",
    title: "Classic 2 Door Wardrobe Bedroom Set",
    price: 250.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-wardrobe-1.png?v=1784747806",
    bestseller: false,
    sale: false
  },
  {
    handle: "ready-assembled-2-door-wardrobe-2-drawer-with-mirrors",
    title: "2 Door Wardrobe with 2 Drawers and Mirrors",
    price: 140.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-wardrobe-v2-1.jpg?v=1784747834",
    bestseller: false,
    sale: false
  },
  {
    handle: "oxford-wingback-luxury-beds",
    title: "Oxford Wingback Luxury Beds",
    price: 240.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/oxford-bed.png?v=1784747859",
    bestseller: false,
    sale: false
  },
  {
    handle: "4-piece-outdoor-patio-furniture-set-with-cushions-rattan-conversation-set-garden-sofa-set-with-coffee-table-grey",
    title: "4-Piece Outdoor Patio Furniture Set with Cushions, Rattan Conversation Set, Garden Sofa Set with Table, Grey",
    price: 180.0,
    category: "Outdoor Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/rattan-patio-set.jpg?v=1784720298",
    bestseller: false,
    sale: false
  },
  {
    handle: "garden-rattan-1-1-2-seater-sofa-set-outdoor-patio-lounge-furniture",
    title: "Garden Rattan 1+1+2 Seater Sofa Set – Outdoor Patio Lounge Furniture",
    price: 280.0,
    category: "Outdoor Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/rattan-lounge-set-1.jpg?v=1784720361",
    bestseller: false,
    sale: false
  },
];

const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

function getProductByHandle(handle) {
  return PRODUCTS.find(p => p.handle === handle);
}

function saleProducts() {
  return PRODUCTS.filter(p => p.sale);
}

function discountPercent(p) {
  if (!p.compareAtPrice) return 0;
  return Math.round((1 - p.price / p.compareAtPrice) * 100);
}
