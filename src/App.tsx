import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/BloodDonationMain";
import CheckPersonsDonations from "./components/popups/PersonDonations";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
