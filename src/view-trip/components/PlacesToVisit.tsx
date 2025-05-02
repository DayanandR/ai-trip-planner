import PlacesCardItem from "./PlacesCardItem";

interface tripDataProps {
  tripData?: any;
}

const PlacesToVisit = ({ tripData }: tripDataProps) => {
  return (
    <div>
      <h2 className="font-bold text-xl mb-5">Places to Visit</h2>
      <div>
        {tripData?.tripData?.itinerary.map((dayItem: any, dayIndex: number) => (
          <div key={dayIndex} className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Day {dayItem?.Day}</h2>
            <PlacesCardItem place={dayItem.Places} tripData={tripData} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
