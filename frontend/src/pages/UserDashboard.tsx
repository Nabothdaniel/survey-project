import Header from "../components/UserDashboard/Header";
import { Outlet } from "react-router-dom";



const UserDashboard: React.FC = () => {


  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-20 max-w-6xl mx-auto">
        <Outlet />
        
      </main>
    </div>
  );
};

export default UserDashboard;
