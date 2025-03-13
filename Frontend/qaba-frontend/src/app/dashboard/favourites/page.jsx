"use client";
import Header1 from '../components/header1';
import Header2 from '../components/header2';
import Search from '../shared/search';
import Propertycards from '../favourites/propertycards';

export default function FavouritesPage() {
  return (
    <>
      <div className="dashboard-header lg:ml-4 ml-3">
        <Header1 />
        <Header2 />
        <Search /> {/* Fixed: Use uppercase `Search` */}
      </div>
      <div className="space-y-4 ml-6 lg:ml-5">
        <Propertycards />
      </div>
    </>
  );
}