import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Account() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Account Settings">
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Logout
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Click below to logout of your account
            </p>
            <Button
              variant="outline"
              icon={LogOut}
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}