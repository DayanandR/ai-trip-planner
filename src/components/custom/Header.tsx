import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Header = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenDialog(open);
  };

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
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  };

  const handleLogin = useGoogleLogin({
    onSuccess: (codeRes) => {
      GetUserProfile(codeRes);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="px-3 shadow-sm flex justify-between items-center">
      <a href="/">
        <img src="/logo.png" alt="Logo" height={20} width={100} />
      </a>
      {user ? (
        <div className="flex items-center gap-3">
          <a href="/create-trip">
            <Button variant="outline" className="rounded-full cursor-pointer">
              + Create Trip
            </Button>
          </a>
          <a href="/my-trips">
            <Button variant="outline" className="rounded-full cursor-pointer">
              My Trips
            </Button>
          </a>
          <Popover>
            <PopoverTrigger asChild>
              <img
                className="w-[35px] h-[35px] rounded-full cursor-pointer"
                src={user.picture}
                alt="User Avatar"
              />
            </PopoverTrigger>
            <PopoverContent className="cursor-pointer">
              <h2
                className="hover:underline"
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.replace("/");
                }}
              >
                Logout
              </h2>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
      )}

      <Dialog open={openDialog} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              <div className="text-center">
                <img
                  src="/logo.png"
                  alt="Logo"
                  height={20}
                  width={100}
                  className="mx-auto"
                />
                <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
                <p className="mt-5">
                  Sign in to the App with Google authentication securely
                </p>
                <Button
                  onClick={handleLogin}
                  className="mt-5 w-full flex gap-4 items-center justify-center"
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
};

export default Header;
