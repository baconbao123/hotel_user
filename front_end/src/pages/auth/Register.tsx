
import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { CustomerLayout } from '@/layouts/CustomerLayout';

const Register = () => {
  return (
    <CustomerLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <RegisterForm />
      </div>
    </CustomerLayout>
  );
};

export default Register;
