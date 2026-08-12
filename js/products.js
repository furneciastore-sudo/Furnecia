const PRODUCTS = [
  {
    handle: "berlin-universal-corner-sofa-bed-with-storage",
    title: "Berlin Universal Corner Sofa Bed with Storage",
    price: 350.0,
    category: "Corner Sofas",
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
    title: "8 Door Wardrobe Full Bedroom Set – with Chest of Drawers & Bedside Cabinet",
    price: 850.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/8-door-wardrobe-1.png?v=1784747601",
    bestseller: true,
    sale: false
  },
  {
    handle: "simple-bunk-bed-with-mattresses",
    title: "Solid Wooden Double Kids Bunk Bed Frame with 2 Mattresses – Space Saving, Convertible & Safe Design",
    price: 350.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/double-bunk-bed-1.jpg?v=1784750270",
    bestseller: true,
    sale: false
  },
  {
    handle: "berlin-sofa-bed-beige-velvet",
    title: "Berlin sofa bed beige velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-3.jpg?v=1784750321",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-blue-velvet",
    title: "Berlin sofa bed blue velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-7.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-charcoal",
    title: "Berlin sofa bed charcoal",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-6.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-cream-velvet",
    title: "Berlin sofa bed cream velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-4.jpg?v=1784750322",
    bestseller: false,
    sale: true
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
    handle: "berlin-sofa-bed-gray",
    title: "Berlin sofa bed gray",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-9.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-green-velvet",
    title: "Berlin sofa bed green velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-10.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-light-charcoal",
    title: "Berlin sofa bed light charcoal",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-2.jpg?v=1784750321",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-mustered-velvet",
    title: "Berlin sofa bed mustered velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-5.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "berlin-sofa-bed-red-velvet",
    title: "Berlin sofa bed red velvet",
    price: 350.0,
    compareAtPrice: 400.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/berlin-corner-sofa-bed-8.jpg?v=1784750322",
    bestseller: false,
    sale: true
  },
  {
    handle: "leather-gray-2-seater-sofa-bed-compact-comfort-timeless-style",
    title: "Leather Grey 2-Seater Sofa Bed – Compact Comfort, Timeless Style",
    price: 275.0,
    compareAtPrice: 290.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gray-sofa-bed-v3-1.jpg?v=1784749517",
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
    handle: "paradise-sofabed-brown",
    title: "Paradise Sofabed Brown",
    price: 179.0,
    compareAtPrice: 210.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/paradise-brown-sofa-bed-1.jpg?v=1784720643",
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
    handle: "luxury-bishop-u-shape-corner-sofa-premium-dapple-big-stylish-ultra-comfortable",
    title: "Bishop U-Shape Corner Sofa – Big, Stylish & Ultra Comfortable",
    price: 600.0,
    compareAtPrice: 650.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/bishop-corner-sofa-1.jpg?v=1784750322",
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
    handle: "ready-assembled-2-door-wardrobe-2-drawer-with-mirrors",
    title: "2 Door Wardrobe with 2 Drawers and Mirrors",
    price: 150.0,
    compareAtPrice: 160.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-wardrobe-v2-1.jpg?v=1784747834",
    bestseller: false,
    sale: true
  },
  {
    handle: "3-door-wardrobe-plan",
    title: "3 Door Wardrobe with Shelving and Hanging Rail",
    price: 189.0,
    compareAtPrice: 220.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/3-door-wardrobe-plan-1.png?v=1784747805",
    bestseller: false,
    sale: true
  },
  {
    handle: "6-door-wardrobe",
    title: "6 Door Plain Wardrobe",
    price: 299.0,
    compareAtPrice: 350.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-wardrobe-v3-1.png?v=1784749517",
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
    handle: "golden-extendable-dining-table-modern-luxury-dining-table",
    title: "Golden Extendable Dining Table – Modern Luxury Dining Table",
    price: 350.0,
    compareAtPrice: 370.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gold-dining-table-1.jpg?v=1784747270",
    bestseller: false,
    sale: true
  },
  {
    handle: "harrison-timeless-comfort-arm-chair",
    title: "Harrison Timeless Comfort Arm Chair",
    price: 265.0,
    compareAtPrice: 310.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/harrison-armchair-1.jpg?v=1784747966",
    bestseller: false,
    sale: true
  },
  {
    handle: "modern-coffee-table-stylish-functional-living-room-centerpiece",
    title: "Modern Coffee Table – Stylish & Functional Living Room Centerpiece",
    price: 245.0,
    compareAtPrice: 260.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/coffee-table-v2-1.jpg?v=1784747243",
    bestseller: false,
    sale: true
  },
  {
    handle: "modern-coffee-table-stylish-amp-durable-furniture-for-your-home",
    title: "Modern Dining Table – Stylish & Durable Furniture for Your Home",
    price: 165.0,
    compareAtPrice: 180.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/coffee-table-1.png?v=1784747242",
    bestseller: false,
    sale: true
  },
  {
    handle: "nicole-armchair-in-gray-color-stylish-chenille-fabric-single-seater-modern-durable-accent-chair",
    title: "Nicole Armchair In Grey Colour – Stylish Chenille Fabric Single Seater | Modern & Durable Accent Chair",
    price: 295.0,
    compareAtPrice: 310.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/nicole-gray-armchair-1.jpg?v=1784749817",
    bestseller: false,
    sale: true
  },
  {
    handle: "round-dining-table-modern-dining-table",
    title: "Round Dining Table – Modern Dining Table",
    price: 235.0,
    compareAtPrice: 250.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/round-dining-table-1.jpg?v=1784747270",
    bestseller: false,
    sale: true
  },
  {
    handle: "ruby-alaska-armchair-jumbo-cord-fabric",
    title: "Ruby/Alaska Armchair – Jumbo Cord Fabric | Stylish & Comfortable Seating",
    price: 295.0,
    compareAtPrice: 310.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ruby-armchair-1.png?v=1784749321",
    bestseller: false,
    sale: true
  },
  {
    handle: "shanon-arm-chair-in-black-where-elegance-meets-comfort",
    title: "Shannon Arm Chair in Black – Where Elegance Meets Comfort",
    price: 295.0,
    compareAtPrice: 310.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/shannon-black-armchair-1.jpg?v=1784749402",
    bestseller: false,
    sale: true
  },
  {
    handle: "sloane-grey-velvet-armchair-with-cushion",
    title: "Sloane Grey Velvet Armchair with Cushion – Wide Seat & Modern Design",
    price: 385.0,
    compareAtPrice: 400.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sloane-gray-armchair-1.png?v=1784748230",
    bestseller: false,
    sale: true
  },
  {
    handle: "acelya-black-2-seater-sofa-bed-with-storage",
    title: "Acelya Black 2 Seater Sofa Bed with Storage",
    price: 285.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/acelya-black-sofa-bed-1.png?v=1784749697",
    bestseller: false,
    sale: false
  },
  {
    handle: "acelya-black-sofa-bed-with-storage-bold-style-meets-smart-living",
    title: "Acelya Black Sofa Bed with Storage – Bold Style Meets Smart Living",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/acelya-black-sofa-bed-v2-1.jpg?v=1784749788",
    bestseller: false,
    sale: false
  },
  {
    handle: "alya-sofabed-grey",
    title: "Alya Sofabed Grey",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/alya-gray-sofa-bed-1.jpg?v=1784720363",
    bestseller: false,
    sale: false
  },
  {
    handle: "angel-leon-sofabed-black-amp-silver-with-storage-65-103",
    title: "Angel Leon Sofabed Black & Silver with Storage 65-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/angel-black-sofa-bed-1.jpg?v=1784720486",
    bestseller: false,
    sale: false
  },
  {
    handle: "angel-leon-sofabed-black-and-gold-with-storage-65-103",
    title: "Angel Leon Sofabed Black and Gold with Storage 65-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/angel-black-sofa-bed-v2-1.png?v=1784720487",
    bestseller: false,
    sale: false
  },
  {
    handle: "angel-leon-sofabed-grey-silver-with-storage-52-103",
    title: "Angel Leon Sofabed Grey &  Silver with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/angel-gray-sofa-bed-1.jpg?v=1784720486",
    bestseller: false,
    sale: false
  },
  {
    handle: "angel-leon-sofabed-grey-amp-gold-with-storage-52-103",
    title: "Angel Leon Sofabed Grey & Gold with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/angel-gray-sofa-bed-v2-1.png?v=1784720487",
    bestseller: false,
    sale: false
  },
  {
    handle: "arte-sofabed-blue",
    title: "Arte Sofabed Blue",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/arte-blue-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "beige-cheater-sofa-bed-modern-comfort-in-a-timeless-neutral-tone",
    title: "Beige Chester Sofa Bed – Modern Comfort in a Timeless Neutral Tone",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/beige-chesterfield-sofa-bed-1.png?v=1784747213",
    bestseller: false,
    sale: false
  },
  {
    handle: "beige-istanbul-sofa-bed-modern-comfort-with-elegant-versatility",
    title: "Beige Istanbul Sofa Bed – Modern Comfort with Elegant Versatility",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/istanbul-beige-sofa-bed-1.jpg?v=1784747213",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-chester-sofa-bed-luxury-chesterfield-style-with-modern-comfort",
    title: "Black Chester Sofa Bed – Luxury Chesterfield Style with Modern Comfort",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/black-chesterfield-sofa-bed-1.jpg?v=1784747183",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-leather-sofa-modern-luxury-timeless-comfort",
    title: "Black Leather Sofa – Modern Luxury &  Timeless Comfort",
    price: 330.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/black-sofa-1.png?v=1784725828",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-silver-diamond-sofa-bed-luxury-glamour-modern-comfort",
    title: "Black Silver Diamond Sofa Bed – Luxury Glamour & Modern Comfort",
    price: 330.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/diamond-black-sofa-bed-1.jpg?v=1784726224",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-silver-lion-sofa-luxury-glamour-with-royal-elegance",
    title: "Black Silver Lion Sofa – Luxury Glamour with Royal Elegance",
    price: 330.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-black-sofa-1.jpg?v=1784725855",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-violet-sofa-bed-modern-luxury-versatile-comfort",
    title: "Black Violet Sofa Bed – Modern Luxury &  Versatile Comfort",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/violet-black-sofa-bed-1.png?v=1784726223",
    bestseller: false,
    sale: false
  },
  {
    handle: "charcoal-italian-chesterfield-6-seater-sofa-iconic-design-comfort",
    title: "Charcoal Italian Chesterfield 6 Seater  Sofa  – Iconic Design & Comfort",
    price: 850.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/charcoal-chesterfield-sofa-6-seater-1.jpg?v=1784749817",
    bestseller: false,
    sale: false
  },
  {
    handle: "dizayn-sofabed-grey",
    title: "Dizayn Sofabed Grey",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dizayn-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "eliza-sofabed-grey",
    title: "Eliza Sofabed Grey",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/eliza-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "futuro-faux-leather-sofa-bed-with-storage-65-105-modern-convertible-sleeper-sofa",
    title: "Futuro Faux Leather Sofa Bed with Storage 65–105 | Modern Convertible Sleeper Sofa",
    price: 285.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/futuro-sofa-bed-1.webp?v=1784725799",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-chester-sofa-bed-modern-luxury-timeless-comfort",
    title: "Grey Chester Sofa Bed – Modern Luxury &  Timeless Comfort",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gray-chesterfield-sofa-bed-1.jpg?v=1784747183",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-gold-lion-sofa-luxury-chesterfield-elegance-for-modern-homes",
    title: "Grey Gold Lion Sofa – Luxury Chesterfield Elegance for Modern Homes",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-gray-sofa-v2-1.jpg?v=1784725855",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-istanbul-sofa-modern-luxury-timeless-comfort",
    title: "Grey Istanbul Sofa – Modern Luxury & Timeless Comfort",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/istanbul-gray-sofa-1.jpg?v=1784747214",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-silver-diamond-sofa-bed-luxury-comfort-with-modern-elegance",
    title: "Grey Silver Diamond Sofa Bed – Luxury Comfort with Modern Elegance",
    price: 330.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/diamond-gray-sofa-bed-1.jpg?v=1784747183",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-silver-lion-sofa-luxury-comfort-with-timeless-elegance",
    title: "Grey Silver Lion Sofa – Luxury Comfort with Timeless Elegance",
    price: 330.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-gray-sofa-1.png?v=1784725855",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-tual-sofa-bed-modern-comfort-meets-smart-functionality",
    title: "Grey Tual Sofa Bed – Modern Comfort Meets Smart Functionality",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/tual-gray-sofa-bed-v2-1.png?v=1784726224",
    bestseller: false,
    sale: false
  },
  {
    handle: "grey-violet-sofa-bed-modern-comfort-with-elegant-style-transform",
    title: "Grey Violet Sofa Bed – Modern Comfort with Elegant Style",
    price: 360.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/violet-gray-sofa-bed-1.jpg?v=1784726224",
    bestseller: false,
    sale: false
  },
  {
    handle: "gulf-sofabed-black-with-storage-65-103",
    title: "Gulf Sofabed Black with Storage 65-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gulf-black-sofa-bed-1.webp?v=1784720460",
    bestseller: false,
    sale: false
  },
  {
    handle: "gulf-sofabed-grey-with-storage-52-103",
    title: "Gulf Sofabed Grey with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gulf-gray-sofa-bed-1.webp?v=1784720460",
    bestseller: false,
    sale: false
  },
  {
    handle: "hegel-chesterfield-sofa-bed-in-black-with-hidden-storage",
    title: "Hegel Chester Sofa Bed with Storage 65-103",
    price: 315.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/hegel-chesterfield-sofa-bed-v4-1.webp?v=1784749455",
    bestseller: false,
    sale: false
  },
  {
    handle: "smart-comfort-hegel-gray-chesterfield-2-seater-sofa-bed-with-storage",
    title: "Hegel Chester Sofabed with Storage 52-103",
    price: 315.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/hegel-chesterfield-sofa-bed-1.webp?v=1784748230",
    bestseller: false,
    sale: false
  },
  {
    handle: "hegel-brown-chesterfield-2-seater-sofa-bed-with-storage",
    title: "Hegel Chester Sofabed with Storage 67-103",
    price: 315.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/hegel-chesterfield-sofa-bed-v2-1.webp?v=1784748258",
    bestseller: false,
    sale: false
  },
  {
    handle: "hegel-blue-chesterfield-3-seater-sofa-bed-with-storage",
    title: "Hegel Chester Sofabed with Storage 82–103",
    price: 315.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/hegel-chesterfield-sofa-bed-v3-1.jpg?v=1784749377",
    bestseller: false,
    sale: false
  },
  {
    handle: "kermont-sofabed-black-with-storage",
    title: "Kermont Sofabed Black with Storage",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kermont-black-sofa-bed-1.jpg?v=1784720520",
    bestseller: false,
    sale: false
  },
  {
    handle: "kermont-sofabed-brown-with-storage",
    title: "Kermont Sofabed Brown with Storage",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kermont-brown-sofa-bed-1.jpg?v=1784720520",
    bestseller: false,
    sale: false
  },
  {
    handle: "kermont-sofabed-grey-with-storage",
    title: "Kermont Sofabed Grey with Storage",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kermont-gray-sofa-bed-1.webp?v=1784720520",
    bestseller: false,
    sale: false
  },
  {
    handle: "kuzey-gold-black-sofa-bed-with-storage-luxury-meets-smart-living",
    title: "Kuzey Gold Black Sofa Bed with Storage – Luxury Meets Smart Living",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kuzey-black-sofa-bed-1.jpg?v=1784747996",
    bestseller: false,
    sale: false
  },
  {
    handle: "kuzey-gold-burgundy-3-seater-sofa-bed",
    title: "Kuzey Gold Burgundy Sofa Collection",
    price: 293.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kuzey-burgundy-sofa-1.webp?v=1784749837",
    bestseller: false,
    sale: false
  },
  {
    handle: "kuzey-gold-green-3-seater-sofa-bed-luxury-function-and-timeless-style-in-one",
    title: "Kuzey Gold Green Sofa Collection",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kuzey-green-sofa-1.webp?v=1784749668",
    bestseller: false,
    sale: false
  },
  {
    handle: "lanto-turkish-sofa-bed",
    title: "Lanto Turkish Sofa Bed",
    price: 310.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/WhatsApp_Image_2026-08-07_at_8.42.17_PM.jpg?v=1786135460",
    bestseller: false,
    sale: false
  },
  {
    handle: "lincoln-brown-sofa-bed-with-storage-3-seater-comfort-for-modern-living",
    title: "Lincoln Sofabed Brown with Storage 67-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lincoln-brown-sofa-bed-1.webp?v=1784749517",
    bestseller: false,
    sale: false
  },
  {
    handle: "lincoln-sofabed-grey-with-storage-52-103",
    title: "Lincoln Sofabed Grey with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lincoln-gray-sofa-bed-1.jpg?v=1784725799",
    bestseller: false,
    sale: false
  },
  {
    handle: "loft-love-set-2-seat-sofa-bed-modern-comfort-smart-living",
    title: "Loft Love Set 2 Seat Sofa Bed – Modern Comfort & Smart Living",
    price: 499.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/loft-sofa-bed-1.png?v=1784725828",
    bestseller: false,
    sale: false
  },
  {
    handle: "luca-l-shape-sofa-bed-storage",
    title: "Luca L-Shape Sofa Bed with Storage gray",
    price: 600.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/671325725_122109435537286493_3146384028562863155_n.jpg?v=1786131843",
    bestseller: false,
    sale: false
  },
  {
    handle: "smart-style-for-any-room-malisa-sofa-bed-in-sleek-black",
    title: "Malisa Sofabed Black with Storage",
    price: 346.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/malisa-black-sofa-bed-1.jpg?v=1784748230",
    bestseller: false,
    sale: false
  },
  {
    handle: "malisa-sofabed-grey-with-storage",
    title: "Malisa Sofabed Grey with Storage",
    price: 310.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/malisa-gray-sofa-bed-1.jpg?v=1784720643",
    bestseller: false,
    sale: false
  },
  {
    handle: "malta-3-seater-sofa-bed-with-storage-sleek-design-smart-living-in-grey",
    title: "Malta Grey Sofabed with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/malta-gray-sofa-bed-1.png?v=1784749321",
    bestseller: false,
    sale: false
  },
  {
    handle: "malta-3-seater-sofa-bed-with-storage-sleek-design-smart-living-in-black",
    title: "Malta Sofabed Black with Storage 65-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/malta-black-sofa-bed-1.jpg?v=1784749402",
    bestseller: false,
    sale: false
  },
  {
    handle: "melis-sofabed-grey",
    title: "Melis Sofabed Grey",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/melis-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "new-black-leather-sofa-bed-with-storage-65-105-modern-comfort-smart-living",
    title: "New Black Leather Sofa Bed with Storage (65–105) – Modern Comfort &  Smart Living",
    price: 328.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/black-sofa-bed-1.webp?v=1784725828",
    bestseller: false,
    sale: false
  },
  {
    handle: "new-gray-leather-1-seater-sofa-bed-sleek-comfort-in-a-compact-form",
    title: "New Grey Leather 1-Seater Sofa Bed – Sleek Comfort in a Compact Form",
    price: 240.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/gray-sofa-bed-v2-1.jpg?v=1784749455",
    bestseller: false,
    sale: false
  },
  {
    handle: "orion-turkish-sofa-bed",
    title: "Orion Turkish Sofa Bed",
    price: 310.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lanto_oriano_sofa_beds_5_61c99b74-d3d2-4c63-b67b-be1ed9a4429b.jpg?v=1786136242",
    bestseller: false,
    sale: false
  },
  {
    handle: "seren-sofabed-black-with-storage-65-103",
    title: "Seren Sofabed Black with Storage 65-103",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/seren-black-sofa-bed-1.jpg?v=1784720617",
    bestseller: false,
    sale: false
  },
  {
    handle: "seren-sofabed-grey-with-storage-52-103",
    title: "Seren Sofabed Grey with Storage 52-103",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/seren-gray-sofa-bed-1.png?v=1784720617",
    bestseller: false,
    sale: false
  },
  {
    handle: "sleek-smart-malisa-sofa-bed-in-blue-with-hidden-storage",
    title: "Sleek & Smart: Malisa Sofa Bed in Blue with Hidden Storage",
    price: 346.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/malisa-blue-sofa-bed-1.jpg?v=1784747995",
    bestseller: false,
    sale: false
  },
  {
    handle: "smart-stylish-acelya-gray-sofa-bed-with-storage",
    title: "Smart & Stylish: Acelya Grey Sofa Bed with Storage",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/acelya-gray-sofa-bed-1.jpg?v=1784749668",
    bestseller: false,
    sale: false
  },
  {
    handle: "smart-comfort-gray-d-arm-2-seater-sofa-bed",
    title: "Smart Comfort: Grey D-Arm 2-Seater Sofa Bed",
    price: 290.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/d-arm-gray-sofa-bed-1.jpg?v=1784749545",
    bestseller: false,
    sale: false
  },
  {
    handle: "smart-comfort-gray-d-arm-3-seater-sofa-bed-with-built-in-storage",
    title: "Smart Comfort: Grey D-Arm Sofa Bed with Built-In Storage",
    price: 310.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/d-arm-gray-sofa-bed-v2-1.jpg?v=1784749610",
    bestseller: false,
    sale: false
  },
  {
    handle: "sofya-sofabed-black-with-storage",
    title: "Sofya Sofabed Black with Storage",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sofya-black-sofa-bed-1.jpg?v=1784720617",
    bestseller: false,
    sale: false
  },
  {
    handle: "modern-grey-sofa-bed-with-hidden-storage",
    title: "Sofya Sofabed Grey with Storage",
    price: 305.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sofya-gray-sofa-bed-1.webp?v=1784720591",
    bestseller: false,
    sale: false
  },
  {
    handle: "still-sofabed-grey",
    title: "Still Sofa bed Grey",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/still-gray-sofa-bed-1.png?v=1784720362",
    bestseller: false,
    sale: false
  },
  {
    handle: "tual-sofabed-black-with-storage-65-103",
    title: "Tual Sofabed Black with Storage 65-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/tual-black-sofa-bed-1.jpg?v=1784720591",
    bestseller: false,
    sale: false
  },
  {
    handle: "tual-sofabed-blue-with-storage-82-103",
    title: "Tual Sofabed Blue with Storage 82-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/tual-blue-sofa-bed-1.jpg?v=1784720566",
    bestseller: false,
    sale: false
  },
  {
    handle: "tual-sofabed-brown-with-storage-67-103",
    title: "Tual Sofabed Brown with Storage 67-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/tual-brown-sofa-bed-1.jpg?v=1784720591",
    bestseller: false,
    sale: false
  },
  {
    handle: "tual-sofabed-grey-with-storage-52-103",
    title: "Tual Sofabed Grey with Storage 52-103",
    price: 317.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/tual-gray-sofa-bed-1.jpg?v=1784720566",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-sofabed-black-with-storage-65-103",
    title: "Verona Sofabed Black with Storage 65-103",
    price: 328.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-black-sofa-bed-1.jpg?v=1784720566",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-sofabed-brown-with-storage-67-103",
    title: "Verona Sofabed Brown with Storage 67-103",
    price: 328.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-brown-sofa-bed-1.jpg?v=1784720543",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-sofabed-grey-with-storage-52-103",
    title: "Verona Sofabed Grey with Storage 52-103",
    price: 328.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-gray-sofa-bed-1.jpg?v=1784720543",
    bestseller: false,
    sale: false
  },
  {
    handle: "viva-sofabed-black-with-storage-65-103",
    title: "Viva Sofabed Black with Storage 65-103",
    price: 322.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/viva-black-sofa-bed-1.jpg?v=1784720459",
    bestseller: false,
    sale: false
  },
  {
    handle: "viva-sofabed-grey-with-storage-52-103",
    title: "Viva Sofabed Grey with Storage 52-103",
    price: 322.0,
    category: "Sofa Beds",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/viva-gray-sofa-bed-1.png?v=1784720427",
    bestseller: false,
    sale: false
  },
  {
    handle: "arctic-corner-sofa-bed-storage",
    title: "Arctic Corner Sofa Bed with Storage – Modern L-Shape Convertible Sofa (Grey, Black, Cream)",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/Arcticsofabed_6.jpg?v=1786126629",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashton-5-seater-corner-sofa-bed-with-or-without-stool",
    title: "Ashton 5 Seater Corner Sofa Scattered back cushions",
    price: 850.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashton-corner-sofa-scattered-back-1.webp?v=1784748257",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashton-5-seater-corner-sofa-bed",
    title: "Ashton 5 Seater Corner high back Sofa",
    price: 900.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashton-corner-sofa-high-back-1.jpg?v=1784749291",
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
    handle: "ashwin-32-seater-scattered-back-corner-sofa",
    title: "Ashwin 3+2 Seater Scattered Back Corner Sofa",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashwin-corner-sofa-scattered-back-1.jpg?v=1784747938",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashwin-5-seater-high-back-corner-sofa",
    title: "Ashwin 5-Seater High Back Corner Sofa",
    price: 650.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashwin-corner-sofa-high-back-v2-1.jpg?v=1784747966",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashwin-5-seater-corner-sofa",
    title: "Ashwin 5-Seater Scattered Back Corner Sofa",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashwin-corner-sofa-scattered-back-v2-1.jpg?v=1784747965",
    bestseller: false,
    sale: false
  },
  {
    handle: "dino-5-seater-corner-sofa-jumbo-cord",
    title: "Dino 5 Seater Corner Sofa–Jumbo Cord",
    price: 500.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dino-corner-sofa-5-seater-1.jpg?v=1784749668",
    bestseller: false,
    sale: false
  },
  {
    handle: "dylan-sofa-32-seater-jumbo-cord-copy",
    title: "Dylan Sofa corner 4 seater Jumbo cord",
    price: 400.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dylan-corner-sofa-4-seater-1.jpg?v=1784749322",
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
    handle: "harrison-5-seater-corner-sofa",
    title: "Harrison 5 Seater Corner Sofa | Modern Fabric | Sofa for Living Room",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/harrison-corner-sofa-5-seater-1.webp?v=1784748204",
    bestseller: false,
    sale: false
  },
  {
    handle: "nicole-32-seater-chesterfield-corner-sofa-elegant-comfortable-fabric-couch",
    title: "Nicole 3+2 Seater Chesterfield Corner Sofa – Elegant, Comfortable Fabric Couch",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/nicole-chesterfield-corner-sofa-1.webp?v=1784750680",
    bestseller: false,
    sale: false
  },
  {
    handle: "nicole-5-seater-chesterfield-corner-sofa-elegant-comfortable-fabric-couch-in-all-colors",
    title: "Nicole 5-Seater Chesterfield Corner Sofa – Elegant, Comfortable Fabric Couch",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/nicole-corner-sofa-1.jpg?v=1784750036",
    bestseller: false,
    sale: false
  },
  {
    handle: "oakland-5-seater-corner-leather-sofa",
    title: "Oakland 5 Seater Corner Leather Sofa",
    price: 750.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/oakland-corner-sofa-5-seater-1.png?v=1784747910",
    bestseller: false,
    sale: false
  },
  {
    handle: "ruby-alaska-5-seater-corner-sofa-velvet-luxury-cornered-to-perfection",
    title: "Ruby/Alaska 5 Seater Corner Sofa – Velvet Luxury, Cornered to Perfection",
    price: 600.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ruby-corner-sofa-5-seater-1.jpg?v=1784749377",
    bestseller: false,
    sale: false
  },
  {
    handle: "shannon-luxury-5-seater-corner-sofa-modern-living-room-sofa",
    title: "Shannon Luxury 5 Seater Corner Sofa | Modern Living Room Sofa",
    price: 550.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/shannon-corner-sofa-5-seater-1.jpg?v=1784749517",
    bestseller: false,
    sale: false
  },
  {
    handle: "style-meets-comfort-sloane-grey-velvet-corner-sofa-5-seater-luxury-for-modern-homes",
    title: "Style Meets Comfort – Sloane Grey Velvet Corner Sofa, 5 Seater Luxury for Modern Homes",
    price: 750.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sloane-gray-corner-sofa-5-seater-1.jpg?v=1784749292",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-so",
    title: "Verona corner sofa 5 seater",
    price: 550.0,
    category: "Corner Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-corner-sofa-5-seater-1.jpg?v=1784749455",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashton-32-seater-sofa-high-back-cushions",
    title: "Ashton 3+2 Seater  Sofa High Back cushions",
    price: 650.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashton-sofa-1.webp?v=1784748204",
    bestseller: false,
    sale: false
  },
  {
    handle: "ashton-32-seater-sofa-scattered-back-cushions",
    title: "Ashton 3+2 Seater  Sofa Scattered back cushions",
    price: 850.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ashton-sofa-v2-1.jpg?v=1784748204",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-gold-lion-sofa-luxury-royal-elegance-for-modern-living",
    title: "Black Gold Lion Sofa – Luxury Royal Elegance for Modern Living",
    price: 360.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-black-sofa-v2-1.png?v=1784725874",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-istanbul-sofa-modern-luxury-with-timeless-elegance",
    title: "Black Istanbul Sofa – Modern Luxury with Timeless Elegance",
    price: 360.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/istanbul-black-sofa-1.jpg?v=1784747242",
    bestseller: false,
    sale: false
  },
  {
    handle: "blue-lion-sofa-modern-luxury-timeless-comfort",
    title: "Blue Lion Sofa – Modern Luxury & Timeless Comfort",
    price: 360.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-blue-sofa.png?v=1784725856",
    bestseller: false,
    sale: false
  },
  {
    handle: "cream-bej-lion-sofa-timeless-luxury-elegant-comfort",
    title: "Cream Bej Lion Sofa – Timeless Luxury & Elegant Comfort",
    price: 360.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-cream-sofa-1.jpg?v=1784725874",
    bestseller: false,
    sale: false
  },
  {
    handle: "dino-32-seater-sofa-jumbo-cord",
    title: "Dino 3+2 Seater Sofa–Jumbo Cord",
    price: 499.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dino-sofa-1.webp?v=1784749726",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-sofa-set",
    title: "Dylan Sofa 3+2 seater Jumbo cord",
    price: 350.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dylan-sofa-1.jpg?v=1784750102",
    bestseller: false,
    sale: false
  },
  {
    handle: "harrison-32-seater-sofa-modern-fabric-sofa-for-living-room",
    title: "Harrison 3+2 Seater  Sofa | Modern Fabric | Sofa for Living Room",
    price: 600.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/harrison-sofa-1.webp?v=1784748203",
    bestseller: false,
    sale: false
  },
  {
    handle: "kuzey-grey-gold-sofa-collection",
    title: "Kuzey Grey &  Gold Sofa Collection",
    price: 317.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/kuzey-gray-sofa-1.webp?v=1784725799",
    bestseller: false,
    sale: false
  },
  {
    handle: "black-leather-electric-recliner-sofa-set",
    title: "Luxury Black Leather Electric Recliner Sofa Set with LED Lights & Cup Holders – 2 & 3 Seater Cinema Style Couch",
    price: 799.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/Electricreclinersofa_3.jpg?v=1786128715",
    bestseller: false,
    sale: false
  },
  {
    handle: "oakland-sofa-32-seater-faux-leather",
    title: "Oakland Sofa – Faux Leather",
    price: 550.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/oakland-sofa-1.jpg?v=1784747883",
    bestseller: false,
    sale: false
  },
  {
    handle: "rubyalaska-32-seater-sofa-velvet-luxury-cornered-to-perfection",
    title: "Ruby/Alaska 3+2 Seater Sofa – Velvet Luxury, Cornered to Perfection",
    price: 650.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ruby-sofa-1.jpg?v=1784749350",
    bestseller: false,
    sale: false
  },
  {
    handle: "shannon-luxury32-seater-sofa-modern-living-room-sofa",
    title: "Shannon Luxury 3+2 Seater Sofa | Modern Living Room Sofa",
    price: 550.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/shannon-sofa-1.jpg?v=1784749455",
    bestseller: false,
    sale: false
  },
  {
    handle: "sloane-plush-velvet-32-seater-sofa-set-elegant-comfortable-seating",
    title: "Sloane Plush Velvet 3+2 Seater Sofa Set | Elegant & Comfortable Seating",
    price: 750.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sloane-sofa-1.webp?v=1784748258",
    bestseller: false,
    sale: false
  },
  {
    handle: "teal-lion-sofa-luxury-velvet-comfort-with-bold-modern-elegance",
    title: "Teal Lion Sofa – Luxury Velvet Comfort with Bold Modern Elegance",
    price: 330.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/lion-teal-sofa-1.jpg?v=1784725828",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-corner-sofa-32-seater",
    title: "Verona sofa 3+2 seater",
    price: 550.0,
    category: "Sofas",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-sofa-1.jpg?v=1784749402",
    bestseller: false,
    sale: false
  },
  {
    handle: "1-door-wardrobe-plan",
    title: "1 Door Wardrobe with Hanging Rail and Shelf",
    price: 100.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/1-door-wardrobe-1.jpg?v=1784750064",
    bestseller: false,
    sale: false
  },
  {
    handle: "combi-2-door-wardrobe-1-mirror-3-bottom-drawers",
    title: "2 Door Wardrobe with 1 Mirror, 3 Bottom Drawers and Inside Shelves Combi",
    price: 190.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-mirror-wardrobe-1.jpg?v=1784749696",
    bestseller: false,
    sale: false
  },
  {
    handle: "2-door-wardrobe-plan",
    title: "2 Door Wardrobe with Shelving and Hanging Rail",
    price: 120.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-wardrobe-plan-1.jpg?v=1784749755",
    bestseller: false,
    sale: false
  },
  {
    handle: "3-door-wardrobe-2-mirrors-and-2-bottom-draws",
    title: "3 Door Wardrobe with 2 Mirrors and 2 Bottom Drawers",
    price: 250.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/3-door-mirror-wardrobe-1.png?v=1784747775",
    bestseller: false,
    sale: false
  },
  {
    handle: "3-door-wardrobe-full-set",
    title: "3 door wardrobe full set",
    price: 350.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/3-door-wardrobe-1.png?v=1784747747",
    bestseller: false,
    sale: false
  },
  {
    handle: "combi-3-door-wardrobe-with-1-mirror-3-bottom-drawers",
    title: "3 door wardrobe with 1 mirror, 3 bottom drawers",
    price: 250.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/3-door-mirror-wardrobe-v2-1.jpg?v=1784749610",
    bestseller: false,
    sale: false
  },
  {
    handle: "4-door-wardrobe-set",
    title: "4 Door Wardrobe Bedroom Set – with Chest of Drawers & Bedside Cabinet",
    price: 400.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/4-door-wardrobe-1.png?v=1784747719",
    bestseller: false,
    sale: false
  },
  {
    handle: "4-door-wardrobe-with-2-mirrors-amp-4-bottom-drawers",
    title: "4 Door Wardrobe with 2 Mirrors and 4 Bottom Drawers",
    price: 300.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/4-door-mirror-wardrobe-1.png?v=1784747719",
    bestseller: false,
    sale: false
  },
  {
    handle: "4-door-wardrobe-plan",
    title: "4 Door Wardrobe with Shelving and Hanging Rail",
    price: 240.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/4-door-wardrobe-plan-1.png?v=1784747746",
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
    handle: "5-door-wardrobe-with-3-mirror-and-4-bottom-draws",
    title: "5 Door Wardrobe with 3 Mirrors and 4 Bottom Drawers",
    price: 450.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/5-door-mirror-wardrobe-v2-1.png?v=1784747690",
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
    handle: "6-door-dressing-wardrobe-with-top-boxes",
    title: "6 Door Dressing Wardrobe with Top Boxes",
    price: 550.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-wardrobe-boxes-1.png?v=1784747601",
    bestseller: false,
    sale: false
  },
  {
    handle: "6-door-wardrobe-full-bedroom-set",
    title: "6 Door Wardrobe Full Bedroom Set",
    price: 520.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-wardrobe-v2-1.jpg?v=1784747629",
    bestseller: false,
    sale: false
  },
  {
    handle: "6-door-wardrobe-with-2-mirrors-and-2-bottom-draws",
    title: "6 Door Wardrobe with 2 Mirrors and 2 Bottom Drawers",
    price: 400.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-mirror-wardrobe-v2-1.png?v=1784747658",
    bestseller: false,
    sale: false
  },
  {
    handle: "6-door-wardrobe-with-top-boxes-drawers-and-mirrors",
    title: "6 Door Wardrobe with Top Boxes, Drawers and Mirrors",
    price: 520.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/6-door-mirror-wardrobe-1.png?v=1784747658",
    bestseller: false,
    sale: false
  },
  {
    handle: "8-door-wardrobe-plan",
    title: "8 Door Wardrobe with Hanging Rail and Shelving",
    price: 500.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/8-door-wardrobe-plan-1.png?v=1784747628",
    bestseller: false,
    sale: false
  },
  {
    handle: "8-door-wardrobe-with-mirrors-and-bottom-draws",
    title: "8 Door Wardrobe with Top Boxes",
    price: 720.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/8-door-wardrobe-boxes-1.png?v=1784747628",
    bestseller: false,
    sale: false
  },
  {
    handle: "8-door-wardrobe",
    title: "8 Door Wardrobe – Large Storage Design",
    price: 600.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/8-door-wardrobe-v2-1.jpg?v=1784750161",
    bestseller: false,
    sale: false
  },
  {
    handle: "2-door-wardrobe-gent-full-set",
    title: "Classic 2 Door Wardrobe Bedroom Set – with Chest of Drawers & Bedside Cabinet",
    price: 250.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/2-door-wardrobe-1.png?v=1784747806",
    bestseller: false,
    sale: false
  },
  {
    handle: "florence-sliding-door-wardrobe-modern-elegance-with-smart-storage",
    title: "Florence Sliding Door Wardrobe – Modern Elegance with Smart Storage",
    price: 430.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sliding-wardrobe-1.png?v=1784747542",
    bestseller: false,
    sale: false
  },
  {
    handle: "lyon-slide-door-wardrobe",
    title: "Lyon Slide door wardrobe",
    price: 250.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sliding-wardrobe-v2-1.jpg?v=1784749545",
    bestseller: false,
    sale: false
  },
  {
    handle: "milan-slide-door-wardrobe",
    title: "Milan Slide door wardrobe",
    price: 220.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sliding-wardrobe-v5-1.jpg?v=1784749817",
    bestseller: false,
    sale: false
  },
  {
    handle: "oslo-slide-door-wardrobe",
    title: "Oslo Slide door wardrobe",
    price: 270.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sliding-wardrobe-v4-1.jpg?v=1784749726",
    bestseller: false,
    sale: false
  },
  {
    handle: "venice-slide-door-wardrobe",
    title: "Venice Slide door wardrobe",
    price: 270.0,
    category: "Wardrobes",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/sliding-wardrobe-v3-1.jpg?v=1784749638",
    bestseller: false,
    sale: false
  },
  {
    handle: "ambassador-luxury-beds",
    title: "Ambassador Luxury Beds",
    price: 380.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/ambassador-bed-1.jpg?v=1784747860",
    bestseller: false,
    sale: false
  },
  {
    handle: "arizona-luxury-beds",
    title: "Arizona Luxury Beds",
    price: 235.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/arizona-bed-1.webp?v=1784747859",
    bestseller: false,
    sale: false
  },
  {
    handle: "bedside-table-3-level",
    title: "Chester 3 Drawer Bedside Table",
    price: 30.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/WhatsAppImage2023-12-02at4.59.21PM.png?v=1784989192",
    bestseller: false,
    sale: false
  },
  {
    handle: "cube-luxury-beds",
    title: "Cube Luxury Beds",
    price: 175.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/cube-bed-1.jpg?v=1784747859",
    bestseller: false,
    sale: false
  },
  {
    handle: "divan-bed",
    title: "Divan Bed",
    price: 150.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/divan-bed-1.jpg?v=1784750245",
    bestseller: false,
    sale: false
  },
  {
    handle: "florida-monaco-bed",
    title: "Florida / Monaco Bed",
    price: 175.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/florida-bed-1.jpg?v=1784750218",
    bestseller: false,
    sale: false
  },
  {
    handle: "hilton-bliss-blitz-chesterfield-bed",
    title: "Hilton / Bliss / Blitz Chesterfield Bed",
    price: 190.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/hilton-chesterfield-bed-1.jpg?v=1784750701",
    bestseller: false,
    sale: false
  },
  {
    handle: "line-bumper-luxury-beds",
    title: "Line Bumper Luxury Beds",
    price: 200.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/line-bumper-bed-1.png?v=1784747859",
    bestseller: false,
    sale: false
  },
  {
    handle: "oxford-wingback-luxury-beds",
    title: "Oxford Wingback Luxury Beds",
    price: 260.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/oxford-bed.png?v=1784747859",
    bestseller: false,
    sale: false
  },
  {
    handle: "trio-triple-sleeper-bunk-bed-with-mattresses",
    title: "Solid Wooden Detachable Trio Bunk Bed with 2 Mattresses – Space Saving, Convertible Design",
    price: 420.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/trio-bunk-bed-1.jpg?v=1784750296",
    bestseller: false,
    sale: false
  },
  {
    handle: "wingback-bed",
    title: "Wingback Bed",
    price: 210.0,
    category: "Beds & Mattresses",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/wingback-bed-1.jpg?v=1784750270",
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
    compareAtPrice: 270.0,
    category: "Outdoor Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/rattan-lounge-set-1.jpg?v=1784720361",
    bestseller: false,
    sale: false
  },
  {
    handle: "chester-3-drawer-chest-of-drawers",
    title: "Chester Chest of Drawers – 3 to 7 Drawer",
    price: 70.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/WhatsAppImage2024-06-10at12.13.22AM_5.png?v=1784839948",
    bestseller: false,
    sale: false
  },
  {
    handle: "dino-jumbo-cord-armchair-grey-or-beige-cozy-stylish-accent-seating",
    title: "Dino Jumbo Cord Armchair – Grey or Beige | Cosy & Stylish Accent Seating",
    price: 310.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/dino-armchair-1.jpg?v=1784749545",
    bestseller: false,
    sale: false
  },
  {
    handle: "extendable-dining-table-6-velvet-chairs-set",
    title: "Extendable Dining Table &  6 Velvet Chairs Set",
    price: 400.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/extendable-dining-set-1.jpg?v=1784747541",
    bestseller: false,
    sale: false
  },
  {
    handle: "extendable-dining-table-chairs-set-new-arrival",
    title: "Extendable Marble-Effect Dining Table & 6 Velvet Chairs Set",
    price: 300.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/extendable-dining-set-v2-1.jpg?v=1784750349",
    bestseller: false,
    sale: false
  },
  {
    handle: "luxury-chesterfield-armchair-classic-tufted-design-timeless-comfort",
    title: "Luxury Chesterfield Armchair – Classic Tufted Design & Timeless Comfort",
    price: 430.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/chesterfield-armchair-1.webp?v=1784750693",
    bestseller: false,
    sale: false
  },
  {
    handle: "mattress",
    title: "Mattress – Sprung, Full Foam & Pocket Spring, All UK Sizes",
    price: 105.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/mattress-1.webp?v=1784750192",
    bestseller: false,
    sale: false
  },
  {
    handle: "memory-foam-mattress-uk",
    title: "Memory Foam Mattress – Pressure Relief",
    price: 129.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/IMG-20220817-WA0087.jpg?v=1785845703",
    bestseller: false,
    sale: false
  },
  {
    handle: "oakland-sofa-set-2-seater-3-seater-corner-sofa-armchair-brown-fabric-fullback-sofa-set-3-seater-1-armchair-copy-2",
    title: "Oakland Armchair – Vintage Elegance Meets Modern Comfort",
    price: 320.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/oakland-armchair-1.jpg?v=1784750133",
    bestseller: false,
    sale: false
  },
  {
    handle: "turkish-dining-table-with-6-chairs",
    title: "Turkish Dining Table with 6 Chairs",
    price: 285.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/turkish-dining-table-1.png?v=1784750035",
    bestseller: false,
    sale: false
  },
  {
    handle: "verona-arm-chair-cuddle-chair",
    title: "Verona Arm Chair & Cuddle Chair",
    price: 300.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/verona-armchair-1.jpg?v=1784749376",
    bestseller: false,
    sale: false
  },
  {
    handle: "wooden-dining-table",
    title: "Wooden Dining Table",
    price: 440.0,
    category: "Furniture",
    image: "https://cdn.shopify.com/s/files/1/1008/4565/0291/files/wooden-dining-table-1.png?v=1784747541",
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
