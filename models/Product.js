import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    gradePurity: {
      type: String,
      default: 'Commercial & Industrial Grade',
    },
    packagingOptions: {
      type: [String],
      default: ['25kg Bags', '50kg Bags', '1 Ton Jumbo Bags', 'Bulk Vessel Delivery'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    specifications: [
      {
        property: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.statics.seedDefaultProducts = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    const defaults = [
      {
        name: 'Industrial & Pure Salt',
        slug: 'salt',
        category: 'Chemical & Industrial Minerals',
        shortDescription: 'High-purity sodium chloride for industrial chemical processing, de-icing, drilling fluids, and water softening operations.',
        gradePurity: 'NaCl ≥ 99.2%',
        packagingOptions: ['25kg Woven Bags', '50kg Bags', '1 Ton Jumbo Bulk Bags'],
        imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=1200&q=80',
        specifications: [
          { property: 'Chemical Formula', value: 'NaCl' },
          { property: 'Purity', value: '≥ 99.2%' },
          { property: 'Moisture', value: '≤ 0.2%' },
          { property: 'Country of Origin', value: 'UAE / GCC / International' },
        ],
        featured: true,
        order: 1,
      },
      {
        name: 'Dense & Light Soda Ash',
        slug: 'soda-ash',
        category: 'Chemical Raw Materials',
        shortDescription: 'Industrial grade sodium carbonate for flat and container glass production, detergents, paper manufacturing, and metallurgy.',
        gradePurity: 'Na2CO3 ≥ 99.2%',
        packagingOptions: ['50kg Laminated Bags', '1,000kg Bulk Big Bags', 'Pneumatic Tanker Trucks'],
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        specifications: [
          { property: 'Chemical Formula', value: 'Na2CO3' },
          { property: 'Bulk Density (Dense)', value: '0.90 – 1.05 g/cm³' },
          { property: 'Bulk Density (Light)', value: '0.50 – 0.65 g/cm³' },
          { property: 'Total Alkalinity', value: '≥ 99.2% min' },
        ],
        featured: true,
        order: 2,
      },
      {
        name: 'Precipitated & Ground Calcium Carbonate',
        slug: 'calcium-carbonate',
        category: 'Mineral Fillers & Extenders',
        shortDescription: 'Ultra-fine ground (GCC) and precipitated (PCC) calcium carbonate for polymer compounding, paints, paper coatings, and plastics.',
        gradePurity: 'CaCO3 ≥ 98.5%',
        packagingOptions: ['25kg Multi-ply Paper Bags', '1 Ton Flexible Intermediate Bulk Containers'],
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80',
        specifications: [
          { property: 'Chemical Formula', value: 'CaCO3' },
          { property: 'Whiteness', value: '≥ 95% Hunter' },
          { property: 'Particle Size (d50)', value: '2.5µm – 15µm available' },
        ],
        featured: true,
        order: 3,
      },
      {
        name: 'Bulk Food Commodities',
        slug: 'food',
        category: 'Agri-Food Commodities',
        shortDescription: 'Commercial-scale supply of long-grain rice, refined cane sugars, wheat flour, and edible cooking oils compliant with UAE food standards.',
        gradePurity: 'Food Grade Premium Export Standards',
        packagingOptions: ['20kg Jute Bags', '50kg Polypropylene Bags', 'Flexitanks (Oils)'],
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
        specifications: [
          { property: 'Certifications', value: 'Halal, ISO 22000, HACCP Compliant' },
          { property: 'Moisture Content', value: '≤ 13.5% (Grains)' },
        ],
        featured: true,
        order: 4,
      },
      {
        name: 'Wholesale Spices & Seasonings',
        slug: 'spices',
        category: 'Agri-Food Commodities',
        shortDescription: 'Whole and ground aromatic spices sourced directly from premier global agricultural regions for GCC food processing and packaging.',
        gradePurity: 'Natural Pure Export Quality',
        packagingOptions: ['25kg Clean Jute Bags', 'Vacuum Hermetic Master Cartons'],
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
        specifications: [
          { property: 'Varieties', value: 'Black Pepper, Cumin, Cardamom, Cloves, Turmeric' },
          { property: 'Processing', value: 'Sun-dried / Steam Sterilized' },
        ],
        featured: true,
        order: 5,
      },
    ];
    await this.insertMany(defaults);
    console.log('[Catalog] 5 Core Trading Categories seeded in MongoDB Atlas.');
  }
};

export const Product = mongoose.model('Product', productSchema);
