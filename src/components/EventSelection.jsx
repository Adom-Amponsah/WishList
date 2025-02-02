import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Event types with their images
const eventTypes = [
  {
    name: 'Birthday',
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate special days'
  },
  {
    name: 'Wedding',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    properties: 'Plan your perfect day'
  },
  {
    name: 'Baby Shower',
    image: 'https://images.unsplash.com/photo-1438962136829-452260720431?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    properties: 'Welcome new arrivals'
  },
  {
    name: 'House Warming',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
    properties: 'Make a house a home'
  },
  {
    name: 'Graduation',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate achievements'
  },
  {
    name: 'Christmas',
    image: 'https://images.unsplash.com/photo-1543589923-78e35f728335?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Spread holiday cheer'
  },
  {
    name: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    properties: 'Celebrate your love'
  },
  {
    name: 'Other',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    properties: 'Create custom events'
  }
]

// Scroll-triggered animation component
const ScrollAnimatedSection = ({ children, className = '' }) => {
  const sectionRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible && children}
    </div>
  );
};

export default function EventSelection() {
  const navigate = useNavigate()

  const handleEventSelect = (eventType) => {
    // Navigate to the wishlist creator with the selected event type
    navigate(`/create/${eventType.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Event Type</h2>
          <p className="text-xl text-gray-600">Select the type of event you're creating a wishlist for</p>
        </div>

        {/* Event Cards with Horizontal Scroll on Desktop, Vertical on Mobile */}
        <ScrollAnimatedSection className="relative">
          {/* Mobile View */}
          <div className="md:hidden space-y-6 px-4">
            {eventTypes.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer h-[200px] group"
                onClick={() => handleEventSelect(event.name)}
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {event.name}
                  </h3>
                  <span className="text-sm font-medium text-white/80">
                    {event.properties}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Keep existing horizontal scroll */}
          <div className="hidden md:block overflow-x-auto scrollbar-hide">
            <motion.div 
              className="flex gap-6 pb-8 relative"
              drag="x"
              dragConstraints={{ right: 0, left: -1600 }}
              whileTap={{ cursor: "grabbing" }}
              style={{ cursor: "grab" }}
            >
              {Array.from({ length: Math.ceil(eventTypes.length / 3) }).map((_, groupIndex) => (
                <motion.div
                  key={groupIndex}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: groupIndex * 0.2,
                    ease: "easeOut"
                  }}
                  className="flex-shrink-0 flex gap-6"
                >
                  <div 
                    className="relative rounded-2xl overflow-hidden cursor-pointer w-[300px] h-[600px] group"
                    onClick={() => handleEventSelect(eventTypes[groupIndex * 3]?.name)}
                  >
                    <img
                      src={eventTypes[groupIndex * 3]?.image}
                      alt={eventTypes[groupIndex * 3]?.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {eventTypes[groupIndex * 3]?.name}
                      </h3>
                      <span className="text-sm font-medium text-white/80">
                        {eventTypes[groupIndex * 3]?.properties}
                      </span>
                    </div>
                  </div>

                  {/* Stacked cards container */}
                  <div className="flex flex-col gap-6">
                    {/* Top card */}
                    <div 
                      className="relative rounded-2xl overflow-hidden cursor-pointer w-[300px] h-[290px] group"
                      onClick={() => handleEventSelect(eventTypes[groupIndex * 3 + 1]?.name)}
                    >
                      <img
                        src={eventTypes[groupIndex * 3 + 1]?.image}
                        alt={eventTypes[groupIndex * 3 + 1]?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {eventTypes[groupIndex * 3 + 1]?.name}
                        </h3>
                        <span className="text-sm font-medium text-white/80">
                          {eventTypes[groupIndex * 3 + 1]?.properties}
                        </span>
                      </div>
                    </div>

                    {/* Bottom card */}
                    <div 
                      className="relative rounded-2xl overflow-hidden cursor-pointer w-[300px] h-[290px] group"
                      onClick={() => handleEventSelect(eventTypes[groupIndex * 3 + 2]?.name)}
                    >
                      <img
                        src={eventTypes[groupIndex * 3 + 2]?.image}
                        alt={eventTypes[groupIndex * 3 + 2]?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {eventTypes[groupIndex * 3 + 2]?.name}
                        </h3>
                        <span className="text-sm font-medium text-white/80">
                          {eventTypes[groupIndex * 3 + 2]?.properties}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ScrollAnimatedSection>
      </div>
    </div>
  )
}