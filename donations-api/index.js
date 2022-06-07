function getDonationConfig(merchantPublicKey, purchaseCents) {
  fetch(
    `http://127.0.0.1:5000/api/merchants/${merchantPublicKey}/donation-configs/active?purchase_amount=${purchaseCents}`, 
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: "include",
    }
  )
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw res.status;
    }
  })
  .then(
    (result) => {
      return result;
    },
    (error) => {
      switch(error) {
        default:
      }
  });
}

function markDonationComplete(
  merchantPublicKey, 
  selectedOption, 
  merchantTransactionId = null, 
  consumerPublicKey = null
) {
  fetch(
    `http://127.0.0.1:5000/api/marked-donations`, 
    {
      method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: "include",
			body: JSON.stringify({
				merchant_public_key: merchantPublicKey,
        merchant_transaction_id: merchantTransactionId,
        consumer_public_key: consumerPublicKey,
				selected_donation_option: selectedOption,
			})
    }
  );
}

exports.getDonationConfig = getDonationConfig;
exports.markDonationComplete = markDonationComplete;