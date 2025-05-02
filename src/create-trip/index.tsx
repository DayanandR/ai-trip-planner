import { useState } from "react";
import { OpenStreetAutocomplete } from "../components/custom/OpenStreetAutocomplete";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelersList,
} from "../constants/options";
import { toast } from "sonner";
import { chatSession } from "../service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { DialogTitle } from "@radix-ui/react-dialog";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
    }
    if (
      !formData?.days ||
      !formData.travelers ||
      !formData.budget ||
      !formData.destination
    ) {
      toast("Please fill all the fields to generate your trip itinerary.");
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.destination)
      .replace("{totalDays}", formData?.days)
      .replace("{travelers}", formData?.travelers)
      .replace("{budget}", formData?.budget)
      .replace("{location}", formData?.destination)
      .replace("{totalDays}", formData?.days);
    console.log(FINAL_PROMPT);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
    setLoading(false);
    saveAiTrip(result?.response?.text());
  };
  const saveAiTrip = async (TripData: any) => {
    setLoading(true);

    try {
      console.log("Raw TripData:", TripData);

      const userString = localStorage.getItem("user");
      const userData = userString ? JSON.parse(userString) : {};
      const docId = Date.now().toString();

      if (!TripData || !formData) {
        throw new Error("Missing required data.");
      }

      // 🧼 Clean AI response to make it valid JSON
      const cleanJson = TripData.trim()
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .replace(/^\s*[\r\n]/, "")
        .replace(/[\r\n]\s*$/, "");

      // Try parsing the clean JSON
      const parsedData = JSON.parse(cleanJson);

      await setDoc(doc(db, "trip-details", docId), {
        userSelection: formData,
        tripData: parsedData,
        user: userData,
        createdAt: new Date().toISOString(),
      });

      navigate(`/view-trip/${docId}`);
      console.log("Trip saved successfully!");
      toast("Trip Generated successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = useGoogleLogin({
    onSuccess: (codeRes) => {
      console.log(codeRes);
      GetUserProfile(codeRes);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo: any) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOpenChange = (open: any) => {
    setOpenDialog(open);
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20">
        <h2 className="font-medium text-xl my-3">
          What is your destination of choice?
        </h2>
        <OpenStreetAutocomplete handleInputChange={handleInputChange} />
      </div>

      <div className="mt-20">
        <h2 className="font-medium text-xl my-3">
          How many days are you planning this trip?
        </h2>
        <Input
          placeholder="Ex. 3"
          onChange={(e) => handleInputChange("days", e.target.value)}
        />
      </div>

      <div className="mt-20">
        <h2 className="font-medium text-xl my-3">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg hover:shadow p-4 flex-col cursor-pointer ${
                formData.budget === item.title ? "shadow-lg border-black" : ""
              }`}
              onClick={() => handleInputChange("budget", item.title)}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-medium text-xl my-3">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelersList.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg hover:shadow p-4 flex-col cursor-pointer ${
                formData.travelers === item.people
                  ? "shadow-lg border-black"
                  : ""
              }`}
              onClick={() => handleInputChange("travelers", item.people)}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-end">
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
        ) : (
          <Button className="cursor-pointer" onClick={onGenerateTrip}>
            Generate Trip
          </Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle> {/* ← add this */}
            <DialogDescription>
              <div>
                <img src="/logo.png" height={20} width={100} />
                <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
                <p className="mt-5">
                  Sign in to the App with Google authentication securely
                </p>

                <Button
                  onClick={() => handleLogin()}
                  className="mt-5 w-full cursor-pointer flex gap-4 items-center"
                >
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
