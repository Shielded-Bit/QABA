"use client";

import Header2 from '../components/header2';
import Transactions from './transactions';

export default function FavouritesPage() {
  return (
    <>
      <div className="dashboard-header lg:ml-4 ml-3">
        <Header2 />
      </div>
      <div className="space-y-4 ml-14 lg:ml-5 mt-5">
        < Transactions/>
      </div>
    </>
  );
}
