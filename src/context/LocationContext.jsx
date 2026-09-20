import React, { createContext, useContext, useEffect, useState } from "react";
import { getLocationsApi } from "../services/address.api.js";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState({});
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await getLocationsApi();

        if (response) {
          setLocations(response);
        }
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setLocationLoading(false);
      }
    };

    loadLocations();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        locations,
        locationLoading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  return useContext(LocationContext);
};