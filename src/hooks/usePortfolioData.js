import { useCallback, useEffect, useMemo, useState } from "react";
import seedData from "../data/portfolio.json";

const clone = (value) => JSON.parse(JSON.stringify(value));
const defaultStorageKey = seedData.site?.storageKey || "portfolio-cms-data";

const mergeWithSeed = (base, overrides) => {
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
    return clone(base);
  }

  return Object.entries(base).reduce(
    (merged, [key, value]) => {
      const override = overrides[key];
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        override &&
        typeof override === "object" &&
        !Array.isArray(override)
      ) {
        merged[key] = mergeWithSeed(value, override);
        return merged;
      }

      merged[key] = override === undefined ? clone(value) : override;
      return merged;
    },
    { ...overrides },
  );
};

const readStorage = () => {
  try {
    const stored = window.localStorage.getItem(defaultStorageKey);
    return stored ? mergeWithSeed(seedData, JSON.parse(stored)) : clone(seedData);
  } catch {
    return clone(seedData);
  }
};

const writeStorage = (value) => {
  window.localStorage.setItem(defaultStorageKey, JSON.stringify(value));
};

export function usePortfolioData() {
  const [portfolio, setPortfolio] = useState(readStorage);

  useEffect(() => {
    document.title = portfolio.site?.title || portfolio.personal?.name || "Portfolio";
  }, [portfolio]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === defaultStorageKey) {
        setPortfolio(event.newValue ? mergeWithSeed(seedData, JSON.parse(event.newValue)) : clone(seedData));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const savePortfolio = useCallback((nextPortfolio) => {
    setPortfolio(() => {
      const next = typeof nextPortfolio === "function" ? nextPortfolio(readStorage()) : nextPortfolio;
      writeStorage(next);
      return next;
    });
  }, []);

  const resetPortfolio = useCallback(() => {
    window.localStorage.removeItem(defaultStorageKey);
    setPortfolio(clone(seedData));
  }, []);

  const storageKey = useMemo(() => defaultStorageKey, []);

  return { portfolio, savePortfolio, resetPortfolio, seedData: clone(seedData), storageKey };
}
