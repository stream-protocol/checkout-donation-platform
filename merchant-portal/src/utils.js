export function centsToDollars(cents) {
  return (cents / 100).toLocaleString(
    "en-US", 
    {
      style:"decimal", 
      currency:"USD", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}