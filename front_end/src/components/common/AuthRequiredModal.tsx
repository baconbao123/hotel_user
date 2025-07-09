import React from 'react';
import { Modal, Button } from 'antd';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  returnUrl?: string;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ 
  visible, 
  onClose, 
  returnUrl 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const loginUrl = `/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
    navigate(loginUrl);
    onClose();
  };

  const handleRegister = () => {
    const registerUrl = `/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
    navigate(registerUrl);
    onClose();
  };

  return (
    <Modal
      title="Sign in to continue"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <div className="text-center py-4">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600">
            Please sign in or create an account to book a room and access all features.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            type="primary"
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleLogin}
            icon={<LogIn className="w-4 h-4" />}
          >
            Sign In
          </Button>
          
          <Button
            size="large"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handleRegister}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Create New Account
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          By continuing, you agree to our Terms of Service.
        </div>
      </div>
    </Modal>
  );
};

export default AuthRequiredModal; 