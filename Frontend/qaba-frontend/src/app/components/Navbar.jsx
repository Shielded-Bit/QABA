import Link from 'next/link';

const Navbar = () => (
  <nav>
    <Link href="/">Home</Link>
    <Link href="/buy">Buy</Link>
    <Link href="/rent">Rent</Link>
  </nav>
);
export default Navbar;
