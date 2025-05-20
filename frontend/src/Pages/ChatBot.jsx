import { useState, useRef, useEffect } from "react";


export default function Chatbot({ userRole, products }) { // Added products prop
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Support Bot 🐱", sender: "bot" },
    { 
      text: "I can help you with the following topics ↓", 
      sender: "bot",
      showMainMenuButton: true
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuTimer = useRef(null);

  // Menu options with icons
  const menuOptions = [
    { id: "offer", text: "Offer", icon: "🏷️" },
    { id: "faq", text: "FAQ", icon: "❓" },
    { id: "contact", text: "Contact us", icon: "📞" },
    { id: "feedback", text: "Feedback", icon: "📝" },
    { id: "discount", text: "Discount", icon: "💰" },
    { id: "account", text: "Account issues", icon: "👤" }
  ];
  
  // Info category options with icons
  const categoryOptions = [
    { id: "delivery", text: "DELIVERY", icon: "📦" },
    { id: "returns", text: "RETURNS", icon: "🔄" },
    { id: "refund", text: "REFUND POLICY", icon: "💳" },
    { id: "company", text: "OUR COMPANY", icon: "🏢" }
  ];

  // Get top 4 products (sorted by rating or any other criteria)
  const getTopProducts = () => {
    // If products array is empty or undefined, provide fallback products with ratings
    if (!products || products.length === 0) {
      return [
        { id: 1, name: "modem", price: 10, image: "backend/uploads/1744481499731-modem.jpeg", rating: 4.8, reviewCount: 124 },
        { id: 2, name: "iphone", price: 11, image: "/images/iphone.jpg", rating: 4.9, reviewCount: 356 },
        { id: 3, name: "glose", price: 10.99, image: "/images/glose.jpg", rating: 4.7, reviewCount: 98 },
        { id: 4, name: "kiko", price: 10, image: "/images/kiko.jpg", rating: 4.6, reviewCount: 75 }
      ];
    }
    
    // Sort by rating first (highest rating first), then by reviewCount if ratings are equal
    return [...products]
      .sort((a, b) => {
        // First compare by rating
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        
        // If ratings are equal, compare by review count
        if (ratingDiff === 0) {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        
        return ratingDiff;
      })
      .slice(0, 4)
      .map(product => ({
        ...product,
        // Ensure image exists or provide fallback
        image: product.image || `/images/${product.name.toLowerCase()}.jpg`
      }));
  };
  
  // Enhanced handleOfferClick function that emphasizes best-reviewed products
  const handleOfferClick = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      const topProducts = getTopProducts();
      const botResponse = { 
        text: "Here are our best-rated products right now:", 
        sender: "bot",
        showProducts: true,
        products: topProducts,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (menuTimer.current) {
        clearTimeout(menuTimer.current);
      }
    };
  }, []);

  // Reset chat to initial state
  const resetChat = () => {
    setMessages([
      { text: "Hi! I'm Support Bot 🐱", sender: "bot" },
      { 
        text: "I can help you with the following topics ↓", 
        sender: "bot",
        showMainMenuButton: true
      }
    ]);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animation effect when opening/closing chatbot
  useEffect(() => {
    if (chatContainerRef.current) {
      if (chatbotOpen) {
        chatContainerRef.current.style.opacity = "0";
        chatContainerRef.current.style.transform = "translateY(20px)";
        setTimeout(() => {
          chatContainerRef.current.style.opacity = "1";
          chatContainerRef.current.style.transform = "translateY(0)";
        }, 50);
      }
    }
  }, [chatbotOpen]);

  // Add Main Menu button to messages
  const addMainMenuButton = () => {
    const menuMessage = {
      text: "Would you like to see the main menu again?",
      sender: "bot",
      showMainMenuButton: true,
    };
    setMessages(prev => [...prev, menuMessage]);
  };

  // Show main menu options
  const showMainMenuOptions = () => {
    const menuOptionsMessage = {
      text: "Main Menu Options:",
      sender: "bot",
      showMainMenuOptions: true,
    };
    setMessages(prev => [...prev, menuOptionsMessage]);
  };

  // Handle chat submit
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      if (input.toLowerCase().includes("faq")) {
        const botResponse = { 
          text: "I can provide information regarding:", 
          sender: "bot",
          showCategories: true,
        };
        setMessages(prev => [...prev, botResponse]);
        
        setTimeout(() => {
          addMainMenuButton();
        }, 500);
      } else {
        const botResponse = { 
          text: "Thank you for your message. How else can I help you today?", 
          sender: "bot",
        };
        setMessages(prev => [...prev, botResponse]);
        
        setTimeout(() => {
          addMainMenuButton();
        }, 500);
      }
      setIsTyping(false);
    }, 1500);
  };

  // Handle option click
  const handleOptionClick = (option) => {
    const userMessage = { text: option, sender: "user" };
    setMessages([...messages, userMessage]);
    
    setIsTyping(true);
    
    let botResponse;
    
    if (option === "FAQ") {
      setTimeout(() => {
        const botResponse = { 
          text: "I can provide information regarding:", 
          sender: "bot",
          showCategories: true,
        };
        setMessages(prev => [...prev, botResponse]);
        
        setTimeout(() => {
          addMainMenuButton();
        }, 500);
      }, 1000);
      return;
    }
    
    if (option === "Offer") {
      handleOfferClick();
      return;
    }
    
    switch(option) {
      case "Contact us":
        botResponse = "You can reach our customer service at support@example.com or call us at +1-234-567-8900 during business hours (9 AM - 5 PM).";
        break;
      case "Feedback":
        botResponse = "We value your opinion! Please share your feedback about our products or services.";
        break;
      case "Discount":
        botResponse = "Use code WELCOME10 for 10% off your first purchase. We also have seasonal sales and special member discounts.";
        break;
      case "Account issues":
        botResponse = "I can help with login problems, account recovery, or updating your profile. What issue are you experiencing?";
        break;
      default:
        botResponse = "How can I help you with that?";
    }
    
    setTimeout(() => {
      const botMessageObj = { 
        text: botResponse, 
        sender: "bot",
      };
      setMessages(prev => [...prev, botMessageObj]);
      
      setTimeout(() => {
        addMainMenuButton();
      }, 500);
      
      setIsTyping(false);
    }, 1000);
  };

  // Handle main menu click
  const handleMainMenuClick = () => {
    const userMessage = { 
      text: "Main Menu", 
      sender: "user", 
    };
    setMessages([...messages, userMessage]);
    
    setTimeout(() => {
      showMainMenuOptions();
    }, 500);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
        style={{ width: "60px", height: "60px" }}
      >
        {chatbotOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {chatbotOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl z-50 transition-all duration-300"
          style={{ 
            width: "375px",
            height: "675px",
            maxHeight: "80vh",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(20px)",
            opacity: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Chat Header */}
          <div className="bg-white p-4 flex justify-between items-center border-b border-orange-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Bot</h3>
                <p className="text-xs text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button 
                  onMouseEnter={() => {
                    clearTimeout(menuTimer.current);
                    setShowMenu(true);
                  }}
                  onMouseLeave={() => {
                    menuTimer.current = setTimeout(() => setShowMenu(false), 300);
                  }}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div 
                    onMouseEnter={() => clearTimeout(menuTimer.current)}
                    onMouseLeave={() => menuTimer.current = setTimeout(() => setShowMenu(false), 300)}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={resetChat}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Reset Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-gray-100 flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index}>
                  {/* Show sender label when needed */}
                  {(index === 0 || messages[index-1]?.sender !== msg.sender) && (
                    <div className="text-xs text-gray-500 flex items-center my-2">
                      {msg.sender === "bot" && (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Bot
                        </>
                      )}
                      {msg.sender === "user" && (
                        <div className="ml-auto">You</div>
                      )}
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                      style={{
                        borderTopRightRadius: msg.sender === "user" ? 0 : "0.75rem",
                        borderTopLeftRadius: msg.sender === "bot" ? 0 : "0.75rem"
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                  
                  {/* Product Offers */}
                  {msg.showProducts && (
  <div className="mt-4 space-y-3">
    <h4 className="font-medium text-gray-700 mb-2">Top-Rated Products:</h4>
    {msg.products?.map((product) => (
      <div key={product._id || product.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start">
          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/64';
                }}
              />
            )}
            {!product.image && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h5 className="font-medium">{product.name}</h5>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {/* Display star rating based on actual rating */}
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" 
                       fill={(product.rating || 0) > i ? "currentColor" : "none"} 
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {product.rating ? product.rating.toFixed(1) : "N/A"} 
                {product.reviewCount ? ` (${product.reviewCount})` : ""}
              </span>
            </div>
            <p className="text-orange-600 font-bold mt-1">${product.price}</p>
            <div className="flex mt-2 space-x-2">
              <button 
                className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                onClick={() => {
                  // Display product details
                  const userMessage = { text: `View details for ${product.name}`, sender: "user" };
                  const botResponse = { 
                    text: `Here are the details for ${product.name}: ${product.description || 'This is a highly rated product with a ${product.rating ? product.rating.toFixed(1) : "great"} star rating!'}`, 
                    sender: "bot"
                  };
                  setMessages(prev => [...prev, userMessage, botResponse]);
                }}
              >
                View Details
              </button>
              <button 
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => {
                  // Add to cart logic
                  const userMessage = { text: `Add ${product.name} to cart`, sender: "user" };
                  const botResponse = { 
                    text: `${product.name} has been added to your cart!`, 
                    sender: "bot"
                  };
                  setMessages(prev => [...prev, userMessage, botResponse]);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
    <div className="grid grid-cols-3 gap-2 mt-3">
      <button 
        className="bg-orange-50 text-orange-600 text-sm py-2 rounded hover:bg-orange-100"
        onClick={() => {
          // Browse all products
          const userMessage = { text: "Browse all products", sender: "user" };
          const botResponse = { 
            text: "Taking you to all products...", 
            sender: "bot"
          };
          setMessages(prev => [...prev, userMessage, botResponse]);
          
          // Since we're in a chat interface, we'll simulate the navigation:
          setTimeout(() => {
            handleOfferClick(); // This will refresh the product offerings
          }, 1000);
        }}
      >
        Browse All
      </button>
      <button 
        className="bg-gray-50 text-gray-600 text-sm py-2 rounded hover:bg-gray-100"
        onClick={() => {
          // Discounts navigation
          const userMessage = { text: "Show me discounts", sender: "user" };
          const botResponse = { 
            text: "Here are our best-rated products on sale:", 
            sender: "bot",
            showProducts: true,
            products: getTopProducts().map(p => ({
              ...p, 
              price: (p.price * 0.8).toFixed(2), 
              originalPrice: p.price,
              discountPercent: 20
            }))
          };
          setMessages(prev => [...prev, userMessage, botResponse]);
        }}
      >
        Discounts
      </button>
      <button 
        className="bg-gray-50 text-gray-600 text-sm py-2 rounded hover:bg-gray-100"
        onClick={() => {
          // New arrivals (still sorted by top ratings)
          const userMessage = { text: "Show new arrivals", sender: "user" };
          const botResponse = { 
            text: "Here are our newest top-rated products:", 
            sender: "bot",
            showProducts: true,
            products: getTopProducts().slice(0, 2).map(p => ({...p, isNew: true}))
          };
          setMessages(prev => [...prev, userMessage, botResponse]);
        }}
      >
        New Arrivals
      </button>
    </div>
  </div>
)}

                  {/* Categories for FAQ */}
                  {msg.showCategories && (
                    <div className="mt-2">
                      {categoryOptions.map((option) => (
                        <div 
                          key={option.id}
                          className="flex items-center bg-white p-2 rounded mb-1 shadow-sm border border-gray-100 cursor-pointer hover:bg-orange-50"
                          onClick={() => {
                            const userMsg = { 
                              text: `${option.icon} ${option.text}`, 
                              sender: "user", 
                            };
                            setMessages([...messages, userMsg]);
                            
                            setIsTyping(true);
                            setTimeout(() => {
                              let responseText = "";
                              switch(option.id) {
                                case "delivery":
                                  responseText = "Our standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee. All orders are trackable through your account.";
                                  break;
                                case "returns":
                                  responseText = "Returns are accepted within 30 days of purchase. Items must be in original condition with tags attached. Start your return through your account or contact customer support.";
                                  break;
                                case "refund":
                                  responseText = "Refunds are processed within 5-7 business days after we receive your returned items. Original payment method will be refunded automatically.";
                                  break;
                                case "company":
                                  responseText = "Our company was founded in 2015 with a mission to provide high-quality tech products at competitive prices. We now serve customers in over 20 countries.";
                                  break;
                                default:
                                  responseText = "Please let me know what specific information you need.";
                              }
                              
                              const botMsg = { 
                                text: responseText, 
                                sender: "bot",
                              };
                              setMessages(prev => [...prev, botMsg]);
                              
                              setTimeout(() => {
                                addMainMenuButton();
                              }, 500);
                              
                              setIsTyping(false);
                            }, 1500);
                          }}
                        >
                          <span className="mr-2">{option.icon}</span>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Menu Button */}
                  {msg.showMainMenuButton && (
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <button
                        onClick={handleMainMenuClick}
                        className="flex items-center justify-center bg-gray-50 hover:bg-orange-50 text-gray-800 rounded-lg px-4 py-3 text-sm shadow-sm border border-gray-100 transition-colors"
                      >
                        <span className="mr-2 text-lg">📋</span> 
                        <span>Main Menu</span>
                      </button>
                    </div>
                  )}

                  {/* Main Menu Options */}
                  {msg.showMainMenuOptions && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {menuOptions.map((option) => (
                        <button
                          key={option.id}
                          className="flex items-center justify-center bg-gray-50 hover:bg-orange-50 text-gray-800 rounded-lg px-4 py-3 text-sm shadow-sm border border-gray-100 transition-colors"
                          onClick={() => handleOptionClick(option.text)}
                        >
                          <span className="mr-2 text-lg">{option.icon}</span>
                          <span>{option.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-500 px-4 py-2 rounded-xl" style={{ borderTopLeftRadius: 0 }}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-orange-200">
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg p-2 px-4 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}