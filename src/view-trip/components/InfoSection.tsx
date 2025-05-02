import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { IoIosSend } from "react-icons/io";

interface tripDataProps {
  tripData?: any;
}

const InfoSection = ({ tripData }: tripDataProps) => {
  const [destinationImage, setDestinationImage] = useState<string>("");

  const fetchDestinationImage = async (destination: string) => {
    const query = `${destination} tourist destination`;
    try {
      const response = await fetch(
        `https://nodejs-serverless-function-express-dun-theta-53.vercel.app/api/hotel-image?q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setDestinationImage(data?.image || "/fallback-image.jpg");
    } catch (error) {
      console.error("Error fetching destination image:", error);
      setDestinationImage("/fallback-image.jpg");
    }
  };

  useEffect(() => {
    if (tripData?.userSelection?.destination) {
      fetchDestinationImage(tripData.userSelection.destination);
    }
  }, [tripData]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10">
      {/* Destination Image */}
      <img
        src={destinationImage}
        className="h-56 sm:h-72 md:h-[340px] w-full object-cover rounded-xl"
        alt="Destination"
      />

      {/* Destination Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {tripData?.userSelection?.destination}
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-500 text-sm">
              🌴 {tripData?.userSelection?.days} Days
            </span>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-500 text-sm">
              💰 {tripData?.userSelection?.budget} Budget
            </span>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-500 text-sm">
              🍷 No. of Travelers: {tripData?.userSelection?.travelers}
            </span>
          </div>
        </div>

        <Button
          className="w-full md:w-auto"
          onClick={() => {
            const destination =
              tripData?.userSelection?.destination || "a destination";
            const days = tripData?.userSelection?.days || "";
            const budget = tripData?.userSelection?.budget || "";
            const travelers = tripData?.userSelection?.travelers || "";

            const shareData = {
              title: `Trip to ${destination}`,
              text: `Check out my planned trip to ${destination}!\n📅 ${days} Days\n💰 Budget: ${budget}\n👥 Travelers: ${travelers}`,
              url: window.location.href,
            };

            if (navigator.share) {
              navigator.share(shareData).catch((err) => {
                console.error("Share failed:", err);
              });
            } else {
              alert("Sharing is not supported on this browser.");
            }
          }}
        >
          <IoIosSend className="mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default InfoSection;
