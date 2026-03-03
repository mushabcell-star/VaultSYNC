/**
 * Menghitung nominal pembulatan untuk fitur Auto-Stash
 */
export const calculateAutoStash = (amount: number, roundTo: number = 10000): number => {
  if (amount <= 0) return 0;
  const remainder = amount % roundTo;
  if (remainder === 0) return 0;
  return roundTo - remainder;
};

/**
 * Mock function untuk sinkronisasi Open Banking
 */
export const syncExternalBankData = async (userId: string, providerId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    {
      bankName: "Bank Central Asia (BCA)",
      accountNumber: "****1234",
      balance: 12500000,
      currency: "IDR"
    }
  ];
};