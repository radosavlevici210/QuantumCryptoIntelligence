// Crypto utility functions

export const formatTokenAmount = (amount: string | number, decimals: number = 8): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
};

export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const shortenHash = (hash: string, chars: number = 6): string => {
  if (!hash) return '';
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

export const generateMockAddress = (): string => {
  return '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0');
};

export const generateMockHash = (): string => {
  return '0x' + Math.random().toString(16).substring(2, 66).padStart(64, '0');
};

export const validateTokenSymbol = (symbol: string): boolean => {
  return /^[A-Z]{2,10}$/.test(symbol);
};

export const validateTokenName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};
