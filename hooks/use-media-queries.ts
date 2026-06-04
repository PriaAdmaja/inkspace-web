import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

type MediaQueries = {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  "2xl": boolean;
};

export function useMediaQueries(): MediaQueries {
  const getMatches = (): MediaQueries => {
    if (typeof window === "undefined") {
      return {
        sm: false,
        md: false,
        lg: false,
        xl: false,
        "2xl": false,
      };
    }

    return {
      sm: window.matchMedia(BREAKPOINTS.sm).matches,
      md: window.matchMedia(BREAKPOINTS.md).matches,
      lg: window.matchMedia(BREAKPOINTS.lg).matches,
      xl: window.matchMedia(BREAKPOINTS.xl).matches,
      "2xl": window.matchMedia(BREAKPOINTS["2xl"]).matches,
    };
  };

  const [matches, setMatches] = useState<MediaQueries>(getMatches);

  useEffect(() => {
    const mediaQueries = Object.entries(BREAKPOINTS).map(([key, query]) => ({
      key,
      mql: window.matchMedia(query),
    }));

    const update = () => setMatches(getMatches());

    mediaQueries.forEach(({ mql }) => {
      mql.addEventListener("change", update);
    });

    update();

    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener("change", update);
      });
    };
  }, []);

  return matches;
}