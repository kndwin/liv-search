const express = require("express");
const app = express();
const cors = require("cors");

const { assets, apartments } = require("./mockData");
const { groupJsonByField } = require("./util");

app.use(cors())
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

  const apartmentsByAssets = groupJsonByField(filteredApartments, "asset");
	
	console.log(JSON.stringify(apartmentsByAssets, null, 2))

  const apartmentsByAssetsWithMetadata = Object.entries(apartmentsByAssets)
		.map(([asset, apartments]) => {
      console.log({ asset, apartments });
      return {
        apartments,
			  metadata: {
				  asset,
				  ...assets[asset],
			  }
      } 
    }
  );
  

  res.send(apartmentsByAssetsWithMetadata);
});

module.exports = app;
