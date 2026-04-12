import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserProfile, getAmbulance } from '../services/firestoreService';

/**
 * Custom hook for authentication state management.
 * Provides user, userProfile (Firestore), ambulance data, and loading state.
 */
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [ambulance, setAmbulance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);

                    // If user has an assigned ambulance, fetch that too
                    if (profile?.assignedAmbulance) {
                        const amb = await getAmbulance(profile.assignedAmbulance);
                        setAmbulance(amb);
                    } else {
                        setAmbulance(null);
                    }
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setUserProfile(null);
                    setAmbulance(null);
                }
            } else {
                setUserProfile(null);
                setAmbulance(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    const refreshProfile = async () => {
        if (!auth.currentUser) return;
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
        if (profile?.assignedAmbulance) {
            const amb = await getAmbulance(profile.assignedAmbulance);
            setAmbulance(amb);
        }
    };

    return {
        user,
        userProfile,
        ambulance,
        loading,
        logout,
        refreshProfile
    };
};

export default useAuth;
