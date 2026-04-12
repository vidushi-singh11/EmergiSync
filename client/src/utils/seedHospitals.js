import { db } from '../firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

export const HOSPITALS = [
    {
        id: 'city-general',
        name: 'City General Hospital',
        address: '1200 Main Street, Downtown',
        location: { lat: 28.6139, lng: 77.2090 },
        capacity: 500,
        availableBeds: 42,
        emergencyAvailable: true,
        contactNumber: '+91 11 2345 6789'
    },
    {
        id: 'st-jude',
        name: 'St. Jude Medical Center',
        address: '450 Healthcare Avenue, Sector 7',
        location: { lat: 28.6280, lng: 77.2180 },
        capacity: 350,
        availableBeds: 18,
        emergencyAvailable: true,
        contactNumber: '+91 11 3456 7890'
    },
    {
        id: 'metro-emergency',
        name: 'Metro Emergency Hospital',
        address: '88 Rapid Response Road, Civil Lines',
        location: { lat: 28.6350, lng: 77.2250 },
        capacity: 200,
        availableBeds: 7,
        emergencyAvailable: true,
        contactNumber: '+91 11 4567 8901'
    },
    {
        id: 'childrens-specialty',
        name: "Children's Specialty Hospital",
        address: '22 Pediatric Lane, Model Town',
        location: { lat: 28.6500, lng: 77.1920 },
        capacity: 150,
        availableBeds: 25,
        emergencyAvailable: true,
        contactNumber: '+91 11 5678 9012'
    },
    {
        id: 'trauma-care',
        name: 'Trauma Care Institute',
        address: '900 Emergency Drive, Connaught Place',
        location: { lat: 28.6320, lng: 77.2195 },
        capacity: 300,
        availableBeds: 12,
        emergencyAvailable: true,
        contactNumber: '+91 11 6789 0123'
    },
    {
        id: 'apollo-hospital',
        name: 'Apollo Emergency Center',
        address: '15 Sarita Vihar, Mathura Road',
        location: { lat: 28.5355, lng: 77.2890 },
        capacity: 700,
        availableBeds: 55,
        emergencyAvailable: true,
        contactNumber: '+91 11 7890 1234'
    }
];

/**
 * Seeds the hospitals collection in Firestore.
 * Only seeds if the collection is empty.
 */
export const seedHospitals = async () => {
    try {
        const snap = await getDocs(collection(db, 'hospitals'));
        if (!snap.empty) {
            console.log('Hospitals collection already has data. Skipping seed.');
            return false;
        }

        for (const hospital of HOSPITALS) {
            const { id, ...data } = hospital;
            await setDoc(doc(db, 'hospitals', id), data);
        }
        console.log(`✅ Seeded ${HOSPITALS.length} hospitals successfully.`);
        return true;
    } catch (err) {
        console.error('Error seeding hospitals:', err);
        return false;
    }
};

export default seedHospitals;
