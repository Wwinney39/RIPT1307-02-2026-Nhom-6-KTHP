import { ToastProvider } from './hooks/ToastProvider';
import { AddressProvider } from './context/AddressContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { RestaurantMenuPage } from './pages/RestaurantMenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersListPage } from './pages/OrdersPage';
import { DeliveryTrackingPage } from './pages/DeliveryTrackingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { MerchantLayout } from './pages/merchant/MerchantLayout';
import { StaffLayout } from './pages/staff/StaffLayout';
import { storage } from './utils/storage';
import { type User } from './types/index';

function AdminGuard() {
  const currentUser = storage.get<User | null>('currentUser', null);
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.replace('/login');
    return null;
  }
  return <AdminLayout />;
}

function MerchantGuard() {
  const currentUser = storage.get<User | null>('currentUser', null);
  if (!currentUser || currentUser.role !== 'restaurant_owner') {
    window.location.replace('/login');
    return null;
  }
  return <MerchantLayout />;
}

function StaffGuard() {
  const currentUser = storage.get<User | null>('currentUser', null);
  if (!currentUser || currentUser.role !== 'staff') {
    window.location.replace('/login');
    return null;
  }
  return <StaffLayout />;
}

function OrdersGuard() {
  const currentUser = storage.get<User | null>('currentUser', null);
  if (!currentUser) {
    window.location.replace('/login');
    return null;
  }
  return <OrdersListPage />;
}

function Router() {
  const path = window.location.pathname;

  if (path.startsWith('/admin')) return <AdminGuard />;
  if (path.startsWith('/merchant')) return <MerchantGuard />;
  if (path.startsWith('/staff')) return <StaffGuard />;

  if (path === '/login') return <LoginForm />;
  if (path === '/register') return <RegisterForm />;
  if (path === '/restaurants') return <RestaurantsPage />;
  if (path === '/menu') return <RestaurantMenuPage />;
  if (path === '/cart') return <CartPage />;
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/payment') return <PaymentPage />;
  if (path === '/order-confirmation') return <OrderConfirmationPage />;
  if (path === '/orders') return <OrdersGuard />;
  if (path.startsWith('/delivery/'))
    return <DeliveryTrackingPage orderId={Number(path.split('/')[2])} />;
  if (path === '/profile') return <UserProfilePage />;
  if (path === '/reviews') return <ReviewsPage />;

  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AddressProvider>
        <ToastProvider>
          <Router />
          <ToastContainer />
        </ToastProvider>
      </AddressProvider>
    </AuthProvider>
  );
}
