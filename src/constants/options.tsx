export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveles in exploration",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "🥂",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adv",
    icon: "✈️",
    people: "3 to 5 People",
  },

  {
    id: 4,
    title: "Just Friends",
    desc: "A bunch of thrill-seekes",
    icon: "⛵",
    people: "6 to 10 People",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "💸",
  },
];

export const AI_PROMPT = `You are an expert travel assistant. Your task is to generate a detailed travel plan in a STRICT and PARSABLE JSON format.

Input:
- Location: {location}
- Total Days: {totalDays}
- Number of Travelers: {travelers}
- Budget: {budget}

Output format (must strictly follow the structure below and must be valid JSON that can be parsed using JSON.parse):

{
  "hotels": [
    {
      "HotelName": "Hotel Name",
      "HotelAddress": "Hotel Address",
      "Price": "Average Price per night",
      "HotelImageUrl": "https://source.unsplash.com/featured/?hotel,{location}",
      "GeoCoordinates": {
        "latitude": 0.0,
        "longitude": 0.0
      },
      "Rating": 0.0,
      "Description": "Brief description of the hotel"
    }
  ],
  "itinerary": [
    {
      "Day": 1,
      "Places": [
        {
          "PlaceName": "Name of the Place",
          "TimeSlot": "10:00 AM - 12:00 PM",
          "PlaceDetails": "Detailed description of the place and what to do there",
          "PlaceImageUrl": "https://source.unsplash.com/featured/?{location},tourist",
          "GeoCoordinates": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "TicketPricing": "Approximate ticket price, if applicable",
          "BestTimeToVisit": "Recommended time of day to visit"
        }
      ]
    }
  ]
}

IMPORTANT:
- Do NOT change key names or structure.
- Ensure JSON is valid, complete, and strictly adheres to this schema.
- Each 'Day' must have 2-4 places based on time efficiency and interest.
- Use "TimeSlot" field to divide the day (e.g., morning, afternoon, evening).
- HotelImageUrl and PlaceImageUrl must use:
  - "https://source.unsplash.com/featured/?hotel,{location}"
  - "https://source.unsplash.com/featured/?{location},tourist"

Begin response below:
`;
