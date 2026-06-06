import { ToastProvider } from './hooks/ToastProvider';
import { AddressProvider } from './context/AddressContext';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { RestaurantMenuPage } from './pages/RestaurantMenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersListPage } from './pages/OrdersPage';
import { DeliveryTrackingPage } from './pages/DeliveryTrackingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ReviewsPage } from './pages/ReviewsPage';

function Router() {
  const path = window.location.pathname;

  if (path === '/login') return <LoginForm />;
  if (path === '/register') return <RegisterForm />;
  if (path === '/restaurants') return <RestaurantsPage />;
  if (path === '/menu') return <RestaurantMenuPage />;
  if (path === '/cart') return <CartPage />;
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/orders') return <OrdersListPage />;
  if (path.startsWith('/delivery/'))
    return <DeliveryTrackingPage orderId={Number(path.split('/')[2])} />;
  if (path === '/profile') return <UserProfilePage />;
  if (path === '/reviews') return <ReviewsPage />;

  return <LandingPage />;
}

export default function App() {
  return (
    <AddressProvider>
      <ToastProvider>
        <Router />
        <ToastContainer />
      </ToastProvider>
    </AddressProvider>
  );
}
