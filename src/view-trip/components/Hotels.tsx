import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface tripDataProps {
  tripData?: any;
}

const Hotels = ({ tripData }: tripDataProps) => {
  const [hotelImages, setHotelImages] = useState<{ [key: string]: string }>({});

  const fetchHotelImage = async (hotelName: string, address: string) => {
    const query = `${hotelName} ${address} hotel`;

    try {
      const response = await fetch(
        `https://nodejs-serverless-function-express-dun-theta-53.vercel.app/api/hotel-image?q=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();
      return data?.image || "/fallback-image.jpg"; 
    } catch (error) {
      console.error("Error fetching hotel image:", error);
      return "/fallback-image.jpg"; 
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!tripData?.tripData?.hotels) return;

      const images: { [key: string]: string } = {};

      await Promise.all(
        tripData.tripData.hotels.map(async (hotel: any) => {
          const key = hotel.HotelName;
          const imageUrl = await fetchHotelImage(
            hotel.HotelName,
            hotel.HotelAddress
          );
          images[key] = imageUrl;
        })
      );

      setHotelImages(images);
    };

    loadImages();
  }, [tripData]);

  return (
    <div>
      <h2 className="font-bold text-xl my-5">Hotel Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {tripData?.tripData?.hotels?.map((hotel: any, index: any) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel?.HotelName}, ${hotel?.HotelAddress}`}
            target="_blank"
          >
            <div className="hover:scale-105 cursor-pointer transition-all">
              <img
                className="rounded-lg w-full h-40 object-cover"
                src={hotelImages[hotel.HotelName] || "/fallback-image.jpg"}
                alt={hotel.HotelName}
              />
              <div className="my-2">
                <h2>{hotel?.HotelName}</h2>
                <h2 className="text-xs text-gray-500">
                  📍 {hotel?.HotelAddress}
                </h2>
                <h2 className="text-sm">💰 {hotel.Price}</h2>
                <h2 className="text-sm">⭐ {hotel.Rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
