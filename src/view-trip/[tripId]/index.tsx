import { useParams } from "react-router-dom";
import { db } from "../../service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";

const ViewTrip = () => {
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { tripId } = useParams();

  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);

  const getTripData = async () => {
    if (!tripId) {
      toast("Invalid trip ID");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "trip-details", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTripData(docSnap.data());
      } else {
        toast("No trip found!");
      }
    } catch (err) {
      console.error("Error fetching trip:", err);
      toast("Something went wrong fetching your trip");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 mx:px-20 lg:px-44 xl:px-56 space-y-8 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-64 w-full bg-gray-200 rounded-lg" />
        <div className="h-6 w-1/4 bg-gray-300 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-40 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 mx:px-20 lg:px-44 xl:px-56">
      <InfoSection tripData={tripData} />
      <Hotels tripData={tripData} />
      <PlacesToVisit tripData={tripData} />
      <Footer />
    </div>
  );
};


export default ViewTrip;
