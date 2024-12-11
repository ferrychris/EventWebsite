import { Route } from 'react-router-dom';
import DashboardLayout from '../components/shared/Layout/DashboardLayout';

// Dashboard
import Overview from '../pages/venue/dashboard/Overview';
import UpcomingEvents from '../pages/venue/dashboard/UpcomingEvents';

// Profile
import BasicInfo from '../pages/venue/profile/BasicInfo';
import Features from '../pages/venue/profile/Features';
import Photos from '../pages/venue/profile/Photos';
import Pricing from '../pages/venue/profile/Pricing';

// Events
import ClientManagement from '../pages/venue/events/ClientManagement';
import Documents from '../pages/venue/events/Documents';
import GuestManagement from '../pages/venue/events/GuestManagement';
import AutomatedEmails from '../pages/venue/events/AutomatedEmails';
import VendorManagement from '../pages/venue/events/VendorManagement';

// Education
import Calendar from '../pages/venue/education/Calendar';
import Webinars from '../pages/venue/education/Webinars';
import Resources from '../pages/venue/education/Resources';
import Community from '../pages/venue/education/Community';
import Blogging from '../pages/venue/education/Blogging';

// Settings
import Account from '../pages/venue/settings/Account';
import Theme from '../pages/venue/settings/Theme';

export const dashboardRoutes = (
  <Route element={<DashboardLayout />}>
    {/* Dashboard */}
    <Route path="dashboard" element={<Overview />} />
    <Route path="dashboard/upcoming-events" element={<UpcomingEvents />} />

    {/* Profile */}
    <Route path="profile" element={<BasicInfo />} />
    <Route path="profile/features" element={<Features />} />
    <Route path="profile/photos" element={<Photos />} />
    <Route path="profile/pricing" element={<Pricing />} />

    {/* Events */}
    <Route path="events" element={<ClientManagement />} />
    <Route path="events/documents" element={<Documents />} />
    <Route path="events/guest-management" element={<GuestManagement />} />
    <Route path="events/automated-emails" element={<AutomatedEmails />} />
    <Route path="events/vendor-management" element={<VendorManagement />} />

    {/* Education */}
    <Route path="education" element={<Calendar />} />
    <Route path="education/webinars" element={<Webinars />} />
    <Route path="education/resources" element={<Resources />} />
    <Route path="education/community" element={<Community />} />
    <Route path="education/blogging" element={<Blogging />} />

    {/* Settings */}
    <Route path="settings" element={<Account />} />
    <Route path="settings/theme" element={<Theme />} />
  </Route>
);