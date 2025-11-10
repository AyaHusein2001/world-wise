import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
        setIsLoading(false);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);
  const getCity = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
      setIsLoading(false);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const createCity = async (newCity) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
      setIsLoading(false);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCity = async (id) => {
    try {
      setIsLoading(true);
       await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
      setIsLoading(false);
    } catch (error) {
      alert('Error deleting city');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
const useCities = () => {
  const context = useContext(CitiesContext);
  if (!context)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
};
export { CitiesProvider, useCities };
