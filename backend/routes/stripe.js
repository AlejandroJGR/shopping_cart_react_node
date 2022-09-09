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
const { Order } = require("../models/order");


//checkout data

router.post('/create-checkout-session', async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems)
    }
  })

  const session = await stripe.checkout.sessions.create({
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
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

//create Order
const createOrder = async(customer, data) =>{
  const Items = JSON.parse(customer.metadata.cart);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: Items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_detail,
    payment_status: data.payment_status,
  });
  try{
   const savedOrder = await newOrder.save();
   console.log("Processed Order:", savedOrder);
  }catch(err){
    console.log(err);
  }
}

//STRIPE WEBHOOK
// let endpointSecret = "whsec_0426d231532740046689984baf95c1d0b165e32e55b6404ea7befb436c1b8c1a";

// Match the raw body to content type application/json
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const event = req.body;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data)
        })
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
