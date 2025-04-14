import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AdminLoginInfo } from "@/components/auth/AdminLoginInfo";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  return (
    <CustomerLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <LoginForm />

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => setShowAdminInfo(!showAdminInfo)}
            className="text-sm"
          >
            {showAdminInfo ? "Hide Admin Info" : "Show Admin Info"}
          </Button>
        </div>

        {showAdminInfo && (
          <div className="mt-6">
            <AdminLoginInfo />
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Login;

//   Cookies.set('token', res.data.result.token, { expires: 1 })
//   Cookies.set('refreshToken', res.data.result.refreshToken, { expires: 7 })
