import { GeoUtils, StringUtils } from "./GeoUtils";

// This is required for type declaration to work on the web editor
declare global {
  const $$CustomLib: {
    GeoUtils: typeof GeoUtils;
    StringUtils: typeof StringUtils;
  };
}

export { GeoUtils, StringUtils };
