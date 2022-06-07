export const getDefaultConfigs = (recipients) => {
  return [
    {
      id: 0,
      name: "Round up to the nearest dollar",
      type: "single",
      options: [
        {
          type: "roundup",
          donation_cents: 14,
          purchase_cents: 286,
          transaction_cents: 300,
          recipient: recipients[0]
        },
      ],
    },
    {
      id: 1,
      name: "Donate a fixed amount",
      type: "single",
      options: [
        {
          type: "fixed",
          donation_cents: 100,
          purchase_cents: 286,
          transaction_cents: 386,
          recipient: recipients[0]
        },
      ],
    },
    {
      id: 2,
      name: "Customer enters donation amount",
      type: "single",
      options: [
        {
          type: "input",
          donation_cents: 100,
          purchase_cents: 286,
          transaction_cents: 386,
          recipient: recipients[0]
        },
      ],
    },
    {
      id: 3,
      name: "Multiple donation types",
      type: "multi_type",
      options: [
        {
          type: "fixed",
          donation_cents: 100,
          purchase_cents: 286,
          transaction_cents: 386,
          recipient: recipients[0]
        },
        {
          type: "fixed",
          donation_cents: 300,
          purchase_cents: 286,
          transaction_cents: 586,
          recipient: recipients[0]
        },
        {
          type: "fixed",
          donation_cents: 500,
          purchase_cents: 286,
          transaction_cents: 786,
          recipient: recipients[0]
        },
        {
          type: "input",
          donation_cents: 100,
          purchase_cents: 286,
          transaction_cents: 386,
          recipient: recipients[0]
        },
      ],
    },
    {
      id: 4,
      name: "Multiple donation recipients",
      type: "multi_recipient",
      options: [
        {
          type: "roundup",
          donation_cents: 14,
          purchase_cents: 286,
          transaction_cents: 300,
          recipient: recipients[0]
        },
        {
          type: "roundup",
          donation_cents: 14,
          purchase_cents: 286,
          transaction_cents: 300,
          recipient: recipients[1]
        },
        {
          type: "roundup",
          donation_cents: 14,
          purchase_cents: 286,
          transaction_cents: 300,
          recipient: recipients[2]
        },
      ],
    },
    {
      id: 5,
      name: "Custom configurations",
      type: "custom",
      options: [
        {
          type: "fixed",
          donation_cents: 100,
          purchase_cents: 286,
          transaction_cents: 386,
          recipient: recipients[0]
        },
        {
          type: "input",
          donation_cents: 500,
          purchase_cents: 286,
          transaction_cents: 786,
          recipient: recipients[1]
        },
        {
          type: "roundup",
          donation_cents: 14,
          purchase_cents: 286,
          transaction_cents: 300,
          recipient: recipients[2]
        },
      ],
    },
  ];
} 