const stripe = require('stripe');

const stripeProvider = stripe(process.env.STRIPE_SECRET_KEY);

async function verifyPaymentSession(sessionId, email) {
  try {
    const session = await stripeProvider.checkout.sessions.retrieve(sessionId);
    console.log(session);
    return (
      session.customer_details.email === email &&
      session.payment_status === process.env.EXPECTED_PAYMENT_STATUS
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  verifyPaymentSession,
};
