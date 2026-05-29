const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');
const Review = require('../src/models/Review');

// ─── CATÉGORIES ────────────────────────────────────────────────────────────────
const categories = [
  {
    name: 'Jeans', slug: 'jeans',
    description: 'Jeans homme toutes coupes : slim, straight, baggy, skinny',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    icon: '👖', sortOrder: 1,
  },
  {
    name: 'Cargos', slug: 'cargos',
    description: 'Pantalons cargo streetwear multi-poches',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    icon: '🩳', sortOrder: 2,
  },
  {
    name: 'T-Shirts', slug: 't-shirts',
    description: 'T-shirts, hoodies, polos et hauts décontractés',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    icon: '👕', sortOrder: 3,
  },
  {
    name: 'Chemises', slug: 'chemises',
    description: 'Chemises habillées et casual en lin, oxford, flanelle',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    icon: '👔', sortOrder: 4,
  },
  {
    name: 'Sneakers', slug: 'sneakers',
    description: 'Sneakers et baskets tendance pour tous les styles',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    icon: '👟', sortOrder: 5,
  },
  {
    name: 'Chaussures', slug: 'chaussures',
    description: 'Chaussures habillées premium : derby, mocassins, boots',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    icon: '👞', sortOrder: 6,
  },
];

// ─── TAILLES ───────────────────────────────────────────────────────────────────
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const shoeSizes = ['40', '41', '42', '43', '44', '45'];

const generateVariants = (type, colorList) => {
  const sizes = type === 'shoes' ? shoeSizes : clothingSizes;
  return sizes.flatMap((size) =>
    colorList.map((c) => ({
      size,
      color: c.name,
      colorHex: c.hex,
      stock: Math.floor(Math.random() * 30) + 5,
    }))
  );
};

// ─── PRODUITS ──────────────────────────────────────────────────────────────────
const products = [

  // ══════════════════ JEANS ══════════════════
  {
    catSlug: 'jeans', type: 'clothing',
    name: 'Jean Slim Premium Stretch',
    description: 'Jean slim taille haute en denim stretch premium 98% coton 2% élasthanne. Coupe moderne qui épouse la silhouette tout en offrant un confort exceptionnel. Lavage brut légèrement délavé pour un look authentique. Idéal du bureau au week-end.',
    shortDescription: 'Jean slim stretch ultra confortable, coupe moderne',
    price: 35000, originalPrice: 42000, discountPercentage: 16, isOnSale: true,
    brand: 'Urban Style', isFeatured: true, isNewArrival: true,
    material: 'Denim stretch 98% coton, 2% élasthanne — 280g/m²',
    features: ['Denim stretch 4 directions', 'Coupe slim fit', 'Taille semi-haute', '5 poches traditionnelles', 'Finitions surpiquées contrastées', 'Rivets de renfort aux coins'],
    care: ['Laver à 30°C maximum', 'Ne pas utiliser de sèche-linge', 'Retourner avant lavage pour préserver la couleur', 'Repassage à basse température', 'Ne pas utiliser de javel'],
    tags: ['jean', 'slim', 'stretch', 'premium', 'denim', 'bestseller'],
    colors: [{ name: 'Bleu Indigo', hex: '#2B4C7E' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Bleu Brut', hex: '#1C3F6E' }],
    images: [
      { url: 'https://images.pexels.com/photos/2815417/pexels-photo-2815417.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Slim Premium - homme modèle denim', publicId: 'jean-slim-1' },
      { url: 'https://images.pexels.com/photos/9775489/pexels-photo-9775489.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Slim Premium - coupe slim porté', publicId: 'jean-slim-2' },
    ],
  },
  {
    catSlug: 'jeans', type: 'clothing',
    name: 'Jean Baggy Vintage 90s',
    description: 'Jean baggy inspiré des années 90. Coupe ample et décontractée, lavage stone-washed authentique avec effets d\'usure naturels. La pièce streetwear incontournable de la saison. Se porte taille basse avec ceinture apparente.',
    shortDescription: 'Jean baggy stone-washed style vintage 90s',
    price: 38000, originalPrice: 45000, discountPercentage: 15, isOnSale: true,
    brand: 'RetroVibes', isFeatured: true, isNewArrival: false,
    material: 'Denim 100% coton 12oz — lavage stone-washed',
    features: ['Lavage stone-washed authentique', 'Coupe baggy fit', 'Jambe large évasée', 'Taille basse', 'Poches avant et arrière', 'Effets d\'usure naturels'],
    care: ['Laver à 30°C à l\'envers', 'Séchage à l\'air libre uniquement', 'Les effets stone-washed s\'accentuent avec les lavages', 'Repasser à l\'envers à basse température', 'Ne pas laver avec du blanc'],
    tags: ['jean', 'baggy', 'vintage', 'streetwear', '90s', 'stone-washed'],
    colors: [{ name: 'Bleu Clair', hex: '#6B9EBE' }, { name: 'Gris Délavé', hex: '#9E9E9E' }],
    images: [
      { url: 'https://images.pexels.com/photos/1081796/pexels-photo-1081796.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Baggy Vintage - homme denim large', publicId: 'jean-baggy-1' },
      { url: 'https://images.pexels.com/photos/6764007/pexels-photo-6764007.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Baggy - look streetwear 90s', publicId: 'jean-baggy-2' },
    ],
  },
  {
    catSlug: 'jeans', type: 'clothing',
    name: 'Jean Straight Classic Blue',
    description: 'Jean droit intemporel en denim rigide de qualité supérieure. La coupe straight est la plus polyvalente : élégante avec des chaussures habillées, décontractée avec des sneakers. Un indispensable du vestiaire masculin.',
    shortDescription: 'Jean droit classique en denim rigide qualité supérieure',
    price: 32000,
    brand: 'Urban Style', isFeatured: false, isNewArrival: true,
    material: 'Denim rigide 100% coton 14oz — selvedge',
    features: ['Coupe straight fit droite', 'Denim rigide selvedge', 'Patch cuir au dos', 'Rivets de renfort cuivrés', 'Fermeture boutons métal', '5 poches classiques'],
    care: ['Premier lavage à froid séparé', 'Laver à 30°C maximum', 'Séchage plat recommandé', 'Se patine avec le temps et les lavages', 'Ne pas utiliser d\'assouplissant'],
    tags: ['jean', 'straight', 'classique', 'denim', 'polyvalent', 'selvedge'],
    colors: [{ name: 'Bleu Marine', hex: '#1E3A5F' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Bleu Brut', hex: '#1C3F6E' }],
    images: [
      { url: 'https://images.pexels.com/photos/775771/pexels-photo-775771.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Straight Classic - homme chemise blanche jeans', publicId: 'jean-straight-1' },
      { url: 'https://images.pexels.com/photos/2315311/pexels-photo-2315311.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Straight - look décontracté urbain', publicId: 'jean-straight-2' },
    ],
  },
  {
    catSlug: 'jeans', type: 'clothing',
    name: 'Jean Skinny Urban Black',
    description: 'Jean skinny ultra-ajusté en denim noir intense avec légère touche de stretch pour le confort. Coupe moulante qui met en valeur la silhouette. Parfait pour un look rock ou casual chic avec bottines ou sneakers.',
    shortDescription: 'Jean skinny noir intense ultra-ajusté avec stretch',
    price: 30000,
    brand: 'Urban Style', isFeatured: false, isNewArrival: false,
    material: 'Denim stretch noir 95% coton, 5% élasthanne — 260g/m²',
    features: ['Coupe skinny ultra-slim', 'Denim stretch noir intense', 'Taille basse', 'Jambe très étroite', 'Lavage noir renforcé', '5 poches classiques'],
    care: ['Laver à 30°C à l\'envers', 'Séchage à l\'air libre pour conserver le noir', 'Ne pas utiliser de javel ou adoucissant', 'Repasser à l\'envers à basse température', 'Laver avec des vêtements sombres'],
    tags: ['jean', 'skinny', 'noir', 'rock', 'ajusté', 'stretch'],
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Gris Anthracite', hex: '#3D3D3D' }],
    images: [
      { url: 'https://images.pexels.com/photos/2315311/pexels-photo-2315311.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Skinny Urban Black - homme street', publicId: 'jean-skinny-1' },
      { url: 'https://images.pexels.com/photos/775771/pexels-photo-775771.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Skinny - look ajusté urbain', publicId: 'jean-skinny-2' },
    ],
  },

  {
    catSlug: 'jeans', type: 'clothing',
    name: 'Jean Tapered Cropped',
    description: 'Jean tapered cropped longueur cheville, tendance phare des dernières saisons. Coupe resserrée progressivement vers le bas, cheville dégagée pour mettre en valeur les chaussures. En denim stretch doux, confortable du matin au soir.',
    shortDescription: 'Jean tapered cropped cheville, tendance, denim stretch doux',
    price: 34000,
    brand: 'Urban Style', isFeatured: false, isNewArrival: true,
    material: 'Denim stretch 97% coton, 3% élasthanne — 260g/m²',
    features: ['Coupe tapered resserrée vers le bas', 'Longueur cropped cheville', 'Denim stretch très doux', 'Taille semi-haute', 'Fermeture zip + bouton', '5 poches classiques'],
    care: ['Laver à 30°C à l\'envers', 'Séchage à l\'air libre', 'Ne pas utiliser de sèche-linge', 'Repasser à basse température', 'Conserver la couleur : laver avec les foncés'],
    tags: ['jean', 'tapered', 'cropped', 'cheville', 'tendance', 'stretch'],
    colors: [{ name: 'Bleu Moyen', hex: '#4A7FB5' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Bleu Clair', hex: '#6B9EBE' }],
    images: [
      { url: 'https://images.pexels.com/photos/9775489/pexels-photo-9775489.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Tapered Cropped - homme chemise blanche jeans', publicId: 'jean-tapered-1' },
      { url: 'https://images.pexels.com/photos/2815417/pexels-photo-2815417.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Jean Tapered - style cheville urbain', publicId: 'jean-tapered-2' },
    ],
  },

  // ══════════════════ CARGOS ══════════════════
  {
    catSlug: 'cargos', type: 'clothing',
    name: 'Cargo Tactique Urban',
    description: 'Pantalon cargo moderne avec 6 poches fonctionnelles dont 2 poches cargo à rabat sur les cuisses. Tissu ripstop résistant aux accrocs et aux déchirures. Idéal pour un look streetwear authentique ou une sortie en plein air. Chevilles ajustables par cordon.',
    shortDescription: 'Cargo streetwear 6 poches tissu ripstop, chevilles ajustables',
    price: 28000,
    brand: 'Urban Style', isFeatured: true, isNewArrival: true,
    material: 'Ripstop 65% polyester, 35% coton — 200g/m²',
    features: ['6 poches fonctionnelles', '2 poches cargo à rabat', 'Tissu ripstop anti-déchirure', 'Chevilles ajustables par cordon', 'Ceinture à passants larges 4cm', 'Coupe regular fit'],
    care: ['Laver à 40°C', 'Séchage en machine à basse température', 'Repasser à température modérée', 'Vider toutes les poches avant lavage', 'Fermer les rabats avant lavage'],
    tags: ['cargo', 'tactique', 'streetwear', 'poches', 'ripstop', 'outdoor'],
    colors: [{ name: 'Kaki', hex: '#8B7355' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Olive', hex: '#556B2F' }, { name: 'Beige Sable', hex: '#C2B280' }],
    images: [
      { url: 'https://images.pexels.com/photos/13424793/pexels-photo-13424793.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Tactique Urban - homme pantalon cargo blanc', publicId: 'cargo-tactique-1' },
      { url: 'https://images.pexels.com/photos/19392459/pexels-photo-19392459.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Tactique - homme cargo noir balcon', publicId: 'cargo-tactique-2' },
    ],
  },
  {
    catSlug: 'cargos', type: 'clothing',
    name: 'Cargo Chino Premium',
    description: 'Cargo en coton chino raffiné. La version élégante du cargo classique, avec des poches cargo discrètes et une coupe slim pour un look casual chic. Passe facilement du bureau au restaurant. Parfait avec chemise ou polo.',
    shortDescription: 'Cargo chino slim fit élégant, casual chic',
    price: 32000,
    brand: 'Urban Style', isFeatured: true, isNewArrival: false,
    material: 'Coton chino 100% coton — 220g/m²',
    features: ['Coton chino doux au toucher', 'Coupe slim fit moderne', 'Poches cargo discrètes à bouton', 'Pinces avant pour plus d\'aisance', 'Fermeture zip + bouton métal', 'Ceinture à passants standard'],
    care: ['Laver à 30°C', 'Repasser légèrement humide', 'Séchage à plat recommandé', 'Ne pas utiliser de sèche-linge', 'Vider les poches avant lavage'],
    tags: ['cargo', 'chino', 'slim', 'premium', 'casual chic', 'bureau'],
    colors: [{ name: 'Beige', hex: '#C8A882' }, { name: 'Bleu Marine', hex: '#1E3A5F' }, { name: 'Gris', hex: '#808080' }, { name: 'Kaki Clair', hex: '#BDB88E' }],
    images: [
      { url: 'https://images.pexels.com/photos/18036895/pexels-photo-18036895.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Chino Premium - modèle cargo denim studio', publicId: 'cargo-chino-1' },
      { url: 'https://images.pexels.com/photos/3807297/pexels-photo-3807297.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Chino - homme cargo look street', publicId: 'cargo-chino-2' },
    ],
  },
  {
    catSlug: 'cargos', type: 'clothing',
    name: 'Cargo Jogger Elastic',
    description: 'Cargo jogger avec taille et chevilles élastiquées pour un confort maximal toute la journée. Style sportswear chic avec poches latérales zippées sécurisées. Tissu technique léger et respirant. Idéal pour la ville, les déplacements ou le sport casual.',
    shortDescription: 'Cargo jogger taille élastiquée, tissu technique respirant',
    price: 24000, originalPrice: 28000, discountPercentage: 14, isOnSale: true,
    brand: 'SportUrban', isFeatured: false, isNewArrival: true,
    material: 'Techno 80% polyester, 20% coton — 180g/m²',
    features: ['Taille élastiquée + cordon réglable', 'Chevilles élastiques côtelées', '4 poches dont 2 zippées', 'Tissu techno léger respirant', 'Coupe tapered (resserrée en bas)', 'Poche arrière zippée'],
    care: ['Laver à 30°C', 'Ne pas utiliser de sèche-linge', 'Ne pas repasser les parties élastiques', 'Laver avec des couleurs similaires', 'Séchage rapide naturel'],
    tags: ['cargo', 'jogger', 'sport', 'confort', 'élastique', 'techno'],
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Gris Chiné', hex: '#9E9E9E' }, { name: 'Kaki', hex: '#8B7355' }],
    images: [
      { url: 'https://images.pexels.com/photos/19461558/pexels-photo-19461558.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Jogger - modèle hoodie cargo denim studio', publicId: 'cargo-jogger-1' },
      { url: 'https://images.pexels.com/photos/13424793/pexels-photo-13424793.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Jogger - look sportswear urbain', publicId: 'cargo-jogger-2' },
    ],
  },

  {
    catSlug: 'cargos', type: 'clothing',
    name: 'Cargo Wide Leg Oversize',
    description: 'Cargo wide leg à jambe très large pour un look streetwear XXL. Inspiré des uniformes militaires revisités en version mode. Taille haute élastiquée, tombé parfait, poches multiples plaquées. La pièce statement de ta garde-robe.',
    shortDescription: 'Cargo wide leg jambe ultra-large, look streetwear statement',
    price: 35000,
    brand: 'RetroVibes', isFeatured: true, isNewArrival: true,
    material: 'Coton sergé 100% coton — 240g/m²',
    features: ['Jambe très large wide leg', 'Taille haute élastiquée', '8 poches dont 4 plaquées', 'Tissu sergé résistant', 'Cordon de réglage taille', 'Passepoils contrastés'],
    care: ['Laver à 30°C', 'Séchage à l\'air libre', 'Repasser à température modérée', 'Vider toutes les poches avant lavage', 'Ne pas essorer trop fort pour garder le tombé'],
    tags: ['cargo', 'wide leg', 'oversize', 'streetwear', 'militaire', 'statement'],
    colors: [{ name: 'Kaki Militaire', hex: '#78866B' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Beige Sable', hex: '#C2B280' }],
    images: [
      { url: 'https://images.pexels.com/photos/19392459/pexels-photo-19392459.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Wide Leg Oversize - homme cargo streetwear', publicId: 'cargo-wide-1' },
      { url: 'https://images.pexels.com/photos/18036895/pexels-photo-18036895.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Wide Leg - look bold studio', publicId: 'cargo-wide-2' },
    ],
  },
  {
    catSlug: 'cargos', type: 'clothing',
    name: 'Cargo Bermuda Short',
    description: 'Short cargo bermuda longueur genou, parfait pour les saisons chaudes. Tissu léger en coton/lin pour une respirabilité maximale. 6 poches dont 2 cargo latérales. Le confort du bermuda avec le style du cargo.',
    shortDescription: 'Short cargo bermuda coton/lin respirant, 6 poches',
    price: 20000, originalPrice: 24000, discountPercentage: 16, isOnSale: true,
    brand: 'Urban Style', isFeatured: false, isNewArrival: true,
    material: 'Coton/Lin 60% coton, 40% lin — 180g/m²',
    features: ['Longueur genou bermuda', '6 poches fonctionnelles', 'Tissu coton/lin respirant', 'Taille ajustable cordon + boutonnière', 'Passants ceinture larges', 'Ourlet droit propre'],
    care: ['Laver à 30°C', 'Séchage rapide naturel', 'Repasser légèrement humide', 'Les faux-plis du lin sont normaux', 'Laver à l\'envers pour préserver la couleur'],
    tags: ['cargo', 'short', 'bermuda', 'été', 'lin', 'respirant'],
    colors: [{ name: 'Beige Lin', hex: '#C8A882' }, { name: 'Kaki', hex: '#8B7355' }, { name: 'Bleu Marine', hex: '#1E3A5F' }, { name: 'Noir', hex: '#0A0A0A' }],
    images: [
      { url: 'https://images.pexels.com/photos/3807297/pexels-photo-3807297.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Bermuda Short - homme cargo voiture', publicId: 'cargo-short-1' },
      { url: 'https://images.pexels.com/photos/19461558/pexels-photo-19461558.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Cargo Bermuda - look estival cargo', publicId: 'cargo-short-2' },
    ],
  },

  // ══════════════════ T-SHIRTS ══════════════════
  {
    catSlug: 't-shirts', type: 'clothing',
    name: 'T-Shirt Oversize Essential',
    description: 'T-shirt oversize 100% coton bio certifié GOTS. Coupe boxy décontractée, idéale pour le quotidien. Col rond légèrement tombant, coutures épaules décalées pour un effet authentique. Tissu épais et durable qui ne se déforme pas au lavage.',
    shortDescription: 'T-shirt oversize coton bio certifié GOTS, coupe boxy',
    price: 12000,
    brand: 'Urban Basics', isFeatured: true, isNewArrival: true,
    material: '100% coton bio certifié GOTS — jersey 200g/m²',
    features: ['100% coton bio certifié GOTS', 'Coupe boxy oversize', 'Col rond côtelé', 'Coutures épaules décalées', 'Pré-rétréci pour éviter le rétrécissement', 'Tissu épais durable'],
    care: ['Laver à 30°C', 'Ne pas utiliser de sèche-linge', 'Laver à l\'envers pour conserver la couleur', 'Séchage à plat recommandé', 'Repasser à basse température à l\'envers'],
    tags: ['t-shirt', 'oversize', 'bio', 'coton', 'basique', 'gots'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Beige', hex: '#C8A882' }, { name: 'Gris Chiné', hex: '#9E9E9E' }],
    images: [
      { url: 'https://images.pexels.com/photos/9558233/pexels-photo-9558233.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'T-Shirt Oversize Essential - homme t-shirt noir', publicId: 'tshirt-oversize-1' },
      { url: 'https://images.pexels.com/photos/17281224/pexels-photo-17281224.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'T-Shirt Oversize - look boxy casual', publicId: 'tshirt-oversize-2' },
    ],
  },
  {
    catSlug: 't-shirts', type: 'clothing',
    name: 'T-Shirt Graphique Street Art',
    description: 'T-shirt avec impression graphique exclusive réalisée par des artistes locaux dakarois. Sérigraphie 4 couleurs haute qualité résistante aux lavages répétés. Chaque pièce est numérotée. Porter de l\'art local c\'est soutenir la culture.',
    shortDescription: 'T-shirt graphique sérigraphie artiste dakarois, édition limitée',
    price: 15000,
    brand: 'ArtStreet', isFeatured: true, isNewArrival: true,
    material: '100% coton jersey — 180g/m²',
    features: ['Sérigraphie 4 couleurs', 'Impression haute résistance au lavage', 'Coupe regular fit', 'Col rond renforcé double fil', 'Édition limitée numérotée', 'Artiste local certifié'],
    care: ['Laver à 30°C à l\'envers', 'Ne pas utiliser le sèche-linge', 'Ne pas repasser sur l\'impression', 'Laver séparé les premiers lavages', 'Conserver l\'étiquette numérotée'],
    tags: ['t-shirt', 'graphique', 'street art', 'dakar', 'édition limitée', 'artiste'],
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Blanc', hex: '#FFFFFF' }, { name: 'Gris Anthracite', hex: '#3D3D3D' }],
    images: [
      { url: 'https://images.pexels.com/photos/34582212/pexels-photo-34582212.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'T-Shirt Graphique Street Art - homme sweat urban portrait', publicId: 'tshirt-graphique-1' },
      { url: 'https://images.pexels.com/photos/9558233/pexels-photo-9558233.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'T-Shirt Graphique - style street art', publicId: 'tshirt-graphique-2' },
    ],
  },
  {
    catSlug: 't-shirts', type: 'clothing',
    name: 'Polo Piqué Premium',
    description: 'Polo en coton piqué double fil de haute qualité. Le classique revisité avec une coupe slim fit moderne et des boutons nacre. Col côtelé renforcé qui garde sa forme. Du bureau à la terrasse, ce polo est parfait pour un look smart casual impeccable.',
    shortDescription: 'Polo piqué slim fit boutons nacre, smart casual élégant',
    price: 18000,
    brand: 'Urban Style', isFeatured: false, isNewArrival: false,
    material: 'Coton piqué double fil 100% coton — 220g/m²',
    features: ['Coton piqué double fil premium', 'Coupe slim fit', '2 boutons nacre', 'Col et manchettes côtelés', 'Bandes épaules contrastées', 'Fente latérale en bas'],
    care: ['Laver à 30°C', 'Séchage en machine possible à basse temp.', 'Repasser à température modérée', 'Boutonnez les boutons avant lavage', 'Repasser le col à plat'],
    tags: ['polo', 'piqué', 'slim', 'smart casual', 'bureau', 'nacre'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Bleu Marine', hex: '#1E3A5F' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Rouge Bordeaux', hex: '#722F37' }],
    images: [
      { url: 'https://images.pexels.com/photos/5339947/pexels-photo-5339947.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Polo Piqué Premium - homme hoodie casual', publicId: 'polo-pique-1' },
      { url: 'https://images.pexels.com/photos/18700207/pexels-photo-18700207.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Polo Piqué - smart casual col boutonné', publicId: 'polo-pique-2' },
    ],
  },
  {
    catSlug: 't-shirts', type: 'clothing',
    name: 'Hoodie Premium Fleece',
    description: 'Sweatshirt à capuche en molleton double face grammage 350g/m². Intérieur gratté pour un toucher ultra doux. Grande poche kangourou, cordon plat, manchettes et bas côtelés. Le hoodie que tu ne voudras plus enlever.',
    shortDescription: 'Hoodie molleton 350g double face, ultra doux, poche kangourou',
    price: 25000,
    brand: 'Urban Basics', isFeatured: true, isNewArrival: true,
    material: 'Molleton 80% coton, 20% polyester — 350g/m² double face',
    features: ['Molleton double face 350g/m²', 'Intérieur gratté ultra doux', 'Grande poche kangourou', 'Capuche doublée jersey', 'Cordon plat assorti', 'Manchettes et bas côtelés'],
    care: ['Laver à 30°C', 'Retourner avant lavage', 'Séchage à l\'air libre', 'Ne pas utiliser de sèche-linge', 'Repasser à basse température côté envers'],
    tags: ['hoodie', 'sweat', 'molleton', 'capuche', 'confort', 'hiver'],
    colors: [{ name: 'Gris Chiné', hex: '#9E9E9E' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Beige', hex: '#C8A882' }, { name: 'Bleu Navy', hex: '#1E3A5F' }],
    images: [
      { url: 'https://images.pexels.com/photos/2772535/pexels-photo-2772535.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Hoodie Premium Fleece - homme sweat gris molleton', publicId: 'hoodie-fleece-1' },
      { url: 'https://images.pexels.com/photos/34582212/pexels-photo-34582212.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Hoodie Premium - style urbain capuche', publicId: 'hoodie-fleece-2' },
    ],
  },

  {
    catSlug: 't-shirts', type: 'clothing',
    name: 'Sweat Crewneck Essential',
    description: 'Sweatshirt col rond en molleton gratté 320g/m². Le basique ultime du vestiaire casual. Coupe regular légèrement ample, bords-côtes sur col, poignets et ourlet. Se porte seul ou superposé sous une veste. Incontournable toute l\'année.',
    shortDescription: 'Sweatshirt col rond molleton 320g, basique essentiel',
    price: 20000,
    brand: 'Urban Basics', isFeatured: false, isNewArrival: false,
    material: 'Molleton 80% coton, 20% polyester — 320g/m² gratté intérieur',
    features: ['Molleton gratté intérieur doux', 'Coupe regular légèrement ample', 'Col rond côtelé', 'Poignets et ourlet côtelés', 'Couture raglan épaules', 'Lavage pré-rétréci'],
    care: ['Laver à 30°C à l\'envers', 'Séchage à l\'air libre', 'Repasser à basse température', 'Ne pas utiliser de sèche-linge', 'Peut légèrement boulochonner : utiliser un rasoir anti-peluches'],
    tags: ['sweat', 'crewneck', 'molleton', 'basique', 'col rond', 'essentiel'],
    colors: [{ name: 'Gris Chiné', hex: '#9E9E9E' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Blanc Cassé', hex: '#F5F5F0' }, { name: 'Bleu Navy', hex: '#1E3A5F' }, { name: 'Bordeaux', hex: '#722F37' }],
    images: [
      { url: 'https://images.pexels.com/photos/18700207/pexels-photo-18700207.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sweat Crewneck Essential - homme bordeaux casual', publicId: 'sweat-crew-1' },
      { url: 'https://images.pexels.com/photos/5339947/pexels-photo-5339947.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sweat Crewneck - col rond molleton', publicId: 'sweat-crew-2' },
    ],
  },

  // ══════════════════ CHEMISES ══════════════════
  {
    catSlug: 'chemises', type: 'clothing',
    name: 'Chemise Lin Summer',
    description: 'Chemise en lin naturel non traité, légère et respirante. Le lin est la fibre la plus fraîche pour l\'été — idéal pour le climat sénégalais. Col mao, manches longues retroussables avec patte boutonnée. Gagne en beauté avec le temps.',
    shortDescription: 'Chemise lin naturel col mao, idéale climat tropical',
    price: 22000,
    brand: 'Urban Style', isFeatured: true, isNewArrival: false,
    material: 'Lin naturel 100% — 140g/m²',
    features: ['Lin naturel non traité', 'Col mao droit', 'Manches longues retroussables', 'Patte de retournement boutonnée', 'Coupe droite ample', 'Boutons nacre naturelle'],
    care: ['Laver à 40°C', 'Séchage à l\'air libre légèrement humide', 'Repasser humide à fer chaud', 'Les faux-plis du lin sont normaux et caractéristiques', 'Ne pas utiliser de sèche-linge'],
    tags: ['chemise', 'lin', 'été', 'respirant', 'col mao', 'tropical'],
    colors: [{ name: 'Blanc Cassé', hex: '#F5F0E8' }, { name: 'Beige Naturel', hex: '#C8A882' }, { name: 'Bleu Ciel', hex: '#87CEEB' }, { name: 'Kaki Clair', hex: '#BDB88E' }],
    images: [
      { url: 'https://images.pexels.com/photos/2033447/pexels-photo-2033447.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Lin Summer - homme chemise blanche boutonné', publicId: 'chemise-lin-1' },
      { url: 'https://images.pexels.com/photos/9785839/pexels-photo-9785839.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Lin - portrait homme chemise beige', publicId: 'chemise-lin-2' },
    ],
  },
  {
    catSlug: 'chemises', type: 'clothing',
    name: 'Chemise Oxford Classique',
    description: 'Chemise Oxford intemporelle en coton brossé. Le must-have du vestiaire masculin. Col button-down caractéristique, patte de boutonnage, coupe slim. Tissu Oxford légèrement structuré qui tient bien sa forme toute la journée.',
    shortDescription: 'Chemise Oxford slim fit col button-down, intemporelle',
    price: 26000,
    brand: 'Urban Style', isFeatured: true, isNewArrival: false,
    material: 'Coton Oxford 100% coton — 130g/m²',
    features: ['Coton Oxford tissé', 'Col button-down iconique', 'Patte de boutonnage', 'Coupe slim fit', 'Boutons blancs nacre', 'Poche poitrine gauche'],
    care: ['Laver à 40°C', 'Séchage en machine possible', 'Repasser légèrement humide pour faciliter', 'Col à repasser en premier', 'Amidonner légèrement pour look impeccable'],
    tags: ['chemise', 'oxford', 'classique', 'bureau', 'button-down', 'slim'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Bleu Oxford', hex: '#4A7FB5' }, { name: 'Rose Poudré', hex: '#F4C2C2' }, { name: 'Bleu Ciel', hex: '#87CEEB' }],
    images: [
      { url: 'https://images.pexels.com/photos/1957142/pexels-photo-1957142.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Oxford Classique - homme chemise dress shirt', publicId: 'chemise-oxford-1' },
      { url: 'https://images.pexels.com/photos/2033447/pexels-photo-2033447.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Oxford - look bureau élégant', publicId: 'chemise-oxford-2' },
    ],
  },
  {
    catSlug: 'chemises', type: 'clothing',
    name: 'Chemise Flanelle Oversize',
    description: 'Chemise en flanelle oversize pour un look grunge chic ou workwear. Tissu doux et légèrement chaud, parfait pour les soirées fraîches. Motif carreaux iconique tissé (non imprimé). Coupe ample à porter ouverte comme veste ou fermée.',
    shortDescription: 'Chemise flanelle oversize carreaux tissés, style grunge',
    price: 20000, originalPrice: 25000, discountPercentage: 20, isOnSale: true,
    brand: 'RetroVibes', isFeatured: false, isNewArrival: true,
    material: 'Flanelle brossée 100% coton — 160g/m²',
    features: ['Flanelle brossée douce', 'Motif carreaux tissé (non imprimé)', 'Coupe oversize', 'Double poche poitrine boutonnée', 'Ourlet arrondi', 'Col classique'],
    care: ['Laver à 30°C', 'Séchage à l\'air libre', 'Ne pas utiliser de sèche-linge', 'Repasser à basse température', 'Les carreaux tissés résistent aux lavages'],
    tags: ['chemise', 'flanelle', 'oversize', 'carreaux', 'grunge', 'workwear'],
    colors: [{ name: 'Rouge/Noir', hex: '#8B0000' }, { name: 'Bleu/Noir', hex: '#1E3A5F' }, { name: 'Vert/Noir', hex: '#2D5A27' }],
    images: [
      { url: 'https://images.pexels.com/photos/769732/pexels-photo-769732.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Flanelle Oversize - homme chemise carreaux', publicId: 'chemise-flanelle-1' },
      { url: 'https://images.pexels.com/photos/769746/pexels-photo-769746.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Flanelle - look workwear carreaux', publicId: 'chemise-flanelle-2' },
    ],
  },

  {
    catSlug: 'chemises', type: 'clothing',
    name: 'Chemise Denim Légère',
    description: 'Chemise en denim chambray léger, entre la chemise et la veste légère. Tissage chambray doux et aéré, idéal pour les transitions de saison. Col classique, 2 poches poitrine boutonnées. Se porte rentrée ou sortie du pantalon.',
    shortDescription: 'Chemise denim chambray léger, versatile, 2 poches poitrine',
    price: 24000,
    brand: 'Urban Style', isFeatured: false, isNewArrival: true,
    material: 'Chambray denim 100% coton — 120g/m²',
    features: ['Denim chambray léger et aéré', '2 poches poitrine boutonnées', 'Col classique', 'Manches longues retroussables', 'Coupe regular fit', 'Boutons métal mat'],
    care: ['Laver à 30°C à l\'envers', 'Séchage à l\'air libre', 'Repasser à température modérée', 'Peut légèrement déteindre aux premiers lavages', 'Laver séparément les premières fois'],
    tags: ['chemise', 'denim', 'chambray', 'légère', 'versatile', 'poches'],
    colors: [{ name: 'Bleu Chambray', hex: '#4A7FB5' }, { name: 'Gris Chambray', hex: '#808080' }, { name: 'Indigo Clair', hex: '#6B9EBE' }],
    images: [
      { url: 'https://images.pexels.com/photos/9785839/pexels-photo-9785839.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Denim Chambray - homme chemise beige casual', publicId: 'chemise-denim-1' },
      { url: 'https://images.pexels.com/photos/1957142/pexels-photo-1957142.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Denim - style quotidien urban', publicId: 'chemise-denim-2' },
    ],
  },
  {
    catSlug: 'chemises', type: 'clothing',
    name: 'Chemise Hawaïenne Resort',
    description: 'Chemise hawaïenne en viscose fluide avec imprimé tropical exclusif. Coupe camp collar (col cubain ouvert), coupe ample et décontractée. La pièce vacances ou soirée estivale par excellence. Légère, fluide, elle se froisse peu.',
    shortDescription: 'Chemise hawaïenne viscose fluide imprimé tropical, col cubain',
    price: 19000, originalPrice: 23000, discountPercentage: 17, isOnSale: true,
    brand: 'SummerVibes', isFeatured: true, isNewArrival: true,
    material: 'Viscose 100% — 110g/m², imprimé exclusif',
    features: ['Viscose fluide légère', 'Col cubain camp collar', 'Imprimé tropical exclusif', 'Coupe ample décontractée', 'Fermeture boutons coco', 'Ourlet droit'],
    care: ['Laver à 30°C délicat ou à la main', 'Ne pas tordre', 'Séchage à plat', 'Repasser à basse température', 'Ne pas utiliser de sèche-linge'],
    tags: ['chemise', 'hawaïenne', 'tropical', 'été', 'viscose', 'col cubain'],
    colors: [{ name: 'Fond Bleu Tropical', hex: '#1E6B8F' }, { name: 'Fond Noir Tropical', hex: '#0A0A0A' }, { name: 'Fond Blanc Tropical', hex: '#F5F5F0' }],
    images: [
      { url: 'https://images.pexels.com/photos/7026458/pexels-photo-7026458.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Hawaïenne Resort - homme chemise florale', publicId: 'chemise-hawaii-1' },
      { url: 'https://images.pexels.com/photos/769732/pexels-photo-769732.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chemise Hawaïenne - style été tropical', publicId: 'chemise-hawaii-2' },
    ],
  },

  // ══════════════════ SNEAKERS ══════════════════
  {
    catSlug: 'sneakers', type: 'shoes',
    name: 'Sneakers Air Max Classic',
    description: 'Sneakers iconiques avec coussin d\'air visible à la semelle. Tige en mesh respirant avec empiècements cuir synthétique. Amorti exceptionnel pour une journée entière sans fatigue. Coloris signature blanc/noir intemporel.',
    shortDescription: 'Sneakers coussin d\'air visible, mesh respirant, amorti premium',
    price: 45000,
    brand: 'AirMax', isFeatured: true, isNewArrival: true,
    material: 'Mesh technique + cuir synthétique, semelle EVA+caoutchouc',
    features: ['Coussin d\'air visible talon', 'Tige mesh respirante', 'Empiècements cuir synthétique', 'Semelle caoutchouc anti-dérapante', 'Languette rembourrée', 'Col cheville rembourré'],
    care: ['Nettoyer à la brosse douce humide', 'Laisser sécher à l\'air libre', 'Ne pas mettre en machine à laver', 'Utiliser un spray imperméabilisant', 'Ranger avec les embouchoirs'],
    tags: ['sneakers', 'air max', 'confort', 'lifestyle', 'blanc', 'classique'],
    colors: [{ name: 'Blanc/Noir', hex: '#FFFFFF' }, { name: 'Noir/Rouge', hex: '#0A0A0A' }, { name: 'Gris/Blanc', hex: '#D3D3D3' }],
    images: [
      { url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Air Max Classic - sneakers fond blanc', publicId: 'sneakers-airmax-1' },
      { url: 'https://images.pexels.com/photos/6258910/pexels-photo-6258910.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Air Max - Nike Air Force 1 blanc', publicId: 'sneakers-airmax-2' },
    ],
  },
  {
    catSlug: 'sneakers', type: 'shoes',
    name: 'Sneakers Low Urban Runner',
    description: 'Sneakers basses inspirées du running sur route, revisitées en version streetwear. Semelle épaisse crantée 3cm, tige en mesh technique ultra-légère. Le compromis parfait entre performance sportive et style urbain quotidien.',
    shortDescription: 'Sneakers basses running urban, semelle crantée 3cm, légères',
    price: 38000, originalPrice: 45000, discountPercentage: 15, isOnSale: true,
    brand: 'UrbanRun', isFeatured: true, isNewArrival: false,
    material: 'Mesh technique + TPU, semelle caoutchouc crantée',
    features: ['Semelle crantée 3cm', 'Tige mesh ultra-légère', 'Doublure respirante', 'Lacets plats 120cm', 'Empiècements TPU thermoformés', 'Languette pull-tab'],
    care: ['Retirer les semelles intérieures pour séchage', 'Nettoyer à la brosse sèche', 'Taches : chiffon humide savonneux', 'Séchage à l\'air loin des sources de chaleur', 'Ne pas laver en machine'],
    tags: ['sneakers', 'low', 'running', 'street', 'léger', 'mesh'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Gris/Blanc', hex: '#D3D3D3' }],
    images: [
      { url: 'https://images.pexels.com/photos/7228006/pexels-photo-7228006.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Low Urban Runner - homme Nike escaliers', publicId: 'sneakers-runner-1' },
      { url: 'https://images.pexels.com/photos/68257/pexels-photo-68257.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Runner - sneakers passage piéton urbain', publicId: 'sneakers-runner-2' },
    ],
  },
  {
    catSlug: 'sneakers', type: 'shoes',
    name: 'Sneakers High Top Basketball',
    description: 'Sneakers montantes inspirées du basketball old school. Tige en canvas renforcé avec œillets métalliques chromés. La paire iconique intemporelle qui ne se démode jamais, portée par plusieurs générations.',
    shortDescription: 'Sneakers montantes basketball old school, canvas, œillets chrome',
    price: 32000,
    brand: 'ClassicB', isFeatured: false, isNewArrival: true,
    material: 'Canvas 100% coton, semelle caoutchouc vulcanisé',
    features: ['Tige montante canvas renforcé', 'Œillets métalliques chromés', 'Semelle vulcanisée grip', 'Languette rembourrée haute', 'Logo brodé sur le côté', 'Lacets plats coton'],
    care: ['Canvas : nettoyage à la brosse sèche', 'Taches : gomme à effacer spéciale toile', 'Semelle : chiffon humide', 'Laisser sécher à plat', 'Imperméabilisant canvas recommandé'],
    tags: ['sneakers', 'high top', 'basketball', 'old school', 'canvas', 'classique'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Rouge', hex: '#CC0000' }],
    images: [
      { url: 'https://images.pexels.com/photos/6050929/pexels-photo-6050929.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers High Top Basketball - basket montante rouge noir', publicId: 'sneakers-hightop-1' },
      { url: 'https://images.pexels.com/photos/7228006/pexels-photo-7228006.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'High Top Canvas - homme sneakers lifestyle', publicId: 'sneakers-hightop-2' },
    ],
  },

  {
    catSlug: 'sneakers', type: 'shoes',
    name: 'Sneakers Platform Chunky',
    description: 'Sneakers à semelle plateforme épaisse 5cm, tendance phare du moment. Tige en cuir synthétique lisse avec empiècements contrastés. Combinaison avant-gardiste de confort et d\'esthétique bold. À porter avec jean slim ou robe pour un effet maximal.',
    shortDescription: 'Sneakers plateforme 5cm chunky, look avant-gardiste bold',
    price: 42000,
    brand: 'BoldStep', isFeatured: true, isNewArrival: true,
    material: 'Cuir synthétique + mesh, semelle EVA plateforme 5cm',
    features: ['Semelle plateforme épaisse 5cm', 'Tige cuir synthétique lisse', 'Empiècements contrastés', 'Semelle chunky moulée', 'Languette oversize', 'Lacets épais plats'],
    care: ['Nettoyer à chiffon humide doux', 'Savon neutre pour taches', 'Sécher à l\'air libre', 'Ne pas immerger dans l\'eau', 'Imperméabilisant synthétique recommandé'],
    tags: ['sneakers', 'platform', 'chunky', 'bold', 'tendance', 'semelle épaisse'],
    colors: [{ name: 'Blanc/Beige', hex: '#FFFFFF' }, { name: 'Noir/Gris', hex: '#0A0A0A' }, { name: 'Crème/Marron', hex: '#F5F0E8' }],
    images: [
      { url: 'https://images.pexels.com/photos/68257/pexels-photo-68257.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Platform Chunky - sneakers rue urbaine', publicId: 'sneakers-platform-1' },
      { url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Platform - look bold plateforme', publicId: 'sneakers-platform-2' },
    ],
  },
  {
    catSlug: 'sneakers', type: 'shoes',
    name: 'Sneakers Slip-On Canvas',
    description: 'Sneakers slip-on sans lacets en canvas coton. L\'option la plus facile à enfiler pour le quotidien. Semelle vulcanisée plate, doublure textile respirante. Légères comme une plume. Idéales pour la plage, la ville ou les voyages.',
    shortDescription: 'Sneakers slip-on sans lacets canvas coton, ultra légères',
    price: 22000, originalPrice: 26000, discountPercentage: 15, isOnSale: true,
    brand: 'EasyWear', isFeatured: false, isNewArrival: false,
    material: 'Canvas coton 100%, semelle caoutchouc vulcanisé',
    features: ['Sans lacets slip-on', 'Canvas coton léger', 'Semelle vulcanisée plate', 'Doublure textile respirante', 'Bande élastique couvre-pied', 'Poids plume'],
    care: ['Canvas : brosser à sec', 'Taches : chiffon humide savonneux', 'Peut se laver à la main à froid', 'Séchage à plat à l\'air libre', 'Ne pas passer en machine'],
    tags: ['sneakers', 'slip-on', 'canvas', 'légères', 'sans lacets', 'été'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Noir', hex: '#0A0A0A' }, { name: 'Marine', hex: '#1E3A5F' }, { name: 'Rouge', hex: '#CC0000' }],
    images: [
      { url: 'https://images.pexels.com/photos/15632277/pexels-photo-15632277.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Sneakers Slip-On Canvas - Nike Air Jordan blanc', publicId: 'sneakers-slipon-1' },
      { url: 'https://images.pexels.com/photos/6050929/pexels-photo-6050929.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Slip-On Canvas - sneakers légères lifestyle', publicId: 'sneakers-slipon-2' },
    ],
  },

  // ══════════════════ CHAUSSURES ══════════════════
  {
    catSlug: 'chaussures', type: 'shoes',
    name: 'Derby Cuir Véritable Premium',
    description: 'Chaussures derby en cuir de veau pleine fleur tanné végétal. Montage Goodyear Welt pour une durabilité et une réparabilité exceptionnelles. Semelle cuir + caoutchouc. La référence absolue du vestiaire masculin élégant, fabriquée artisanalement.',
    shortDescription: 'Derby cuir pleine fleur tanné végétal, Goodyear Welt artisanal',
    price: 65000,
    brand: 'ClassicLeather', isFeatured: true, isNewArrival: false,
    material: 'Cuir de veau pleine fleur tanné végétal, semelle cuir+caoutchouc',
    features: ['Cuir pleine fleur tanné végétal', 'Montage Goodyear Welt (réparable)', 'Semelle cuir + caoutchouc', 'Doublure cuir vachette', 'Laçage 5 œillets', 'Finition cirage à la main'],
    care: ['Cirer régulièrement avec cire de qualité', 'Sécher loin des sources de chaleur', 'Utiliser des embouchoirs en bois', 'Brosser après chaque port', 'Alterner les paires pour laisser sécher', 'Imperméabilisant cuir recommandé'],
    tags: ['derby', 'cuir', 'premium', 'élégant', 'goodyear welt', 'artisanal'],
    colors: [{ name: 'Marron Cognac', hex: '#7B3F00' }, { name: 'Noir', hex: '#0A0A0A' }],
    images: [
      { url: 'https://images.pexels.com/photos/265741/pexels-photo-265741.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Derby Cuir Véritable - chaussures oxford cuir marron', publicId: 'derby-premium-1' },
      { url: 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Derby Cuir - paire chaussures cuir premium', publicId: 'derby-premium-2' },
    ],
  },
  {
    catSlug: 'chaussures', type: 'shoes',
    name: 'Mocassin Cuir Casual',
    description: 'Mocassin sans lacets en cuir nappa souple de première qualité. Confort immédiat dès le premier port grâce à la semelle intérieure en cuir moulée à la forme du pied. Léger et flexible, idéal pour les journées longues.',
    shortDescription: 'Mocassin cuir nappa souple slip-on, confort immédiat',
    price: 48000, originalPrice: 55000, discountPercentage: 12, isOnSale: true,
    brand: 'ClassicLeather', isFeatured: true, isNewArrival: true,
    material: 'Cuir nappa souple, semelle TR légère',
    features: ['Cuir nappa souple première qualité', 'Slip-on sans lacets', 'Semelle TR légère et flexible', 'Doublure cuir respirante', 'Bande élastique côtés', 'Semelle intérieure cuir moulée'],
    care: ['Cuir nappa : crème hydratante régulière', 'Éviter la pluie intense', 'Sécher à l\'air loin de la chaleur', 'Embouchoirs pour garder la forme', 'Imperméabilisant cuir', 'Brosser légèrement à sec'],
    tags: ['mocassin', 'cuir', 'sans lacets', 'confort', 'bureau', 'casual'],
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Cognac', hex: '#9B6B47' }, { name: 'Marron', hex: '#7B3F00' }],
    images: [
      { url: 'https://images.pexels.com/photos/825890/pexels-photo-825890.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Mocassin Cuir Casual - loafers cuir marron', publicId: 'mocassin-cuir-1' },
      { url: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Mocassin - chaussures cuir casual', publicId: 'mocassin-cuir-2' },
    ],
  },
  {
    catSlug: 'chaussures', type: 'shoes',
    name: 'Boots Chelsea Cuir',
    description: 'Chelsea boots en cuir lisse avec les bandes élastiques latérales caractéristiques du style britannique. Bout rond légèrement carré, talon empilé 4cm. Un classique indémodable, élégant avec un costume comme casual avec un jean.',
    shortDescription: 'Chelsea boots cuir lisse bandes élastiques, talon 4cm',
    price: 58000,
    brand: 'LondonStyle', isFeatured: false, isNewArrival: true,
    material: 'Cuir lisse premium, semelle cuir+caoutchouc',
    features: ['Cuir lisse premium', 'Bandes élastiques latérales', 'Talon empilé 4cm', 'Bout carré arrondi', 'Semelle cuir + caoutchouc', 'Tab de traction arrière'],
    care: ['Cirer régulièrement', 'Imperméabilisant avant première sortie', 'Embouchoirs en bois', 'Sécher naturellement', 'Éviter de plier les élastiques en rangement', 'Alterner les paires'],
    tags: ['boots', 'chelsea', 'cuir', 'rock', 'british', 'élégant'],
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Marron Caramel', hex: '#C68642' }],
    images: [
      { url: 'https://images.pexels.com/photos/7034913/pexels-photo-7034913.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Boots Chelsea Cuir - hommes chaussures cuir habillé', publicId: 'chelsea-boots-1' },
      { url: 'https://images.pexels.com/photos/293406/pexels-photo-293406.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Chelsea Boots - chaussure cuir marron élégant', publicId: 'chelsea-boots-2' },
    ],
  },
  {
    catSlug: 'chaussures', type: 'shoes',
    name: 'Boots Lacets Desert Boot',
    description: 'Desert boots en daim de vachette avec semelle crêpe caractéristique. Inspirées des chaussures portées par les soldats britanniques au désert. 2 œillets seulement pour un laçage minimal. Légères, souples, elles s\'assouplissent au fil du port.',
    shortDescription: 'Desert boots daim semelle crêpe, légères et souples',
    price: 52000,
    brand: 'ClassicLeather', isFeatured: false, isNewArrival: true,
    material: 'Daim vachette naturel, semelle crêpe naturelle',
    features: ['Daim vachette souple', 'Semelle crêpe naturelle', '2 œillets laçage minimaliste', 'Tige basse légère', 'Doublure cuir', 'S\'assouplit avec le port'],
    care: ['Brosser avec brosse spéciale daim', 'Imperméabilisant daim impératif', 'Gomme à effacer pour taches légères', 'Ne jamais mouiller abondamment', 'Sécher à l\'air libre loin du soleil', 'Régénérer la couleur avec spray teinté'],
    tags: ['boots', 'desert boot', 'daim', 'crêpe', 'léger', 'classique'],
    colors: [{ name: 'Sable', hex: '#C2B280' }, { name: 'Marron', hex: '#7B3F00' }, { name: 'Gris Daim', hex: '#9E9E9E' }],
    images: [
      { url: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Desert Boot Daim - chaussures cuir casual table', publicId: 'desert-boot-1' },
      { url: 'https://images.pexels.com/photos/825890/pexels-photo-825890.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Desert Boot - loafers daim souple', publicId: 'desert-boot-2' },
    ],
  },
  {
    catSlug: 'chaussures', type: 'shoes',
    name: 'Richelieu Vernis Soirée',
    description: 'Richelieu en cuir verni pour les grandes occasions. Bout pointu élégant, finition miroir réfléchissante. La chaussure de soirée par excellence pour mariages, galas et événements formels. Semelle cuir fine avec anti-dérapant talon.',
    shortDescription: 'Richelieu cuir verni bout pointu, chaussure de soirée premium',
    price: 72000,
    brand: 'ClassicLeather', isFeatured: true, isNewArrival: false,
    material: 'Cuir verni premium, semelle cuir + caoutchouc talon',
    features: ['Cuir verni finition miroir', 'Bout pointu élégant', 'Semelle cuir fine', 'Anti-dérapant caoutchouc au talon', 'Doublure cuir nappa', 'Laçage 4 œillets'],
    care: ['Nettoyer avec chiffon doux sec', 'Pâte vernissante pour restaurer la brillance', 'Ne jamais utiliser de cirage gras', 'Stocker dans le sac fourni', 'Embouchoirs impératifs', 'Éviter humidité et rayures'],
    tags: ['richelieu', 'verni', 'soirée', 'élégant', 'mariage', 'formal'],
    colors: [{ name: 'Noir Verni', hex: '#0A0A0A' }, { name: 'Bordeaux Verni', hex: '#722F37' }],
    images: [
      { url: 'https://images.pexels.com/photos/293406/pexels-photo-293406.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Richelieu Vernis Soirée - chaussure cuir marron élégant', publicId: 'richelieu-vernis-1' },
      { url: 'https://images.pexels.com/photos/7034913/pexels-photo-7034913.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Richelieu Vernis - hommes lacets chaussures habillées', publicId: 'richelieu-vernis-2' },
    ],
  },
];

// ─── AVIS CLIENTS ──────────────────────────────────────────────────────────────
const reviewTemplates = [
  { rating: 5, title: 'Excellent produit !', comment: 'Très satisfait de mon achat. La qualité est au rendez-vous, la coupe est parfaite et la livraison rapide. Je recommande vivement !' },
  { rating: 5, title: 'Parfait, je recommande', comment: 'Conforme à la description, belle finition. J\'ai déjà reçu des compliments. Taille correctement selon le guide des tailles.' },
  { rating: 4, title: 'Très bon rapport qualité/prix', comment: 'Bonne qualité pour le prix. Le tissu est confortable et l\'article correspond bien aux photos. Livraison soignée.' },
  { rating: 4, title: 'Satisfait de mon achat', comment: 'Produit conforme à la description. Bonne qualité. Je reviendrai sûrement pour un prochain achat.' },
  { rating: 3, title: 'Correct dans l\'ensemble', comment: 'Article correct mais la taille est légèrement petite par rapport à d\'habitude. Je conseille de prendre une taille au-dessus.' },
  { rating: 5, title: 'Super qualité !', comment: 'Je suis agréablement surpris par la qualité des matériaux. C\'est encore mieux qu\'en photo. Livraison rapide et emballage soigné.' },
  { rating: 4, title: 'Bon article', comment: 'Bonne facture, rien à redire. Le style est sympa et le confort est au rendez-vous. Je le recommande.' },
];

// ─── SEED ──────────────────────────────────────────────────────────────────────
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connecté à MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('🗑️  Données existantes supprimées');

    // ── Utilisateurs ──────────────────────────────
    const admin = await User.create({
      firstName: 'Admin', lastName: 'Urban Style',
      email: 'admin@urbanstyle.sn', password: 'admin123456',
      role: 'admin', phone: '+221770000000',
    });
    await Cart.create({ user: admin._id, items: [] });

    const client = await User.create({
      firstName: 'Mamadou', lastName: 'Diallo',
      email: 'client@test.sn', password: 'client123456',
      role: 'client', phone: '+221771234567',
    });
    await Cart.create({ user: client._id, items: [] });

    const reviewers = await User.insertMany([
      { firstName: 'Ibrahima', lastName: 'Sow', email: 'ibrahima@test.sn', password: 'test123456', role: 'client', phone: '+221772000001' },
      { firstName: 'Fatou', lastName: 'Ndiaye', email: 'fatou@test.sn', password: 'test123456', role: 'client', phone: '+221772000002' },
      { firstName: 'Oumar', lastName: 'Ba', email: 'oumar@test.sn', password: 'test123456', role: 'client', phone: '+221772000003' },
      { firstName: 'Aminata', lastName: 'Fall', email: 'aminata@test.sn', password: 'test123456', role: 'client', phone: '+221772000004' },
    ]);
    for (const r of reviewers) {
      await Cart.create({ user: r._id, items: [] });
    }

    console.log(`✅ ${2 + reviewers.length} utilisateurs créés`);
    console.log('   → Admin  : admin@urbanstyle.sn / admin123456');
    console.log('   → Client : client@test.sn / client123456');

    // ── Catégories ───────────────────────────────
    const createdCats = await Category.insertMany(categories);
    const catMap = Object.fromEntries(createdCats.map((c) => [c.slug, c._id]));
    console.log(`✅ ${createdCats.length} catégories créées`);

    // ── Produits ─────────────────────────────────
    const allUsers = [client, ...reviewers];
    let totalReviews = 0;

    for (let i = 0; i < products.length; i++) {
      const { catSlug, colors: colorList, ...rest } = products[i];

      const slug = rest.name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const product = await Product.create({
        ...rest,
        slug: `${slug}-${i}`,
        category: catMap[catSlug] || createdCats[0]._id,
        variants: generateVariants(rest.type, colorList),
        averageRating: 0,
        totalReviews: 0,
        salesCount: Math.floor(Math.random() * 300) + 20,
      });

      // Ajouter 2 à 4 avis par produit
      const nbReviews = Math.floor(Math.random() * 3) + 2;
      const usedUsers = allUsers.slice(0, nbReviews);
      for (const user of usedUsers) {
        const tpl = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        await Review.create({
          product: product._id,
          user: user._id,
          rating: tpl.rating,
          title: tpl.title,
          comment: tpl.comment,
          isVerifiedPurchase: Math.random() > 0.3,
          isApproved: true,
          helpfulCount: Math.floor(Math.random() * 10),
        });
        totalReviews++;
      }

      process.stdout.write(`\r   → Produits : ${i + 1}/${products.length}`);
    }

    // Mettre à jour le compteur productCount dans chaque catégorie
    for (const cat of createdCats) {
      const count = await Product.countDocuments({ category: cat._id });
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    console.log(`\n✅ ${products.length} produits créés avec ${totalReviews} avis`);

    console.log('\n🎉 Base de données remplie avec succès !');
    console.log('═'.repeat(50));
    console.log('  Admin  : admin@urbanstyle.sn  | admin123456');
    console.log('  Client : client@test.sn        | client123456');
    console.log('═'.repeat(50));
    console.log(`  Catégories : ${createdCats.length}`);
    console.log(`  Produits   : ${products.length}`);
    console.log(`  Avis       : ${totalReviews}`);
    console.log('═'.repeat(50));

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erreur seed:', err.message);
    if (err.errors) {
      Object.entries(err.errors).forEach(([k, v]) => console.error(`   ${k}: ${v.message}`));
    }
    process.exit(1);
  }
};

run();
