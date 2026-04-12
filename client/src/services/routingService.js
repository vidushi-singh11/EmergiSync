/**
 * Service to calculate optimal routes and ETA using Open Source Routing Machine (OSRM)
 */

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Calculates the driving time and distance between two points
 * @param {Object} start {lat, lng}
 * @param {Object} end {lat, lng}
 * @returns {Promise<Object>} { duration (seconds), distance (meters), routeGeometry }
 */
export const getRouteData = async (start, end) => {
    try {
        // OSRM format is lon,lat
        const url = `${OSRM_BASE_URL}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            return {
                duration: route.duration, // in seconds
                distance: route.distance, // in meters
                geometry: route.geometry  // GeoJSON LineString
            };
        }
        throw new Error('No route found');
    } catch (error) {
        console.error('OSRM Routing Error:', error);
        return null;
    }
};

/**
 * Iterates through available hospitals to find the fastest driving time
 * @param {Object} currentLocation {lat, lng}
 * @param {Array} hospitals Array of hospital objects containing {location: {lat, lng}}
 * @returns {Promise<Object>} The hospital object with appended {routeData: {duration, distance, geometry}}
 */
export const calculateFastestHospital = async (currentLocation, hospitals) => {
    if (!currentLocation || !currentLocation.lat || hospitals.length === 0) {
        return null;
    }

    let fastestHospital = null;
    let shortestDuration = Infinity;
    let bestRouteData = null;

    // We can do this sequentially or in parallel.
    // For a small list of hospitals, parallel fetch is fine.
    const routingPromises = hospitals.map(async (hospital) => {
        if (!hospital.location || !hospital.location.lat) return null;
        
        const routeData = await getRouteData(currentLocation, hospital.location);
        return {
            hospital,
            routeData
        };
    });

    const results = await Promise.all(routingPromises);

    for (const result of results) {
        if (result && result.routeData && result.routeData.duration < shortestDuration) {
            shortestDuration = result.routeData.duration;
            fastestHospital = result.hospital;
            bestRouteData = result.routeData;
        }
    }

    if (fastestHospital) {
        return {
            ...fastestHospital,
            routeData: bestRouteData
        };
    }

    return null;
};
