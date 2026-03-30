// ══════════════════════════════════════════════
// GPS Location Verification — Anti-Proxy System
// ══════════════════════════════════════════════
import { COLLEGE } from './constants';

/**
 * Haversine formula — calculates distance in meters between two GPS points.
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if coordinates are within the college radius.
 * Returns { valid, distance }
 */
export const isWithinCollege = (lat, lng) => {
  const distance = haversineDistance(lat, lng, COLLEGE.latitude, COLLEGE.longitude);
  return {
    valid: distance <= COLLEGE.radiusMeters,
    distance: Math.round(distance),
  };
};

/**
 * Get current GPS position from browser.
 * Returns a Promise<{ latitude, longitude }>.
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable GPS.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location unavailable. Ensure GPS is enabled.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'));
            break;
          default:
            reject(new Error('An unknown GPS error occurred.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};
