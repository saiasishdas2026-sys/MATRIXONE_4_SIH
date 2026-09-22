/**
 * Utility functions for MATRIXONE
 */

export const formatINR = (amountInCrores) => {
  if (amountInCrores === undefined || amountInCrores === null) return '₹0 Cr';
  return `₹${Number(amountInCrores).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('en-IN');
};

export const getConfidenceBadge = (confidence) => {
  const score = Number(confidence);
  if (score >= 90) {
    return {
      label: 'HIGH CONFIDENCE',
      color: 'text-telemetry-emerald',
      bg: 'bg-telemetry-emerald/10 border-telemetry-emerald/30',
      dot: 'bg-telemetry-emerald',
      action: 'Auto-Mint Eligible'
    };
  }
  if (score >= 70) {
    return {
      label: 'NEAR DUPLICATE',
      color: 'text-telemetry-amber',
      bg: 'bg-telemetry-amber/10 border-telemetry-amber/30',
      dot: 'bg-telemetry-amber',
      action: 'L2 Review Required'
    };
  }
  return {
    label: 'POTENTIAL DIVERGENCE',
    color: 'text-telemetry-crimson',
    bg: 'bg-telemetry-crimson/10 border-telemetry-crimson/30',
    dot: 'bg-telemetry-crimson',
    action: 'Manual Inspection'
  };
};

export const truncateHash = (hash, len = 8) => {
  if (!hash) return '';
  return `${hash.slice(0, len)}...${hash.slice(-len)}`;
};

export const generateCNMC = (category = 'PETRO', noun = 'VLV', sequence = null) => {
  const seq = sequence || Math.floor(10000 + Math.random() * 90000);
  return `CNMC-${category.toUpperCase()}-${noun.toUpperCase()}-${seq}`;
};
