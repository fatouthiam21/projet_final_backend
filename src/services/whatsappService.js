const generateWhatsAppMessage = (order, user) => {
  const phone = (process.env.WHATSAPP_PHONE_NUMBER || '+221000000000').replace(/[^0-9]/g, '');

  const itemsList = order.items
    .map((item) => `  • ${item.name} (${item.size} / ${item.color}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  const message = `
🛍️ *Nouvelle Commande - Urban Style*

📋 *Numéro de commande:* ${order.orderNumber}
👤 *Client:* ${user.firstName} ${user.lastName}
📱 *Téléphone:* ${user.phone || 'Non renseigné'}

📦 *Articles commandés:*
${itemsList}

💰 *Sous-total:* ${formatPrice(order.subtotal)}
🚚 *Livraison:* ${order.shippingCost === 0 ? 'Gratuite' : formatPrice(order.shippingCost)}
💳 *Total:* ${formatPrice(order.total)}

📍 *Adresse de livraison:*
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.country}

Merci pour votre commande ! 🙏
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return { message, whatsappUrl, phone };
};

const generateProductInquiry = (product) => {
  const phone = (process.env.WHATSAPP_PHONE_NUMBER || '+221000000000').replace(/[^0-9]/g, '');
  const message = `Bonjour ! Je suis intéressé(e) par le produit *${product.name}* à ${formatPrice(product.price)}. Pouvez-vous me donner plus d'informations ?`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

const formatPrice = (price) =>
  new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);

module.exports = { generateWhatsAppMessage, generateProductInquiry };
