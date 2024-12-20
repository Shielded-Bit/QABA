import SearchInput from "../components/static/inputs/SearchInput";

export default function Page() {
    return (
      <div>
        {/* Hero Section */}
        <div 
          className="hero bg-cover bg-center h-screen flex flex-col justify-center items-center text-center relative pt-[80px]" 
          style={{ backgroundImage: "url('https://res.cloudinary.com/dqbbm0guw/image/upload/v1734019847/Group_17_xusaes.png')" }}
        >
          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
            Discover the Best Properties
          </h1>
  
          {/* Sub Heading */}
          <p className="text-lg text-black mt-4">
            Find homes to buy and rent at your convenience.
          </p>
        </div>
        <SearchInput/>
      </div>
    );
  }
  

