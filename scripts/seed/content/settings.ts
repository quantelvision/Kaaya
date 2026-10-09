export const siteSettings = {
  storeName: 'Kaaya',
  popularSearches: [
    'Oversized hoodie',
    'Anarkali',
    'Cargo pants',
    'Linen shirt',
    'Sneakers',
    'Satin',
  ],
  freeShippingThreshold: 1499,
  shippingFee: 99,
  codFee: 49,
  lowStockThreshold: 3,
  returnWindowDays: 7,
  manifestoLines: [
    'Made to be worn, not saved for later.',
    'Heavy cotton that softens with every wash.',
    'Dressed for the long wedding day and the morning after.',
    'Fewer pieces, worn more often.',
    'Cut and stitched in India, from Tiruppur to Agra.',
  ],
}

export const loyaltySettings = {
  earnRupeesPerPoint: 20,
  pointValueRupees: 1,
  maxRedeemPercent: 20,
  minRedeemPoints: 100,
  startingPoints: 640,
  tiers: [
    {
      key: 'insider',
      name: 'Insider',
      minPoints: 0,
      perk: 'Earn 1 point for every ₹20 you spend.',
    },
    { key: 'muse', name: 'Muse', minPoints: 1500, perk: 'Early access to every new edit.' },
    {
      key: 'icon',
      name: 'Icon',
      minPoints: 5000,
      perk: 'Priority return pickups and a styling call each season.',
    },
  ],
}

export const festiveSale = {
  isActive: true,
  title: 'The Festive Edit Sale',
  subtitle: 'Up to 30% off ethnic and party wear',
  editSlug: 'festive-edit',
  mode: 'rolling' as const,
  rollingHours: 62,
}
