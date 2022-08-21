// Set your secret key. Remember to switch to your live secret key in production.
//https://dashboard.stripe.com/apikeys See your keys here: https://dashboard.stripe.com/apikeys
// const stripe = require('stripe')('sk_test_51LXuYnATKb0UAcSTVcbJMRDpmIANqaWRZ8MJDukPPQPI8h4Hxt6maaujMdj2ZGpKMRTk9Bkjxvt74LvJfupbOUEU004jR1HGgA');
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);


// This example uses Express to receive webhooks
const express = require("express");
const router = express.Router();

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');


//checkout data

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });
  res.send({ url: session.url });

});

// Match the raw body to content type application/json
router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const event = request.body;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
});

module.exports = router;
