import { db } from '../firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

// ──────────────────────────────────────────────
//  USER OPERATIONS
// ──────────────────────────────────────────────

export const createUserProfile = async (uid, data) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        name: data.name || '',
        email: data.email || '',
        role: data.role || null,
        assignedAmbulance: data.assignedAmbulance || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true });
};

export const getUserProfile = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserRole = async (uid, role) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role, updatedAt: serverTimestamp() });
};

export const linkAmbulanceToUser = async (uid, ambulanceId) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        assignedAmbulance: ambulanceId,
        updatedAt: serverTimestamp()
    });
};

// ──────────────────────────────────────────────
//  AMBULANCE OPERATIONS
// ──────────────────────────────────────────────

export const createAmbulance = async (ambulanceId, data) => {
    const ambRef = doc(db, 'ambulances', ambulanceId);
    await setDoc(ambRef, {
        unitId: data.unitId,
        driverName: data.driverName,
        driverUid: data.driverUid,
        vehicleType: data.vehicleType || 'BLS',
        contactNumber: data.contactNumber || '',
        baseStation: data.baseStation || '',
        status: 'idle',
        location: {
            lat: data.location?.lat || 0,
            lng: data.location?.lng || 0
        },
        address: data.address || 'Locating...',
        speed: 0,
        heading: 0,
        lastUpdate: serverTimestamp(),
        isOnline: true,
        createdAt: serverTimestamp()
    });
    return ambulanceId;
};

export const getAmbulance = async (ambulanceId) => {
    const ambRef = doc(db, 'ambulances', ambulanceId);
    const snap = await getDoc(ambRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateAmbulanceStatus = async (ambulanceId, status) => {
    const ambRef = doc(db, 'ambulances', ambulanceId);
    await updateDoc(ambRef, {
        status,
        lastUpdate: serverTimestamp()
    });
};

export const updateAmbulanceLocation = async (ambulanceId, locationData) => {
    const ambRef = doc(db, 'ambulances', ambulanceId);
    await updateDoc(ambRef, {
        location: {
            lat: locationData.lat,
            lng: locationData.lng
        },
        speed: locationData.speed || 0,
        heading: locationData.heading || 0,
        address: locationData.address || '',
        lastUpdate: serverTimestamp()
    });
};

export const setAmbulanceOnline = async (ambulanceId, isOnline) => {
    const ambRef = doc(db, 'ambulances', ambulanceId);
    await updateDoc(ambRef, {
        isOnline,
        lastUpdate: serverTimestamp()
    });
};

// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
//  HOSPITAL OPERATIONS
// ──────────────────────────────────────────────

export const createHospital = async (hospitalId, data) => {
    const hospRef = doc(db, 'hospitals', hospitalId);
    await setDoc(hospRef, {
        name: data.name,
        address: data.address,
        location: {
            lat: data.location?.lat || 0,
            lng: data.location?.lng || 0
        },
        capacity: data.capacity || 0,
        availableBeds: data.availableBeds || 0,
        emergencyAvailable: data.emergencyAvailable ?? true,
        contactNumber: data.contactNumber || '',
        createdAt: serverTimestamp()
    });
    return hospitalId;
};

export const linkHospitalToUser = async (uid, hospitalId) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        assignedHospital: hospitalId,
        updatedAt: serverTimestamp()
    });
};

export const getHospitals = async () => {
    const q = query(collection(db, 'hospitals'), orderBy('name'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getHospitalById = async (hospitalId) => {
    const ref = doc(db, 'hospitals', hospitalId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ──────────────────────────────────────────────
//  TRIP OPERATIONS
// ──────────────────────────────────────────────

export const createTrip = async (tripData) => {
    const tripRef = doc(collection(db, 'trips'));
    const trip = {
        ambulanceId: tripData.ambulanceId,
        driverUid: tripData.driverUid,
        patientName: tripData.patientName,
        emergencyType: tripData.emergencyType,
        pickupLocation: {
            lat: tripData.pickupLocation?.lat || 0,
            lng: tripData.pickupLocation?.lng || 0,
            address: tripData.pickupLocation?.address || ''
        },
        destinationHospital: tripData.destinationHospital || null,
        assignedBy: tripData.assignedBy || 'self',
        status: 'accepted',
        timestamps: {
            assignedAt: serverTimestamp(),
            startedAt: serverTimestamp(),
            completedAt: null
        },
        createdAt: serverTimestamp()
    };
    await setDoc(tripRef, trip);
    return { id: tripRef.id, ...trip };
};

export const updateTripStatus = async (tripId, newStatus) => {
    const tripRef = doc(db, 'trips', tripId);
    const updates = { status: newStatus };

    if (newStatus === 'completed' || newStatus === 'cancelled') {
        updates['timestamps.completedAt'] = serverTimestamp();
    }

    await updateDoc(tripRef, updates);
};

export const getActiveTrip = async (ambulanceId) => {
    const activeStatuses = ['assigned', 'accepted', 'en_route', 'at_scene', 'transporting'];
    const q = query(
        collection(db, 'trips'),
        where('ambulanceId', '==', ambulanceId),
        where('status', 'in', activeStatuses),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
};

export const getTripHistory = async (ambulanceId, count = 10) => {
    const q = query(
        collection(db, 'trips'),
        where('ambulanceId', '==', ambulanceId),
        where('status', 'in', ['completed', 'cancelled']),
        orderBy('createdAt', 'desc'),
        limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllActiveTrips = async () => {
    const activeStatuses = ['assigned', 'accepted', 'en_route', 'at_scene', 'transporting'];
    const q = query(
        collection(db, 'trips'),
        where('status', 'in', activeStatuses)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllAmbulances = async () => {
    const q = query(collection(db, 'ambulances'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
