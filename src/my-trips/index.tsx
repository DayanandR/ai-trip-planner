import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";
import { Button } from "../components/ui/button";

const MyTrips = () => {
  const [userTrips, setUserTrips] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true); // 👈 loading state added
  const [destinationImages, setDestinationImages] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();

  const fetchDestinationImage = async (destination: string) => {
    try {
      const response = await fetch(
        `https://nodejs-serverless-function-express-dun-theta-53.vercel.app/api/hotel-image?q=${encodeURIComponent(
          destination + " travel"
        )}`
      );
      const data = await response.json();
      return data?.image || "/fallback-image.jpg";
    } catch (error) {
      console.error("Error fetching destination image:", error);
      return "/fallback-image.jpg";
    }
  };

  const GetUserTrips = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);
    const q = query(
      collection(db, "trip-details"),
      where("user.email", "==", user.email)
    );

    const querySnapshot = await getDocs(q);
    const trips: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      trips.push({ ...doc.data(), id: doc.id });
    });

    setUserTrips(trips);
    setLoading(false); // 👈 mark loading complete
  };

  useEffect(() => {
    GetUserTrips();
  }, []);

  useEffect(() => {
    const loadDestinationImages = async () => {
      if (!userTrips || userTrips.length === 0) return;

      const images: { [key: string]: string } = {};

      await Promise.all(
        userTrips.map(async (trip: any) => {
          const destination = trip?.userSelection?.destination;
          if (destination && !images[destination]) {
            const image = await fetchDestinationImage(destination);
            images[destination] = image;
          }
        })
      );

      setDestinationImages(images);
    };

    loadDestinationImages();
  }, [userTrips]);

  return (
    <div className="mb-20">
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <p className="text-lg font-medium text-gray-500">
            Loading your trips...
          </p>
        </div>
      )}

      {!loading && userTrips.length > 0 && (
        <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-10">
          <h2 className="font-bold text-3xl">My Trips</h2>
          <div className="grid grid-cols-2 mt-10 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userTrips.map((trip) => (
              <UserTripCardItem
                trip={trip}
                key={trip.id}
                docId={trip.id}
                destinationImageUrl={
                  destinationImages[trip?.userSelection?.destination]
                }
              />
            ))}
          </div>
        </div>
      )}

      {!loading && userTrips.length === 0 && (
        <div className="flex justify-center items-center flex-col text-center px-4 mt-30">
          <h2 className="text-2xl font-semibold mb-2">No trips available</h2>
          <p className="text-gray-600 mb-4">
            You have no trips right now. Create new trips here to get started!
          </p>
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/create-trip")}
          >
            Create New Trip
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
