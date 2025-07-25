import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Facebook, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import Cookies from "js-cookie";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const [errors, setErrors] = useState<{
    email?: string;
    fullName?: string;
    password?: string;
    phoneNumber?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post(
        `http://localhost:9898/hotel/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 5000,
        }
      );

      if (response.status === 200) {
        const token = response.data.result?.token;
        const refreshToken = response.data.result?.refreshToken;

        if (token) {
          Cookies.set("token", token, { expires: 1 });
          if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, { expires: 7 });
          }

          toast({
            title: "Success",
            description: "Registration successful. Logging you in...",
          });
          navigate(returnUrl);
        } else {
          toast({
            title: "Success",
            description: "Registration successful. Please log in.",
          });

          navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errorMessages);
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
      } else if (error.response?.status === 401) {
        toast({
          title: "Error",
          description:
            "Unauthorized. Check credentials or server requirements.",
          variant: "destructive",
        });
      } else if (error.response?.status === 404) {
        toast({
          title: "Error",
          description: "Registration endpoint not found. Check server URL.",
          variant: "destructive",
        });
      } else if (error.response) {
        toast({
          title: "Error",
          description:
            error.response.data?.message ||
            `Server error (${error.response.status})`,
          variant: "destructive",
        });
      } else if (error.request) {
        toast({
          title: "Error",
          description:
            "No response from server. Check connection or server status.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
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
              Register
            </CardTitle>
            <CardDescription className="text-gray-500">
              Create a new account by entering your details below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-5"
            >
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
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

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
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
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
                  placeholder="123-456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                )}
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
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatar(file);
                  }}
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full aspect-square hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-lg border-gray-200 focus:ring-2 focus:ring-hotel-blue"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full aspect-square hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    Registering...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full rounded-lg border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-lg border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
            </div>

            {showAdminInfo && (
              <div className="space-y-4">
                <Separator />
                <Tabs defaultValue="admin" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                    <TabsTrigger value="owner">Hotel Owner</TabsTrigger>
                  </TabsList>

                  <TabsContent value="admin" className="space-y-4 mt-4">
                    <div>
                      <p className="font-medium text-gray-700">Email:</p>
                      <p className="text-gray-500">admin@hospitopia.com</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium text-gray-700">Password:</p>
                      <p className="text-gray-500">admin123</p>
                    </div>
                    <Separator />
                    <p className="text-sm text-gray-500 mt-4">
                      After logging in, you'll be redirected to the admin
                      dashboard where you can manage users, hotels, bookings,
                      and view financial data.
                    </p>
                  </TabsContent>

                  <TabsContent value="owner" className="space-y-4 mt-4">
                    <div>
                      <p className="font-medium text-gray-700">Email:</p>
                      <p className="text-gray-500">owner@hospitopia.com</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium text-gray-700">Password:</p>
                      <p className="text-gray-500">owner123</p>
                    </div>
                    <Separator />
                    <p className="text-sm text-gray-500 mt-4">
                      After logging in, you'll be redirected to the hotel owner
                      dashboard where you can manage your hotels, rooms,
                      bookings, and view financial data.
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> These are simulated accounts for
                    demonstration purposes. In a production environment, these
                    credentials would never be shared openly.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-hotel-blue hover:underline font-medium"
              >
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default Register;
