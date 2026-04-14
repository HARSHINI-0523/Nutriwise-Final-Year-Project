import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all components
import Home from "./components/home/home";
import Login from "./components/login/login";
import RootLayout from "./RootLayout";
import Profile from "./components/profile/profile";
import UserDetailsForm from "./components/userDetailsForm/userDetailsForm";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import UploadReport from "./components/uploadReport/UploadReport.jsx";
import MyReports from "./components/myReports/MyReports.jsx";
import FriendsPage from "./components/friends/FriendsPage.jsx";
import CheckupCalendar from "./components/checkupCalendar/CheckupCalendar.jsx";
import VerifyEmail from "./components/verifyEmail/VerifyEmail.jsx";
import GenerateDietPlan from "./components/generateDietPlan/GenerateDietPlan.jsx";
import ReportViewer from "./components/reportViewer/ReportViewer.jsx";
import Challenges from "./components/challenges/Challenges.jsx";
import  DietPlanWeeklyPage from "./components/weeklyPlan/weeklyDietPlan.jsx";
//Contexts
import { UserLoginProvider } from "./contexts/UserLoginContext";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";

function App() {
  const ReportsPage = () => <h1>Reports Content</h1>;
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/verify-email", element: <VerifyEmail /> },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/user-details-form",
          element: <UserDetailsForm />,
        },


        { path: "/reports/my", element: <MyReports /> },
        { path: "/reports/upload", element: <UploadReport /> },
        { path: "/reports/analysis", element: <ReportsPage /> },
        { path: "/myreports/view/:id", element: <ReportViewer /> },

      
        { path: "/diet-plans/generate", element: <GenerateDietPlan /> },
        { path: "/diet-plans/weekly", element: <DietPlanWeeklyPage /> },
        { path: "/friends", element: <FriendsPage /> },
        { path: "/checkup-calendar", element: <CheckupCalendar /> },
        { path: "/challenges", element: <Challenges /> }
      ],
    },
  ]);
  return (
    <UserLoginProvider>
      <ToastProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </ToastProvider>
    </UserLoginProvider>
  );
}

export default App;
