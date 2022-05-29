const express = require("express");
const app = express();
const cors = require("cors");

const { assets, apartments } = require("./mockData");
const { groupJsonByField, permutator } = require("./util");

app.use(cors());
app.get("/apartments", (req, res) => {
  let filteredApartments = apartments;

  let locations = req.query.locations;
  if (locations?.length > 0) {
    if (locations.includes(",")) {
      locations = locations.split(",");
    } else {
      locations = [locations];
    }
    filteredApartments = filteredApartments.filter(({ asset }) =>
      locations.includes(assets[asset].city)
    );
  }

  const bedrooms = req.query.bedrooms?.split(",") ?? [];
  if (bedrooms?.length > 0) {
    const [min, max] = bedrooms.map((b) => parseInt(b));
    filteredApartments = filteredApartments.filter(
      ({ bedrooms }) => min <= bedrooms && bedrooms <= max
    );
  }

  const bathrooms = req.query.bathrooms?.split(",") ?? [];
  if (bathrooms?.length > 0) {
    const [min, max] = bathrooms.map((b) => parseInt(b));
    filteredApartments = filteredApartments.filter(
      ({ bathrooms }) => min <= bathrooms && bathrooms <= max
    );
  }

  const uniqueFilters = filteredApartments
    // Grab only "bedrooms" and "asset" properties
    .map((apartment) => ({
      bedrooms: apartment.bedrooms,
      asset: apartment.asset,
    }))
    // Remove all duplicates from above result
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.bedrooms === value.bedrooms && t.asset === value.asset
        )
    );

  const groupedApartments = uniqueFilters.map(({ bedrooms, asset }) => {
    const apartments = filteredApartments.filter(
      (a) => a.asset === asset && a.bedrooms === bedrooms
    );
    const metadata = {
      asset,
      ...assets[asset],
      bedrooms,
    };
    return {
      apartments,
      metadata,
    };
  });

  res.send(groupedApartments);
});

module.exports = app;
