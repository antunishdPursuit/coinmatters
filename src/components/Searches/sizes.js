// Product sizes come as text such as "1/2 Gallon", "64 Ounces", "1 Dozen" or
// "24 x 16.9 Fluid Ounces". Each is turned into an amount of one base unit so
// sizes of the same kind can be compared across stores.
const units = {
  ounce: { kind: "ounces", per: 1 },
  pound: { kind: "ounces", per: 16 },
  gallon: { kind: "ounces", per: 128 },
  dozen: { kind: "count", per: 12 },
  count: { kind: "count", per: 1 },
  slice: { kind: "slices", per: 1 },
  pizza: { kind: "pizzas", per: 1 },
};

const toNumber = (text) => {
  const [top, bottom] = text.split("/");
  return bottom ? Number(top) / Number(bottom) : Number(top);
};

// "24 x 16.9 Fluid Ounces" -> { kind: "ounces", amount: 405.6 }; null if unknown.
// Only the first part of "5.4 Ounces / 8 Count" is read.
export function parseSize(size) {
  const match = /^\s*(?:([\d.]+)\s*x\s*)?([\d./]+)\s+(?:fl(?:uid)?\s+)?([a-z]+)/i.exec(size || "");
  if (!match) {
    return null;
  }
  const unit = units[match[3].toLowerCase().replace(/s$/, "")];
  const amount = (match[1] ? Number(match[1]) : 1) * toNumber(match[2]);
  if (!unit || !(amount > 0)) {
    return null;
  }
  return { kind: unit.kind, amount: amount * unit.per };
}

// Marks each item that is smaller than the same item at another store, as long
// as both sizes are of the same kind.
export function markSmallerSizes(cheapestOptions) {
  const options = Object.values(cheapestOptions).flat().filter((option) => !option.unavailable);
  options.forEach((option) => {
    const size = parseSize(option.size);
    option.smaller = Boolean(size) && options.some((other) => {
      const otherSize = parseSize(other.size);
      return other.name === option.name && otherSize
        && otherSize.kind === size.kind && otherSize.amount > size.amount;
    });
  });
  return cheapestOptions;
}
