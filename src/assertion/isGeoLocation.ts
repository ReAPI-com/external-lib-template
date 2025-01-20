function isGeoLocationValue(value: any): boolean {
  if (!value) return false;

  // Handle array format [lat, lng]
  if (Array.isArray(value)) {
    if (value.length !== 2) return false;
    const [lat, lng] = value;
    return isValidLatitude(lat) && isValidLongitude(lng);
  }

  // Handle object format {lat, lng}
  if (typeof value === "object") {
    if (!("lat" in value) || !("lng" in value)) return false;
    return isValidLatitude(value.lat) && isValidLongitude(value.lng);
  }

  return false;
}

function isValidLatitude(lat: any): boolean {
  return typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: any): boolean {
  return typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;
}

export function isGeoLocation(value: any) {
  if (isGeoLocationValue(value)) {
    $addAssertionResult({
      passed: true,
      leftValue: value,
      message: "The value is a valid geo location",
    });
  } else {
    $addAssertionResult({
      passed: false,
      leftValue: value,
      message: "The value is not a valid geo location",
    });
  }
}

export const isGeoLocationAssertion: AssertionFunction = {
  id: "reapi-is-geo-location",
  noOfParams: 1,
  function: isGeoLocation,
};
