import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface placeProps {
  place: any;
  tripData: any;
}

const PlacesCardItem = ({ place, tripData }: placeProps) => {
  const [placeImages, setPlaceImages] = useState<{ [key: string]: string }>({});

  const fetchPlaceImage = async (placeName: string, placeDetails: string) => {
    const query = `${placeName} ${placeDetails} tourist`;

    try {
      const response = await fetch(
        `https://nodejs-serverless-function-express-dun-theta-53.vercel.app/api/hotel-image?q=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();
      return data?.image || "/fallback-image.png";
    } catch (error) {
      console.error("Error fetching place image:", error);
      return "/fallback-image.png";
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!tripData?.tripData?.itinerary) return;

      const images: { [key: string]: string } = {};

      await Promise.all(
        place.map(async (item: any) => {
          const key = item.PlaceName;
          const imageUrl = await fetchPlaceImage(
            item.PlaceName,
            item.PlaceDetails
          );
          images[key] = imageUrl;
        })
      );

      setPlaceImages(images);
    };

    loadImages();
  }, [tripData]);

  console.log("place", placeImages);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {place.map((item: any, index: any) => (
          <div key={index} className="border rounded-xl p-4 shadow-md hover:scale-105 cursor-pointer transition-all">
            <Link
              key={index}
              to={`https://www.google.com/maps/search/?api=1&query=${item.PlaceName}, ${item?.PlaceDetails}`}
              target="_blank"
            >
              <div className="flex gap-4 items-start">
                <img
                  className="rounded-lg w-[100px] h-[100px] object-cover"
                  src={placeImages[item?.PlaceName] || "/fallback-image.png"}
                  alt={item?.PlaceName}
                />
                <div>
                  <h2 className="font-bold text-md">{item.PlaceName}</h2>
                  <p className="text-sm text-gray-500">{item.PlaceDetails}</p>
                  <p className="  text-cyan-800">Best time to visit : {item.BestTimeToVisit}</p>

                  <p className="text-orange-500">{item.TimeSlot}</p>
                  <p className=" text-blue-900">Ticket price: {item.TicketPricing}</p>

                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlacesCardItem;
