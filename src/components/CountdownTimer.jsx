import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer({ expiryDate, name = "their" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  if (isExpired) {
    return (
      <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
        This wishlist has expired
      </div>
    );
  }

  const urgencyColor = timeLeft.days <= 5 ? 'text-red-600' : 
                       timeLeft.days <= 10 ? 'text-orange-500' : 
                       'text-[#970058]';

  // Format the name to handle possessive form
  const formattedName = name.endsWith('s') ? `${name}'` : `${name}'s`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm rounded-lg p-3 md:p-4 mb-4 md:mb-6"
    >
      <div className="text-center">
        <h3 className="text-sm md:text-base font-medium text-gray-800 mb-1 md:mb-2">
          Only <span className={urgencyColor}>{timeLeft.days} days</span> left to make {formattedName} wishlist dreams come true
        </h3>
        {/* <div className={`text-xl md:text-2xl font-bold ${urgencyColor} flex items-center justify-center gap-1 md:gap-2`}>
          <span>{timeLeft.days}d</span>
          <span className="text-gray-300">·</span>
          <span>{timeLeft.hours}h</span>
          <span className="text-gray-300">·</span>
          <span>{timeLeft.minutes}m</span>
        </div> */}
        {timeLeft.days <= 5 && (
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Hurry! The clock is ticking! ⏰
          </p>
        )}
      </div>
    </motion.div>
  );
} 