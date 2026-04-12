import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for real-time GPS tracking.
 * Uses the browser Geolocation API with watchPosition.
 * Optionally calls onLocationUpdate callback with new coordinates.
 */
const useGeolocation = ({ enabled = true, onLocationUpdate = null, updateInterval = 5000 } = {}) => {
    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
        speed: 0,
        heading: 0,
        accuracy: 0,
        timestamp: null
    });
    const [error, setError] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // prompt | granted | denied
    const lastUpdateRef = useRef(0);
    const watchIdRef = useRef(null);

    const handleSuccess = useCallback((position) => {
        const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            accuracy: position.coords.accuracy || 0,
            timestamp: position.timestamp
        };

        setLocation(newLocation);
        setError(null);
        setPermissionStatus('granted');

        // Throttle Firestore updates
        const now = Date.now();
        if (onLocationUpdate && (now - lastUpdateRef.current > updateInterval)) {
            lastUpdateRef.current = now;
            onLocationUpdate(newLocation);
        }
    }, [onLocationUpdate, updateInterval]);

    const handleError = useCallback((err) => {
        setError(err.message);
        if (err.code === 1) {
            setPermissionStatus('denied');
        }
    }, []);

    useEffect(() => {
        if (!enabled || !navigator.geolocation) {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by this browser');
            }
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };

        watchIdRef.current = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            options
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [enabled, handleSuccess, handleError]);

    return {
        ...location,
        error,
        permissionStatus,
        isTracking: enabled && permissionStatus === 'granted'
    };
};

export default useGeolocation;
