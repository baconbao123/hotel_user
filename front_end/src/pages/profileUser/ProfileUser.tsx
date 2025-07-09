import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { useDispatch } from "react-redux";
import { setUser as setUserSlince } from "@/store/slice/userDataSlice";

const ProfilePage = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const fetchProfile = async () => {
    const token = Cookies.get("token");
    axios
      .get("http://103.161.172.90:9898/hotel/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(
          res.data.result || {
            fullName: "",
            email: "",
            phoneNumber: "",
            avatar: "",
          }
        );
        dispatch(setUserSlince(res.data.result));
        console.log("check data ============", res);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to fetch profile. Please try again.",
          variant: "destructive",
        });
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("phoneNumber", user.phoneNumber);
      if (user.avatar) formData.append("avatar", user.avatar);

      const res = await axios.put(
        "http://103.161.172.90:9898/hotel/user-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 5000,
        }
      );

      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
        navigate("/user/home");
      }
    } catch (error) {
      if (error.response?.status === 422)
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        });
      else if (error.response?.status === 401)
        toast({
          title: "Error",
          description: "Unauthorized. Please log in again.",
          variant: "destructive",
        });
      else if (error.response?.status === 404)
        toast({
          title: "Error",
          description: "Profile update endpoint not found.",
          variant: "destructive",
        });
      else if (error.code === "ECONNABORTED")
        toast({
          title: "Error",
          description: "Connection timed out. Please check server status.",
          variant: "destructive",
        });
      else
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.new !== password.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      const res = await axios.put(
        "http://103.161.172.90:9898/hotel/user-profile/password",
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Password updated successfully.",
        });
        setPassword({ current: "", new: "", confirm: "" });
      }
    } catch (error) {
      if (error.response?.status === 401)
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        });
      else if (error.response?.status === 404)
        toast({
          title: "Error",
          description: "Password update endpoint not found.",
          variant: "destructive",
        });
      else if (error.code === "ECONNABORTED")
        toast({
          title: "Error",
          description: "Connection timed out. Please check server status.",
          variant: "destructive",
        });
      else
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md mx-auto shadow-sm border-gray-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Profile
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage your account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={activeTab === "profile" ? "default" : "outline"}
                onClick={() => setActiveTab("profile")}
              >
                Profile Info
              </Button>
              <Button
                variant={activeTab === "password" ? "default" : "outline"}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </Button>
            </div>
            {activeTab === "profile" ? (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleProfileChange}
                    required
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleProfileChange}
                    required
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleProfileChange}
                    required
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-medium text-gray-700"
                  >
                    Avatar
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    name="avatar"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setUser({ ...user, avatar: file });
                    }}
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-hotel-blue hover:bg-hotel-blue-dark text-white font-medium rounded-lg py-2 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="current"
                    className="text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current"
                      type={showCurrentPassword ? "text" : "password"}
                      name="current"
                      value={password.current}
                      onChange={handlePasswordChange}
                      required
                      className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full aspect-square hover:bg-gray-100"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="new"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new"
                      type={showNewPassword ? "text" : "password"}
                      name="new"
                      value={password.new}
                      onChange={handlePasswordChange}
                      required
                      className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full aspect-square hover:bg-gray-100"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      required
                      className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full aspect-square hover:bg-gray-100"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-hotel-blue hover:bg-hotel-blue-dark text-white font-medium rounded-lg py-2 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Go back to{" "}
              <a
                href="/"
                className="text-hotel-blue hover:underline font-medium"
              >
                Home
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;
