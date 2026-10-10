export const rooms = [
  {
    slug: "meria-standard",
    name: "Meria Standard",
    category: "Standard Room",
    description:
      "A comfortable retreat designed for a peaceful and relaxing stay at Haya Resort.",
    image: "/images/meria-standard.jpg",
    gallery: [
      "/images/meria-standard.jpg",
      "/images/meria-standard-2.jpg",
      "/images/meria-standard-3.jpg",
    ],
    guests: 2,
    bed: "1 King Bed",
    size: "Room size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Complimentary toiletries",
    ],
  },

  {
    slug: "kala-standard",
    name: "Kala Standard",
    category: "Standard Room",
    description:
      "A serene accommodation offering comfort and everything you need for a relaxing Haya experience.",
    image: "/images/kala-standard.jpg",
    gallery: [
      "/images/kala-standard.jpg",
      "/images/kala-standard-2.jpg",
      "/images/kala-standard-3.jpg",
    ],
    guests: 2,
    bed: "1 King Bed",
    size: "Room size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Complimentary toiletries",
    ],
  },

  {
    slug: "kala-deluxe",
    name: "Kala Deluxe",
    category: "Deluxe Room",
    description:
      "Enjoy an elevated stay with additional comfort and a beautifully designed private space.",
    image: "/images/kala-deluxe.jpg",
    gallery: [
      "/images/kala-deluxe.jpg",
      "/images/kala-deluxe-2.jpg",
      "/images/kala-deluxe-3.jpg",
    ],
    guests: 2,
    bed: "1 King Bed",
    size: "Room size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Complimentary toiletries",
    ],
  },

  {
    slug: "yasmin-deluxe",
    name: "Yasmin Deluxe",
    category: "Deluxe Room",
    description:
      "A refined retreat combining privacy, comfort and the natural atmosphere of Haya.",
    image: "/images/yasmin-deluxe.jpg",
    gallery: [
      "/images/yasmin-deluxe.jpg",
      "/images/yasmin-deluxe-2.jpg",
      "/images/yasmin-deluxe-3.jpg",
    ],
    guests: 2,
    bed: "1 King Bed",
    size: "Room size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Complimentary toiletries",
    ],
  },

  {
    slug: "villa-frangipani",
    name: "Villa Frangipani",
    category: "Villa",
    description:
      "A private villa offering a peaceful escape surrounded by the beauty of nature.",
    image: "/images/villa-frangipani.jpg",
    gallery: [
      "/images/villa-frangipani.jpg",
      "/images/villa-frangipani-2.jpg",
      "/images/villa-frangipani-3.jpg",
    ],
    guests: 4,
    bed: "King Bed",
    size: "Villa size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Private outdoor space",
    ],
  },

  {
    slug: "allo-villa",
    name: "Allo Villa",
    category: "Villa",
    description:
      "A spacious private retreat created for memorable stays with family and friends.",
    image: "/images/allo-villa.jpg",
    gallery: [
      "/images/allo-villa.jpg",
      "/images/allo-villa-2.jpg",
      "/images/allo-villa-3.jpg",
    ],
    guests: 4,
    bed: "King Bed",
    size: "Villa size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Private outdoor space",
    ],
  },

  {
    slug: "sola-villa",
    name: "Sola Villa",
    category: "Villa",
    description:
      "A serene private escape designed for comfort, privacy and unforgettable moments.",
    image: "/images/sola-villa.jpg",
    gallery: [
      "/images/sola-villa.jpg",
      "/images/sola-villa-2.jpg",
      "/images/sola-villa-3.jpg",
    ],
    guests: 4,
    bed: "King Bed",
    size: "Villa size",
    amenities: [
      "Air conditioning",
      "Private bathroom",
      "Wi-Fi",
      "Television",
      "Private outdoor space",
    ],
  },
];

export function getRoomBySlug(slug) {
  return rooms.find((room) => room.slug === slug);
}
