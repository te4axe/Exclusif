import { useEffect, useState } from "react";
import { useProductStore } from "../store/product";
import ProductCard from "../componentes/ProductCard";
import { ToastContainer,  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaHeadphonesAlt } from "react-icons/fa";
import { GrValidate } from "react-icons/gr";
import NewArrival from "../componentes/NewArrival";
import Pagination from "../componentes/Pagination";
import CategoryLinks from "../componentes/CategoryLinks";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Home() {
  const { fetchProduct, products } = useProductStore();
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const [searchTerm, ] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [userRole, setUserRole] = useState(null); 
  const [, setLoading] = useState(false); 
  const [, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [productsPerPage] = useState(8); 
  const [currentSlide, setCurrentSlide] = useState(0); 
  const [personalizedPage, setPersonalizedPage] = useState(0);
  const personalizedPerPage = 4;

  const paginatedPersonalized = personalizedProducts.slice(
    personalizedPage * personalizedPerPage,
    (personalizedPage + 1) * personalizedPerPage
  );
  
  const nextPersonalized = () => {
    setPersonalizedPage((prev) =>
      (prev + 1) * personalizedPerPage >= personalizedProducts.length
        ? 0
        : prev + 1
    );
  };
  
  const prevPersonalized = () => {
    setPersonalizedPage((prev) =>
      prev === 0
        ? Math.floor((personalizedProducts.length - 1) / personalizedPerPage)
        : prev - 1
    );
  };
  
  
  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Jusqu'à 10% de réduction",
      subtitle: "Série iPhone 14",
      buttonText: "Achetez maintenant",
      image: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/tile/Apple-iPhone-16-Pro-hero-geo-240909-lp.jpg.landing-big_2x.jpg",
      bgColor: "bg-gray-900",
      textColor: "text-white",
    },
    {
      id: 2,
      title: "Nouveaux arrivages",
      subtitle: "Collection Été 2025",
      buttonText: "Découvrir",
      image: "https://static.wixstatic.com/media/2cb441_f01d01c1775241b2a12a00c96260e46f~mv2.jpg/v1/fill/w_568,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cb441_f01d01c1775241b2a12a00c96260e46f~mv2.jpg",
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "Offres spéciales",
      subtitle: "Livraison gratuite",
      buttonText: "En savoir plus",
      image: "https://shop-ta-box.com/wp-content/uploads/2024/01/Blissim-720x405.jpg",
      bgColor: "bg-red-600",
      textColor: "text-white",
    },
    {
      id: 4,
      title: "Nouveautés tech",
      subtitle: "Découvrez nos gadgets",
      buttonText: "Explorer",
      image: "https://cdn.prod.website-files.com/63af1964cee58c25c01c102f/6401d387af638fda8c374a1d_happy-african-shopaholic-woman-choosing-clothes-po-2022-12-16-06-33-24-utc-min.jpg",
      bgColor: "bg-purple-600",
      textColor: "text-white",
    },
    {
      id: 5,
      title: "Collection limitée",
      subtitle: "Jusqu'à épuisement des stocks",
      buttonText: "Acheter maintenant",
      image: "https://www.shutterstock.com/image-photo/close-male-female-athlete-standing-260nw-1871076034.jpg",
      bgColor: "bg-green-600",
      textColor: "text-white",
    },
  ];

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

// إضافة تدقيق حالة المستخدم
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      console.log("DEBUG: Full token contents in Home:", decoded);
      console.log("DEBUG: Demographic data:", {
        age: decoded.age, 
        ageType: typeof decoded.age,
        gender: decoded.gender,
        country: decoded.country
      });
    } catch (err) {
      console.error("ERROR: Token decode failed in Home:", err);
    }
  } else {
    console.log("DEBUG: No token found in localStorage");
  }
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const user = jwt_decode(token);
      setUserRole(user.role);
      
      // Ensure age is properly converted to a number
      let userAge = user.age;
      if (typeof userAge === 'string') {
        userAge = parseInt(userAge, 10);
      }
      
      // Debug the exact values
      console.log("DEBUG: Data for recommendations:", {
        age: userAge,
        gender: user.gender, 
        country: user.country
      });
      
      // Check if we have valid data for recommendations
      if (userAge && user.gender && user.country) {
        console.log("DEBUG: Making recommendation request");
        
        fetch("http://localhost:5001/personalized-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: userAge,
            gender: user.gender,
            country: user.country
          }),
        })
        .then(response => {
          console.log("DEBUG: Response status:", response.status);
          if (!response.ok) {
            return response.text().then(text => {
              console.error("Server error details:", text);
              throw new Error(`Server error: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("DEBUG: Received recommendations data:", data);
          if (Array.isArray(data) && data.length > 0) {
            setPersonalizedProducts(data);
            console.log("DEBUG: Set personalized products state with", data.length, "items");
          } else {
            console.log("DEBUG: No recommendations received or empty array");
          }
        })
        .catch(err => {
          console.error("ERROR: Failed to fetch recommendations:", err);
        });
      } else {
        console.warn("WARN: Missing user demographics for recommendations:", {
          hasAge: Boolean(userAge),
          hasGender: Boolean(user.gender), 
          hasCountry: Boolean(user.country)
        });
      }
    } catch (err) {
      console.error("ERROR: Failed to process token for recommendations:", err);
    }
  }
}, []);
   






useEffect(() => {
  if (products.length === 0) {
    setLoading(true);
    fetchProduct()
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setError("Failed to load products");
      });
  }
}, [fetchProduct, products.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.length > 0
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil((filteredProducts.length > 0 ? filteredProducts.length : products.length) / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex">
        {/* Left side categories */}
       
              <CategoryLinks />
        <div className="w-full md:w-4/5">
          {/* Banner carousel */}
          <div className="relative overflow-hidden h-64 md:h-96">
            {bannerSlides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute w-full h-full transition-opacity duration-500 flex items-center ${slide.bgColor} ${slide.textColor} ${
                  index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>

                <div className="container mx-auto px-6 md:px-12 flex items-center relative z-10">
                  <div className="w-1/2">
                    <h3 className="text-xl md:text-2xl font-light">{slide.subtitle}</h3>
                    <h2 className="text-3xl md:text-5xl font-bold my-2">{slide.title}</h2>
                    <button className="mt-4 px-4 py-2 bg-white text-gray-900 font-medium rounded flex items-center">
                      {slide.buttonText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-3 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-3 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                ></button>
              ))}
            </div>
          </div>
          {/* Products section */}
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Get Started Message */}
            <div className="bg-gray-200 py-12">
            {!userRole ? (
  <div className="bg-gray-200 py-12">
    <div className="text-center">
    <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-orange-400 text-transparent bg-clip-text mb-4">
    Explore Our Popular Products
  </h3>      <p className="text-lg text-gray-600 mb-6">We have a wide selection of quality items. Click below to start exploring!</p>
      <Link to="/register" className="bg-yellow-500 text-white px-6 py-3 rounded-full text-lg shadow-md hover:bg-yellow-600 transition duration-300">
        Get Started
      </Link>
    </div>
  </div>
) : (
  <div className="bg-gray-200 py-12">
    <div className="text-center">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h3>
      <p className="text-lg text-gray-600 mb-6">Start exploring personalized product recommendations.</p>
    </div>
  </div>
)}
</div>
{/* Personalized Recommendations Section */}
{personalizedProducts && personalizedProducts.length > 0 && (
  <div className="mt-16 relative">
 <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-orange-500 to-orange-400 text-transparent bg-clip-text mb-8">
  Pour Vous
</h2>

  {/* Arrows Navigation */}
  <button
    onClick={prevPersonalized}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-200"
  >
    <FaArrowLeft className="text-xl text-gray-700" /> {/* استخدام الأيقونة الجديدة */}
  </button>

  {/* Products Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {paginatedPersonalized.map((product) => (
      <ProductCard key={product._id} product={product} userRole={userRole} />
    ))}
  </div>

  <button
    onClick={nextPersonalized}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-200"
  >
    <FaArrowRight className="text-xl text-gray-700" /> {/* استخدام الأيقونة الجديدة */}
  </button>
</div>

)}<br/>



<h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-orange-500 to-orange-400 text-transparent bg-clip-text mb-8">This Month</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} userRole={userRole} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              paginate={paginate}
            /><br/>
            {/* Personalized Recommendations */}



         <NewArrival />
    {/* New Section for Features */}
    <div className="flex justify-center space-x-10 bg-gray-100 py-8 mt-12">
              <div className="text-center">
                <CiDeliveryTruck className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h4 className="font-bold text-lg">FREE AND FAST DELIVERY</h4>
                <p className="text-sm">Free delivery for all orders over $140</p>
              </div>
              <div className="text-center">
                <FaHeadphonesAlt className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h4 className="font-bold text-lg">24/7 CUSTOMER SERVICE</h4>
                <p className="text-sm">Friendly 24/7 customer support</p>
              </div>
              <div className="text-center">
                <GrValidate className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h4 className="font-bold text-lg">MONEY BACK GUARANTEE</h4>
                <p className="text-sm">We return money within 30 days</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
