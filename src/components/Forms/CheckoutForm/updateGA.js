const ReactGA = require('react-ga');

const debug = window.DEBUG || false;
const trackingId = debug ? 'UA-68399453-3' : 'UA-68399453-1';

ReactGA.initialize(trackingId, {
  debug
});
const ga = ReactGA.ga;

const google_trackConversion = window.google_trackConversion || null;

export const updateTransactionInGA = (workData, price, transaction_id) => {
  if (!workData) return;

  const revenue = `${price}`;
  let workName = `${workData.author_id}_${workData.work_id}`;
  if (workData.tuition_offer_id) {
    workName += `_${workData.tuition_offer_id}`;
  }

  let txId = `${transaction_id}`;
  if (transaction_id === undefined && price === 0) {
    txId = 'ZeroPriced';
  }

  if (google_trackConversion) {
    google_trackConversion({
      google_conversion_id: 936783588,
      google_conversion_value: isNaN(price) ? 0 : price,
      google_remarketing_only: true
    });
  }

  ga('require', 'ecommerce');
  ga('ecommerce:addTransaction', {
    id: txId,
    revenue,
  });
  ga('ecommerce:addItem', {
    id: txId,                       // Transaction ID. Required.
    name: workName,                 // Product name. Required.
    sku: workData.title,            // SKU/code.
    category: workData.work_type,   // Category or variation.
    price: revenue,                 // Unit price.
    quantity: '1'                   // Quantity.
  });
  ga('ecommerce:send');
};
