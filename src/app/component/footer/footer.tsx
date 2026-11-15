export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs text-gray-600 sm:flex-row sm:text-left">

        {/* Left Side */}
        <p>
          BazarDor - Compare daily prices of essential products.
        </p>

        {/* Right Side */}
        <p>
          Prices are updated regularly; market conditions may change.
        </p>

      </div>
    </footer>
  );
}