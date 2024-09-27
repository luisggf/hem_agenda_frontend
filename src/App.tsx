import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/BloodDonationMain";
import CheckPersonsDonations from "./components/PersonDonations";
import MaintenanceDonationLocal from "./components/MaintenanceDonationLocal";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search-persons-donation"
            element={<CheckPersonsDonations />}
          />
          <Route
            path="/maintenance-donation-local"
            element={<MaintenanceDonationLocal />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
