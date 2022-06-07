export function centsToDollars(cents) {
  const dollars = (cents / 100).toLocaleString(
    "en-US", 
    {
      style:"decimal", 
      currency:"USD", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  if (cents % 100 === 0) {
    return dollars.substring(0, dollars.length - 3);
  } else {
    return dollars;
  }
}