import SearchInput from "../inputs/SearchInput";

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero bg-cover bg-center h-[60vh] md:h-screen flex flex-col justify-center items-center text-center relative px-4 md:px-12 lg:px-20 pt-8"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dqbbm0guw/image/upload/v1734019847/Group_17_xusaes.png')",
        }}
      >
        {/* Main Heading */}
        <h1 className="text-[2.2rem] md:text-[3.3rem] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mt-2 md:mt-4 text-left md:text-center">
          Discover the best <span className="text-[#3ab7b1]">Properties</span>
        </h1>

        {/* Sub Heading */}
        <p className="text-base md:text-lg mb-5 text-black mt-1 text-left md:text-center">
          Find homes to buy and rent with us at your convenience
        </p>

        {/* Search Input */}
        <div className="mt-2 mb-40 md:mt-1 w-full max-w-3xl">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}
