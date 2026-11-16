import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    companyTitle: {
      type: String,
      default: 'Alhisan General Trading Company',
    },
    bio: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

leadershipSchema.statics.seedDefaultLeaders = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    const defaults = [
      {
        name: 'Naser Almazrouie',
        role: 'Chairman',
        companyTitle: 'Alhisan General Trading Company',
        bio: 'Guiding the enterprise with strategic vision and deep commercial stewardship across the GCC and international markets.',
        photoUrl: '/assets/leadership/naser-almazrouie.jpg',
        order: 1,
        active: true,
      },
      {
        name: 'Muhammad Almazrouie',
        role: 'Chief Executive Officer (CEO)',
        companyTitle: 'Alhisan General Trading Company',
        bio: 'Spearheading day-to-day corporate operations, multinational trade partnerships, and customer-first supply fulfillment.',
        photoUrl: '/assets/leadership/muhammad-almazrouie.jpg',
        order: 2,
        active: true,
      },
      {
        name: 'Marwan Israfeel',
        role: 'General Manager',
        companyTitle: 'Alhisan General Trading Company',
        bio: 'Managing trade execution, client relations, logistics coordination, and operational excellence across the UAE.',
        photoUrl: '/assets/leadership/marwan-israfeel.jpg',
        order: 3,
        active: true,
      },
    ];
    await this.insertMany(defaults);
    console.log('[Leadership] 3 Executive Leaders seeded in MongoDB Atlas.');
  }
};

export const Leadership = mongoose.model('Leadership', leadershipSchema);
