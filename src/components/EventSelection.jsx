import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRing, FaBaby, FaBirthdayCake, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { useRef, useEffect, useState } from 'react';

// Define image paths (when using public folder in Vite)
const events = [
  {
    id: 'wedding',
    title: 'Wedding',
    subtitle: 'Registry',
    icon: <FaRing className="text-4xl" />,
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    color: 'from-rose-500/30 to-pink-600/30',
    description: 'Create your dream wedding registry',
  },
  {
    id: 'baby-shower',
    title: 'Baby',
    subtitle: 'Shower',
    icon: <FaBaby className="text-4xl" />,
    image: 'https://images.unsplash.com/photo-1438962136829-452260720431?auto=format&fit=crop&w=2070&q=80',
    color: 'from-sky-500/30 to-blue-600/30',
    description: 'Welcome your little one with love',
  },
  {
    id: 'birthday',
    title: 'Birthday',
    subtitle: 'Celebration',
    icon: <FaBirthdayCake className="text-4xl" />,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1470&q=80',
    color: 'from-purple-500/30 to-indigo-600/30',
    description: 'Celebrate your special day',
  },
  {
    id: 'graduation',
    title: 'Graduation',
    subtitle: 'Party',
    icon: <FaGraduationCap className="text-4xl" />,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1470&q=80',
    color: 'from-emerald-500/30 to-green-600/30',
    description: 'Mark your academic achievement',
  },
  {
    id: 'other',
    title: 'Custom',
    subtitle: 'Events',
    icon: <GiPartyPopper className="text-4xl" />,
    image: 'https://images.unsplash.com/photo-1517488629431-6427e0ee1e5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    color: 'from-amber-500/30 to-orange-600/30',
    description: 'Create a custom event wishlist',
  },
];

const EventSelection = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Smooth spring-based animation for scrolling
  const x = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  // Handle horizontal scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const handleWheel = (e) => {
      e.preventDefault();
      
      const cardWidth = 900; // Matches your card width
      const cardGap = 20; // Adjust this to match your gap between cards
      const totalCardWidth = cardWidth + cardGap;
      
      const scrollAmount = (e.deltaX || e.deltaY) * 2;
      const currentX = x.get();
      
      // Calculate max scroll dynamically
      const maxScroll = -(events.length * totalCardWidth - container.offsetWidth);
      
      let newX = currentX - scrollAmount;
      newX = Math.max(maxScroll, Math.min(0, newX));
      
      x.set(newX);
  
      // Recalculate active index based on new scroll position
      const activeIdx = Math.floor(Math.abs(newX) / totalCardWidth);
      setActiveIndex(Math.min(events.length - 1, Math.max(0, activeIdx)));
    };
  
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [x]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(events.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update x position when activeIndex changes
  useEffect(() => {
    x.set(-activeIndex * 420);
  }, [activeIndex, x]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-0 right-0 text-5xl md:text-6xl font-bold text-white px-4 text-center z-10"
      >
        Choose Your Event Type
      </motion.h1>

      {/* Cards Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          style={{ x }}
          className="absolute inset-0 flex space-x-5 px-[15vw] items-center"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: activeIndex === index ? 1 : 0.9,
                y: activeIndex === index ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
              className="relative flex-shrink-0 w-[400px] h-[80vh] rounded-3xl overflow-hidden group"
              onClick={() => setActiveIndex(index)}
            >
              {/* Background Image */}
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  scale: activeIndex === index ? 1.05 : 1
                }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${event.color} 
                backdrop-blur-[2px] opacity-90 transition-opacity duration-300
                ${activeIndex === index ? 'opacity-75' : 'opacity-90'}`}
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Top Section */}
                <div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  >
                    {event.icon}
                  </motion.div>
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.1 }}
                    className="text-5xl font-bold text-white mb-2"
                  >
                    {event.title}
                  </motion.h2>
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                    className="text-3xl font-light text-white/80"
                  >
                    {event.subtitle}
                  </motion.h3>
                </div>

                {/* Center Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="flex-1 flex items-center"
                >
                  <p className="text-xl text-white/90 max-w-[90%] text-center mx-auto">
                    {event.description}
                  </p>
                </motion.div>

                {/* Show Create button only for active card */}
                {activeIndex === index && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/create/${event.id}`);
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                      px-6 py-4 rounded-full text-white font-semibold 
                      flex items-center justify-center space-x-2
                      transition-all duration-300"
                  >
                    <span>Create Wishlist</span>
                    <FaArrowRight />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {events.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventSelection;