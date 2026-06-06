import { Header } from '../components/Header/Header';
import { Hero } from '../components/Hero/Hero';
import { RestaurantGrid } from '../components/RestaurantGrid/RestaurantGrid';
import { HowItWorks } from '../components/HowItWorks/HowItWorks';
import { Footer } from '../components/Footer/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={0} />
      <main id="main-content" className="flex-1">
        <Hero />
        <RestaurantGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
