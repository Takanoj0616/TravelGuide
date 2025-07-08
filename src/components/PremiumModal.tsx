import React from 'react';
import { X, Crown, Check, Star } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onPurchase: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onPurchase }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-lg opacity-90">
              Unlock exclusive content and personalized recommendations
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ¥2,980
                <span className="text-lg font-normal text-gray-500 ml-2">one-time payment</span>
              </div>
              <p className="text-gray-600">
                Get lifetime access to all premium features for your Japan trip
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                {[
                  'Exclusive leisure activities and hidden gems',
                  'Premium tourist spots with insider tips',
                  'Personalized restaurant recommendations',
                  'Detailed cultural insights and etiquette guides',
                  'Custom itinerary planning tools',
                  'Priority customer support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">Premium Benefits</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Access to 200+ exclusive recommendations</li>
                  <li>• Detailed maps with offline access</li>
                  <li>• Cultural do's and don'ts guide</li>
                  <li>• Emergency contact information</li>
                  <li>• Seasonal event notifications</li>
                  <li>• Mobile app with GPS integration</li>
                </ul>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 italic mb-3">
                "The premium guide made our Tokyo trip absolutely perfect. The hidden restaurant recommendations 
                were incredible, and the cultural insights helped us feel like locals!"
              </blockquote>
              <cite className="text-sm text-gray-600 font-medium">
                — Sarah & Mark, First-time visitors from Australia
              </cite>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPurchase}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade Now - ¥2,980
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-colors"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment processing. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};