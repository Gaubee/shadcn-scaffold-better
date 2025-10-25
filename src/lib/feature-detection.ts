/**
 * Feature Detection and Polyfill Adapter System
 *
 * This module provides a centralized system for detecting browser support
 * for modern web features and automatically loading polyfills when needed.
 *
 * Inspired by CSS.supports(), this provides a unified interface for
 * feature detection across HTML, CSS, and JavaScript APIs.
 */

export interface FeatureSupport {
  supported: boolean;
  polyfillNeeded: boolean;
  polyfillUrl?: string;
}

export type FeatureName =
  | "scroll-timeline"
  | "container-queries"
  | "view-transitions"
  | "viewport-segments"
  | "resize-observer"
  | "intersection-observer"
  | "superellipse-corners"
  | "backdrop-filter";

/**
 * Feature detection registry
 * Maps feature names to detection functions
 */
const featureDetectors: Record<FeatureName, () => boolean> = {
  "scroll-timeline": () => {
    if (typeof window === "undefined" || typeof CSS === "undefined") return false;
    return CSS.supports("animation-timeline: scroll()") || "scrollTimeline" in document.documentElement.style;
  },

  "container-queries": () => {
    if (typeof window === "undefined" || typeof CSS === "undefined") return false;
    return CSS.supports("container-type: inline-size");
  },

  "view-transitions": () => {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    return "startViewTransition" in document;
  },

  "viewport-segments": () => {
    if (typeof window === "undefined") return false;
    return "visualViewport" in window && "segments" in (window.visualViewport || {});
  },

  "resize-observer": () => {
    if (typeof window === "undefined") return false;
    return "ResizeObserver" in window;
  },

  "intersection-observer": () => {
    if (typeof window === "undefined") return false;
    return "IntersectionObserver" in window;
  },

  "superellipse-corners": () => {
    if (typeof window === "undefined" || typeof CSS === "undefined") return false;
    return CSS.supports("corner-shape", "superellipse(2)");
  },

  "backdrop-filter": () => {
    if (typeof window === "undefined" || typeof CSS === "undefined") return false;
    return CSS.supports("backdrop-filter", "blur(10px)") || CSS.supports("-webkit-backdrop-filter", "blur(10px)");
  },
};

/**
 * Polyfill configuration for features that need them
 * These would be loaded dynamically when needed
 */
interface PolyfillConfig {
  url: string;
  type?: "script" | "module";
  globalCheck?: () => boolean;
}

const polyfillConfigs: Partial<Record<FeatureName, PolyfillConfig>> = {
  "resize-observer": {
    // Use UMD build instead of ES module
    url: "https://unpkg.com/@juggle/resize-observer@3.4.0/dist/ResizeObserver.js",
    type: "script",
    globalCheck: () => typeof window !== "undefined" && "ResizeObserver" in window,
  },
  "intersection-observer": {
    url: "https://unpkg.com/intersection-observer@0.12.2/intersection-observer.js",
    type: "script",
    globalCheck: () => typeof window !== "undefined" && "IntersectionObserver" in window,
  },
};

/**
 * Cache for feature detection results
 * Avoids repeated expensive checks
 */
const featureCache = new Map<FeatureName, FeatureSupport>();

/**
 * Detect if a feature is supported by the browser
 *
 * @param feature - The feature to check
 * @returns Feature support information
 *
 * @example
 * ```ts
 * const scrollTimeline = supports('scroll-timeline');
 * if (scrollTimeline.supported) {
 *   // Use native scroll-timeline
 * } else if (scrollTimeline.polyfillNeeded) {
 *   // Load polyfill
 *   await loadPolyfill('scroll-timeline');
 * }
 * ```
 */
export function supports(feature: FeatureName): FeatureSupport {
  // Check cache first
  if (featureCache.has(feature)) {
    return featureCache.get(feature)!;
  }

  const detector = featureDetectors[feature];
  if (!detector) {
    throw new Error(`Unknown feature: ${feature}`);
  }

  const supported = detector();
  const polyfillConfig = polyfillConfigs[feature];
  const result: FeatureSupport = {
    supported,
    polyfillNeeded: !supported && !!polyfillConfig,
    polyfillUrl: polyfillConfig?.url,
  };

  featureCache.set(feature, result);
  return result;
}

/**
 * Batch check multiple features
 *
 * @param features - Array of features to check
 * @returns Map of feature names to support information
 */
export function supportsAll(features: FeatureName[]): Map<FeatureName, FeatureSupport> {
  const results = new Map<FeatureName, FeatureSupport>();
  for (const feature of features) {
    results.set(feature, supports(feature));
  }
  return results;
}

/**
 * Load a polyfill dynamically
 *
 * @param feature - The feature to load a polyfill for
 * @returns Promise that resolves when polyfill is loaded
 */
export async function loadPolyfill(feature: FeatureName): Promise<void> {
  const support = supports(feature);

  if (support.supported) {
    // Feature already supported, no polyfill needed
    return;
  }

  const polyfillConfig = polyfillConfigs[feature];
  if (!polyfillConfig) {
    console.warn(`No polyfill available for feature: ${feature}`);
    return;
  }

  // Check if polyfill already loaded by checking global
  if (polyfillConfig.globalCheck && polyfillConfig.globalCheck()) {
    // Polyfill already loaded and feature is now available
    featureCache.delete(feature);
    return;
  }

  // Check if script tag already exists
  const scriptId = `polyfill-${feature}`;
  if (document.getElementById(scriptId)) {
    // Script already loading or loaded, wait for it
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (polyfillConfig.globalCheck && polyfillConfig.globalCheck()) {
          clearInterval(checkInterval);
          featureCache.delete(feature);
          resolve();
        }
      }, 50);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error(`Timeout loading polyfill for ${feature}`));
      }, 5000);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = polyfillConfig.url;
    script.async = true;

    // Set type if specified (for ES modules)
    if (polyfillConfig.type === "module") {
      script.type = "module";
    }

    script.onload = () => {
      // Verify polyfill actually loaded
      if (polyfillConfig.globalCheck && !polyfillConfig.globalCheck()) {
        // Wait a bit for polyfill to initialize
        setTimeout(() => {
          if (polyfillConfig.globalCheck && polyfillConfig.globalCheck()) {
            featureCache.delete(feature);
            resolve();
          } else {
            const error = new Error(`Polyfill loaded but ${feature} still not available`);
            console.error(error);
            reject(error);
          }
        }, 100);
      } else {
        // Clear cache to re-detect
        featureCache.delete(feature);
        resolve();
      }
    };

    script.onerror = (event) => {
      const error = new Error(`Failed to load polyfill for ${feature} from ${polyfillConfig.url}`);
      console.error(error, event);
      // Remove failed script
      const failedScript = document.getElementById(scriptId);
      if (failedScript) {
        failedScript.remove();
      }
      reject(error);
    };

    document.head.appendChild(script);
  });
}

/**
 * Automatically load all required polyfills for a component
 *
 * @param features - Array of features the component needs
 * @returns Promise that resolves when all polyfills are loaded
 */
export async function ensureFeatures(features: FeatureName[]): Promise<void> {
  const supportMap = supportsAll(features);
  const polyfillsToLoad: FeatureName[] = [];

  for (const [feature, support] of supportMap) {
    if (support.polyfillNeeded) {
      polyfillsToLoad.push(feature);
    }
  }

  if (polyfillsToLoad.length === 0) {
    return;
  }

  await Promise.all(polyfillsToLoad.map(loadPolyfill));
}

/**
 * Custom hook to check feature support and load polyfills
 * Can be used in React components
 *
 * @param feature - The feature to check
 * @returns Support information
 */
export function useFeatureSupport(feature: FeatureName): FeatureSupport {
  if (typeof window === "undefined") {
    return { supported: false, polyfillNeeded: false };
  }

  return supports(feature);
}

/**
 * Get a report of all features and their support status
 * Useful for debugging and documentation
 */
export function getFeatureReport(): Record<FeatureName, FeatureSupport> {
  const report: Record<string, FeatureSupport> = {};
  const allFeatures = Object.keys(featureDetectors) as FeatureName[];

  for (const feature of allFeatures) {
    report[feature] = supports(feature);
  }

  return report as Record<FeatureName, FeatureSupport>;
}

/**
 * Clear the feature detection cache
 * Useful for testing or when features change
 */
export function clearCache(): void {
  featureCache.clear();
}
