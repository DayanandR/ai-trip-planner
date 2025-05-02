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

const MyTrips = () => {
  const [userTrips, setUserTrips] = useState<DocumentData[]>([]);

  const [destinationImages, setDestinationImages] = useState<{
    [key: string]: string;
  }>({});

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

  const navigation = useNavigate();

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigation("/");
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
  };

  
  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 lg:grid-cols-4">
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
  );
};

export default MyTrips;
