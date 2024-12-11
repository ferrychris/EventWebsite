import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Mail, 
  Users,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className="text-2xl font-display font-light tracking-wide text-gray-900">WEDDINGRSVP</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/venue/login')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-body text-sm tracking-wide"
              >
                VENUE LOGIN
              </button>
              <button
                onClick={() => navigate('/couple/login')}
                className="px-6 py-3 border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-body text-sm tracking-wide"
              >
                COUPLE LOGIN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-16 min-h-screen flex items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=2000&blend=F8FAFC&blend-alpha=90&blend-mode=normal')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-light text-gray-900 mb-8 leading-tight">
            Effortless Wedding RSVP Management
          </h1>
          <p className="text-xl font-body font-light text-gray-700 mb-12 tracking-wide">
            Create beautiful RSVP experiences for your special day while keeping everything organized in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => navigate('/venue/login')}
              className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 text-sm font-body tracking-widest transition-all"
            >
              VENUE DASHBOARD
            </button>
            <button
              onClick={() => navigate('/couple/login')}
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white text-sm font-body tracking-widest transition-all"
            >
              COUPLE DASHBOARD
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-light text-gray-900 mb-6">
              Designed for Your Perfect Day
            </h2>
            <p className="text-lg text-gray-600 font-body font-light max-w-2xl mx-auto">
              Every detail matters when it comes to your wedding. Our platform helps you manage them all with grace and ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-gray-900" />,
                title: "Event Management",
                description: "Organize multiple events with an intuitive interface designed for clarity and efficiency."
              },
              {
                icon: <Users className="w-8 h-8 text-gray-900" />,
                title: "Guest Experience",
                description: "Create a seamless RSVP experience that reflects the elegance of your special day."
              },
              {
                icon: <Mail className="w-8 h-8 text-gray-900" />,
                title: "Communication",
                description: "Keep everyone informed with beautifully designed automated communications."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-10 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-display font-light text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 font-body font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-display font-light text-gray-900 mb-8">
                Elevate Your Wedding Management
              </h2>
              <div className="space-y-6">
                {[
                  "Elegant RSVP form builder",
                  "Seamless guest list management",
                  "Detailed analytics and insights",
                  "Customizable communications",
                  "Comprehensive event planning tools"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-gray-900 mr-4" />
                    <span className="text-lg text-gray-700 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/venue/login')}
                className="mt-12 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 inline-flex items-center text-sm font-body tracking-widest transition-all"
              >
                GET STARTED
                <ArrowRight className="w-4 h-4 ml-3" />
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=2000"
                alt="Wedding Setup"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-display font-light mb-6">WEDDINGRSVP</h3>
              <p className="text-gray-400 font-light">
                Elevating wedding planning through elegant RSVP management.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-body font-light tracking-wide mb-6">QUICK LINKS</h4>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => navigate('/venue/login')} className="text-gray-400 hover:text-white font-light tracking-wide">
                    Venue Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/couple/login')} className="text-gray-400 hover:text-white font-light tracking-wide">
                    Couple Login
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-body font-light tracking-wide mb-6">CONTACT</h4>
              <p className="text-gray-400 font-light tracking-wide">
                hello@weddingrsvp.com<br />
                (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 font-light tracking-wide text-sm">
              © {new Date().getFullYear()} WEDDINGRSVP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}