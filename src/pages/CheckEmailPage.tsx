import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/layout/AuthHeader';

const CheckEmailPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <AuthHeader /> {/* ✅ Reuses same logo/header from register page */}

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Confirm Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            "We've sent a confirmation email to your inbox.<br /> 
            It might be in your spam or junk folder.<br />
            Make sure to verify your account before logging in."<br />
        
          </p>

          <button
            onClick={() => navigate('/')}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckEmailPage;
