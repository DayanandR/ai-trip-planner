import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface UserTripCardItemProps {
  trip: {
    userSelection?: {
      destination?: string;
      travelers?: number;
      budget?: number;
      days?: number;
    };
  };
  docId?: any;
  destinationImageUrl?: string;
}

const UserTripCardItem = ({
  trip,
  docId,
  destinationImageUrl,
}: UserTripCardItemProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/view-trip/${docId}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 w-full max-w-sm  hover:scale-105  cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-300" />
        )}
        {destinationImageUrl && (
          <img
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={destinationImageUrl}
            alt="Trip Destination"
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {trip?.userSelection?.destination ?? "Unknown Destination"}
        </h2>
        <p className="text-sm text-gray-600">
          Travelers:{" "}
          <span className="font-medium">
            {trip?.userSelection?.travelers ?? "N/A"}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Budget:{" "}
          <span className="font-medium">
            {trip?.userSelection?.budget
              ? `${trip.userSelection.budget}`
              : "N/A"}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Days:{" "}
          <span className="font-medium">
            {trip?.userSelection?.days ?? "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserTripCardItem;
