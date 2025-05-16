"use client";
// import Header2 from '../components/header2';
import Propertycards from './propertycards';

export default function FavouritesPage() {
  return (
    <>
      {/* <div className="dashboard-header lg:ml-4 ml-3">
        <Header2 />
      </div> */}
      <div className="space-y-4 ml-12 lg:ml-8">
        <Propertycards />
      </div>
    </>
  );
}