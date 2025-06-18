import Section6 from './components/landingPage/Section6';
import HeroSection from './components/landingPage/HeroSection';
// import Section1 from './components/landingPage/Section1';
import Section2 from './components/landingPage/Section2';
import Section3 from './components/landingPage/Section3';
import Section4 from './components/landingPage/Section4';
import Section5 from './components/landingPage/Section5';

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <Section1 /> */}
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </>
  );
}
