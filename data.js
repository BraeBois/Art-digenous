// All people, places, prices, and works below are fictional prototype data.
// The abstract color studies are CSS illustrations, not cultural designs.
const STARTUP = {
  name: "Art-Digenous",
  tagline: "Art with roots. Stories with room to grow.",
  pitch: "A concept marketplace connecting Atlantic Indigenous artists with people who want to discover and support their work."
};

const ARTISTS = [
  {
    id: "rowan",
    name: "Rowan Grey",
    location: "Fictional · Atlantic Canada",
    bio: "A fictional printmaker exploring memory, weather, and the colors of a changing shoreline.",
    focus: "Printmaking",
    initials: "RG",
    tone: "plum"
  },
  {
    id: "morgan",
    name: "Morgan Ellis",
    location: "Fictional · Atlantic Canada",
    bio: "A fictional mixed-media artist drawn to the rhythm of tides and the quiet details of daily life.",
    focus: "Mixed media",
    initials: "ME",
    tone: "rust"
  },
  {
    id: "jules",
    name: "Jules Francis",
    location: "Fictional · Atlantic Canada",
    bio: "A fictional jewelry maker experimenting with color, form, and small-batch wearable pieces.",
    focus: "Jewelry",
    initials: "JF",
    tone: "olive"
  }
];

const LISTINGS = [
  {
    id: 1, name: "After the Rain", category: "Art", description: "An abstract color study in deep plum, soft sand, and the last light after a storm.",
    artistId: "rowan", artist: "Rowan Grey", location: "Fictional · Atlantic Canada",
    price: "$68", date: "2026-11-24", visual: "rain", visualLabel: "Abstract plum and sand color study"
  },
  {
    id: 2, name: "Tide Lines", category: "Jewelry", jewelryType: "Necklaces", description: "A fictional, small-batch pendant concept in brushed brass and muted violet glass.",
    artistId: "jules", artist: "Jules Francis", location: "Fictional · Atlantic Canada",
    price: "$54", date: "2026-11-22", visual: "tide", visualLabel: "Abstract brass and violet necklace concept"
  },
  {
    id: 3, name: "Harbour in Fog", category: "Art", description: "Layered shapes and a quiet palette evoke a coastal morning—an imagined scene.",
    artistId: "morgan", artist: "Morgan Ellis", location: "Fictional · Atlantic Canada",
    price: "$82", date: "2026-11-20", visual: "harbour", visualLabel: "Abstract coastal color study in foggy blue and terracotta"
  },
  {
    id: 4, name: "Little Sun Hoops", category: "Jewelry", jewelryType: "Earrings", description: "A fictional pair of lightweight, warm-toned hoop earrings, shown as a design sketch.",
    artistId: "jules", artist: "Jules Francis", location: "Fictional · Atlantic Canada",
    price: "$42", date: "2026-11-18", visual: "hoops", visualLabel: "Abstract pair of rust-colored hoop earring forms"
  },
  {
    id: 5, name: "Gathering Light", category: "Art", description: "A fictional paper composition of curved forms in berry, lavender, and warm cream.",
    artistId: "rowan", artist: "Rowan Grey", location: "Fictional · Atlantic Canada",
    price: "$96", date: "2026-11-16", visual: "light", visualLabel: "Abstract berry and lavender paper composition"
  },
  {
    id: 6, name: "Soft Current Cuff", category: "Jewelry", jewelryType: "Bracelets", description: "A fictional cuff concept, with a loose line and a small plum-colored detail.",
    artistId: "morgan", artist: "Morgan Ellis", location: "Fictional · Atlantic Canada",
    price: "$48", date: "2026-11-12", visual: "cuff", visualLabel: "Abstract brass cuff with a plum accent"
  }
];

const JEWELRY_TYPES = ["All", "Bracelets", "Earrings", "Necklaces"];
