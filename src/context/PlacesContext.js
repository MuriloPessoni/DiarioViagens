import React, { createContext, useContext, useMemo, useState } from 'react';

const PlacesContext = createContext(null);

export function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);

  const value = useMemo(() => ({
    places,
    addPlace: (place) => setPlaces((current) => [place, ...current]),
    updatePlace: (id, updates) => setPlaces((current) => current.map((place) =>
      place.id === id ? { ...place, ...updates } : place)),
    removePlace: (id) => setPlaces((current) => current.filter((place) => place.id !== id)),
    findPlace: (id) => places.find((place) => place.id === id),
  }), [places]);

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) throw new Error('usePlaces precisa estar dentro de PlacesProvider.');
  return context;
}
