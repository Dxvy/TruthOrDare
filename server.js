require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route pour créer un Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, email, mode } = req.body;

    // Validation
    if (!amount || !currency || !email) {
      return res.status(400).json({
        error: 'Paramètres manquants'
      });
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // En centimes (50 = 0,50€)
      currency: currency,
      receipt_email: email,
      metadata: {
        mode: mode,
        app: 'Action Vérité'
      }
    });

    // Retourner le client secret
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Route pour vérifier le statut d'un paiement
app.post('/verify-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook pour recevoir les événements Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Gérer les événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Paiement réussi:', event.data.object.id);
        // TODO: Débloquer le premium pour l'utilisateur
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Paiement échoué:', event.data.object.id);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Erreur webhook:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
