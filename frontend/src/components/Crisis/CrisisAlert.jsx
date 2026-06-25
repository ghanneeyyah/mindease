import { AlertTriangle, X, Phone, MessageCircle, Heart } from "lucide-react";
import { useState } from "react";

const CrisisAlert = ({ onClose, onGetHelp }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) return null;

  return (
    <div className="bg-gradient-to-r from-crisis-50 to-amber-50 border-b-2 border-crisis-300 animate-slide-down">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-crisis-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-crisis-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-crisis-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                We're here for you
              </h3>
              <p className="text-sm text-crisis-700 mt-1">
                It sounds like you might be going through a difficult time. Your feelings are valid, and support is available right now.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={onGetHelp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-crisis-600 text-white rounded-lg hover:bg-crisis-700 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  View Crisis Resources
                </button>
                <button
                  onClick={() => {
                    window.location.href = "tel:988";
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-crisis-700 border border-crisis-300 rounded-lg hover:bg-crisis-50 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Call 988 Now
                </button>
              </div>
              <p className="text-xs text-crisis-600 mt-2">
                💚 The 988 Suicide & Crisis Lifeline provides free, confidential support 24/7.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsExpanded(false);
              onClose();
            }}
            className="p-1 hover:bg-crisis-100 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-crisis-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;