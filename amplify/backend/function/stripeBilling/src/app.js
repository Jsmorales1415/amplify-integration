const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cors({ origin: '*' }));

const REDIRECTION_DOMAIN = process.env.REDIRECTION_DOMAIN;
const stripeProvider = stripe(
  'sk_test_51Me5OvAqTwCJPtzIiXtDNClkbITpnzbClLpl9ZTXh3qdhgAH5B4BsqYzp2NbgpXfAMX6X3LmRrPoHmI7nJgvyaYe00DZIEvsff'
);

//-----------Get products--------------------
app.get('/products', async (req, res) => {
  try {
    const products = await stripeProvider.products.list({});

    res.json(products.data);
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

//--------------Get Prices-------------------
app.get('/prices', async (req, res) => {
  try {
    const prices = await stripeProvider.prices.list({
      product: req.query.productId,
    });

    res.json(prices.data);
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

//--------Create checkout sesion--------------------
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripeProvider.checkout.sessions.create({
      billing_address_collection: 'required',
      line_items: [
        {
          price: req.body.price,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      mode: 'subscription',
      success_url: `${REDIRECTION_DOMAIN}/successful-payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${REDIRECTION_DOMAIN}?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

//-----Create portal session---------------
app.post('/create-portal-session', async (req, res) => {
  try {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const { customerId } = req.body;
    // const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = REDIRECTION_DOMAIN;

    const portalSession = await stripeProvider.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    res.redirect(303, portalSession.url);
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

//-----Retrieve session---------------
app.get('/retrieve-session', async (req, res) => {
  try {
    const session = await stripeProvider.checkout.sessions.retrieve(
      req.query.sessionId
    );

    res.json(session);
  } catch (err) {
    res.status(400).send(err.toString());
  }
});

app.listen(3001, () => {
  console.log('Server Connected');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
