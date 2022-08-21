const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems)
    }
  })

  // const line_items = req.body.cartItems?.map((item) => {
  //   return {
  //     price_data: {
  //       currency: 'usd',
  //       product_data: {
  //         name: item.name,
  //         images: [item.image],
  //         description: item.desc,
  //         metadata: {
  //           id: item._id
  //         },
  //       },
  //       unit_amount: item.price * 100,
  //     },
  //     quantity: item.cartQuantity,
  //   };

  // });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'VE', 'UY', 'KR', 'JP', 'NL', 'GB', 'BE', 'AR'],
    },
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

//Stripe Webhook


// If you are testing your webhook locally with the Stripe CLI, you can find the
// endpoint's secret by running `stripe listen`. Otherwise, find your
// endpoint's secret in your webhook settings in the Developer Dashboard
let endpointSecret = "whsec_0426d231532740046689984baf95c1d0b165e32e55b6404ea7befb436c1b8c1a";

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  //code someone else made to resolve the webhook error
  // const payload = req.body;
  // const payloadString = JSON.stringify(payload, null, 2);
  // const header = stripe.webhooks.generateTestHeaderString({
  //   payload: payloadString,
  //   secret: endpointSecret,
  // });
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
  //   console.log(`Webhook Verified: `, event);
  // } catch (err) {
  //   console.log(`Webhook Error: ${err.message}`);
  //   res.status(400).send(`Webhook Error: ${(err).message}`);
  //   return;
  // }

  let data;
  let eventType;

  let event;
  const stripeSignature = req.headers['stripe-signature'];
  // if(stripeSignature === null) { throw new UnknownError('No stripe signature found!');  }

  const stripePayload = req.rawBody || req.body;
  // event = stripe.webhooks.constructEvent(stripePayload, stripeSignature?.toString(), endpointSecret);
  // console.log(event);
  if (endpointSecret) {
    console.log(endpointSecret);
    try {
      event = stripe.webhooks.constructEvent(stripePayload, stripeSignature, endpointSecret);
      console.log("Webhook verified");
      console.log(event);
      data = event.data.object;
      eventType = event.type;
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);

  }
  // if (eventType === "payment_intent.succeeded") {
  //   stripe.customers.retrieve(data.customer).then((customer) => {
  //     console.log(customer);
  //     console.log("data: ", data);
  //   }).catch(err => console.log(err));
  // }
  // Return a 200 response to acknowledge receipt of the event
  res.send(event);
  console.log("SE MANDO TODO");
  // res.json({received: true});
  // res.send().end();
});


module.exports = router;