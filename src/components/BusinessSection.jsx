import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Navbar from './Navbar';
import { FaGift, FaShare, FaHeart, FaMagic, FaLock, FaStar, FaTiktok, FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const BusinessSection = () => {
  const targetRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      title: "Seamless Sharing",
      description: "Share your wishlists instantly with friends and family.",
      details: [
        "One-click sharing",
        "Custom privacy settings",
        "Social media integration"
      ],
      color: "pink"
    },
    {
      title: "Perfect Gifting",
      description: "Ensure you receive the gifts you truly want.",
      details: [
        "Gift reservation system",
        "Duplicate prevention",
        "Gift suggestions"
      ],
      color: "pink"
    },
    {
      title: "Universal Item Adding",
      description: "Add products from ANY online store - Amazon, Etsy, local boutiques, you name it!",
      details: [
        "Browser extension for one-click adding",
        "Price tracking and alerts",
        "Automatic product details import"
      ],
      color: "pink"
    }
  ];

  const events = [
    {
      title: "Weddings",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1769&auto=format&fit=crop",
      description: "Create the perfect wedding registry"
    },
    {
      title: "Birthdays",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1770&auto=format&fit=crop",
      description: "Make birthday wishes come true"
    },
    {
      title: "Baby Showers",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1770&auto=format&fit=crop",
      description: "Get everything you need for your little one"
    },
    {
      title: "Holidays",
      image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1770&auto=format&fit=crop",
      description: "Make holiday gifting magical"
    },
    {
      title: "Graduations",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1770&auto=format&fit=crop",
      description: "Celebrate achievements with perfect gifts"
    },
    {
      title: "Housewarming",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1773&auto=format&fit=crop",
      description: "Help make a house a home"
    }
  ];

  const testimonials = [
    {
      name: "Kofi Armah",
      role: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "The contribution feature made my dream gaming setup possible. Friends could chip in what they could afford!",
      rating: 5
    },
    {
      name: "Zara Williams",
      role: "Fashion Blogger",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1887&auto=format&fit=crop",
      quote: "I love how I can add items from any online store. Perfect for my fashion wishlist!",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "New Homeowner",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1935&auto=format&fit=crop",
      quote: "Group gifting made furnishing our new home so much easier. Amazing platform!",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <FaMagic className="w-6 h-6" />,
      title: "Automated Gift Tracking",
      description: "Our smart system keeps track of who's buying what, preventing duplicate gifts."
    },
    {
      icon: <FaLock className="w-6 h-6" />,
      title: "Privacy Controls",
      description: "Choose who sees your wishlists and what information they can access."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] mix-blend-overlay opacity-30" />

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                animate={{
                  x: [Math.random() * 100, Math.random() * window.innerWidth],
                  y: [Math.random() * 100, Math.random() * window.innerHeight],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content - Modified to have text left, image right */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Text Content - Left side */}
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 50
                }}
                className="md:w-1/2"
              >
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    type: "spring"
                  }}
                  className="text-5xl md:text-7xl font-bold text-white mb-8 leading-snug tracking-tight text-left"
                >
                  Receive Gifts Within
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"> 3 Minutes</span>
                </motion.h1>


                <motion.p
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5,
                    type: "spring"
                  }}
                  className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-12 text-left"
                >
                  Create, share, and receive the perfect gifts every time. Join thousands of happy users making gift-giving a delightful experience.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.7,
                    type: "spring"
                  }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <Link
                    to="/auth"
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-lg font-semibold
                            hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                            shadow-lg shadow-purple-500/30"
                  >
                    Get Started Now
                  </Link>
                  <a
                    href="https://youtu.be/Vi4RSlkAA_0"
                    className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-full text-lg font-semibold
                            hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                  >
                    Watch Demo
                  </a>
                </motion.div>
              </motion.div>

              {/* Image - Right side */}
              <motion.div
                className="md:w-1/2 mt-12 md:mt-0"
                initial={{ opacity: 0, y: 100, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  bounce: 0.4
                }}
              >
                <img
                  src="https://i.postimg.cc/tgwKCyhK/bg-remove.png"
                  alt="Gift-giving platform"
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section - Moved up */}
      <section id="how-it-works" className="relative py-32 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated grid background */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
              animate={{
                y: [0, -500],
                x: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  See How It Works
                </h2>
                <p className="text-xl text-gray-300">
                  Watch our quick guide to discover how Nokonice transforms your gift-giving experience
                </p>
              </div>

              <div className="space-y-6 text-left">
                {[
                  {
                    number: "01",
                    title: "Create Your Wishlist",
                    description: "Add items from any online store with our easy-to-use browser extension"
                  },
                  {
                    number: "02",
                    title: "Share with Friends",
                    description: "Share your wishlist on social media or directly with friends and family"
                  },
                  {
                    number: "03",
                    title: "Receive Gifts",
                    description: "Let friends contribute together for bigger gifts"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/20 
                                  flex items-center justify-center text-purple-400 font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* <Link
                to="/auth"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full
                         text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105
                         transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Get Started Now
              </Link> */}
            </motion.div>

            {/* Video Preview Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <a
                href="https://youtu.be/Vi4RSlkAA_0"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer block"
              >
                {/* Video Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                <img
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop"
                  alt="Tutorial Preview"
                  className="w-full h-full object-cover"
                />

                {/* Play Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center
                               group-hover:bg-white transition-colors duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent
                                border-l-[20px] border-l-purple-600
                                border-b-[10px] border-b-transparent
                                translate-x-1" />
                  </div>
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </a>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent
                          backdrop-blur-xl border border-purple-500/20 transform rotate-12"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-transparent
                          backdrop-blur-xl border border-pink-500/20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wild Features Section */}
      <section id="features" className="relative min-h-screen overflow-hidden bg-black flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50" />
          {/* Animated circuit lines */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              style={{
                top: `${Math.random() * 100}%`,
                left: '-20%',
                width: '140%',
                opacity: 0.3
              }}
              animate={{
                x: ['0%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Interactive Visual Side - Now on the left */}
              <div className="relative h-[600px] order-2 lg:order-1">
                {/* 3D Gift Box */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotateY: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  {/* Gift Box */}
                  <div className="relative w-64 h-64">
                    {/* Box Base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl" />
                    
                    {/* Ribbon */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-1/2 w-8 h-full bg-pink-400 transform -translate-x-1/2" />
                      <div className="absolute top-1/2 left-0 w-full h-8 bg-pink-400 transform -translate-y-1/2" />
                      
                      {/* Bow */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                        <div className="relative w-16 h-16">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-pink-400 rounded-full transform rotate-45"
                          />
                          <motion.div
                            animate={{ scale: [1.1, 1, 1.1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-pink-400 rounded-full transform -rotate-45"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sparkles */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      >
                        <div className="w-full h-full bg-white rounded-full" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Gift Parcels */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                      x: [0, 100, 0],
                      y: [0, 50, 0],
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      delay: i * 1.5,
                    }}
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                    }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br 
                                  ${i % 2 === 0 ? 'from-purple-500 to-pink-500' : 'from-pink-500 to-purple-500'}
                                  shadow-lg transform rotate-${Math.random() * 360}`} />
                  </motion.div>
                ))}
              </div>
              
              {/* Features List Side - Now on the right */}
              <div className="space-y-8 order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                    Features
                  </h2>
                  <p className="text-xl text-gray-300 mb-12">
                    Everything you need for the perfect gifting experience
                  </p>
                </motion.div>

                <div className="space-y-6 text-left">
                  {features.slice(0, 4).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent
                                    border border-purple-500/20 backdrop-blur-sm hover:bg-purple-900/30 
                                    transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/20 
                                        flex items-center justify-center group-hover:bg-purple-500/30 
                                        transition-colors duration-300">
                            <span className="text-white text-2xl font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-white text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Nokonice - New Design */}


      {/* Events Section - New Design */}
      <section className="relative py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Create Wishlists for Any Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One platform for all your special moments
            </p>
          </motion.div>

          <div className="relative">
            {/* Event Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {events.map((event, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedEvent(event)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative aspect-square rounded-2xl overflow-hidden
                            ${selectedEvent?.title === event.title ? 'ring-4 ring-purple-500' : ''}`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-white font-semibold text-center">{event.title}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Create Wishlist Button in Events Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <Link
                to="/auth"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full
                         text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105
                         transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Create Your Wishlist Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:75px_75px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of happy users making gift-giving delightful
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg"
              >
                <div className="flex items-center mb-6 text-left">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-200 mb-4">{testimonial.quote}</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="relative py-32 bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

          {/* Floating Elements */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 50 - 25],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            >
              <div className={`w-${Math.random() > 0.5 ? '8' : '12'} h-${Math.random() > 0.5 ? '8' : '12'} 
                            ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-xl'} 
                            bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm
                            border border-white/10`} />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Let's Make Gift-Giving
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"> Magical </span>
                  Together
                </h2>
                <p className="text-xl text-gray-300">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-8">


                {/* Social Media Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10
                           hover:bg-white/10 transition-all duration-300 group"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                  <div className="flex justify-between px-6 flex align-center">
                    <a href="https://www.tiktok.com/@usenokonice" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-pink-400 transition-colors duration-300 flex flex-col items-center gap-2">
                      <FaTiktok className="w-8 h-8" />
                      <span className="text-sm">TikTok</span>
                    </a>
                    <a href="https://www.instagram.com/usenokonice/" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-pink-400 transition-colors duration-300 flex flex-col items-center gap-2">
                      <FaInstagram className="w-8 h-8" />
                      <span className="text-sm">Instagram</span>
                    </a>
                    <a href="https://x.com/usenokonice" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-pink-400 transition-colors duration-300 flex flex-col items-center gap-2">
                      <FontAwesomeIcon icon={faXTwitter} className="w-8 h-8" />
                      <span className="text-sm">Twitter</span>
                    </a>
                    <a href="https://wa.me/233546561444" target="_blank" rel="noopener noreferrer"
                      className="text-white hover:text-pink-400 transition-colors duration-300 flex flex-col items-center gap-2">
                      <FaWhatsapp className="w-8 h-8" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full
                           text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105
                           transition-all duration-300 shadow-lg shadow-purple-500/25 text-center"
                >
                  Get Started Now
                </Link>
                <a
                  href="mailto:hello@nokonice.com"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full text-lg font-semibold
                           hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Send Email
                </a>
              </div>
            </motion.div>

            {/* Visual Side with Rotating Gift Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <motion.div
                  // animate={{
                  //   rotateY: [0, 360],
                  // }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-full h-full"
                >
                  <img
                    src="https://i.postimg.cc/tgwKCyhK/bg-remove.png"
                    alt="Gift Box"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Sparkle Effects */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  >
                    <div className="w-full h-full bg-white rounded-full" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// export default BusinessSection; 
export default BusinessSection; 