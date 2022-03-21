import { createContext} from 'react';
 
// User location state
export const LocationState = {
  location: { 
    longitude: null,
    latitude: null,
  },
  setLocation: null,
  address: null,
  setAddress: null,
  name: null,
  setName: null,

  departure: { lat: null, lng: null, address:null},
  setDeparture: null,
  arrival: { lat: null, lng: null, address:null},
  setArrival: null,
}

// App UI general state
export const AppState = {  
  language: 'fr',  
  setLanguage: undefined,
  RTL: false,  
  setRTL: undefined,
  translate: null, 
  intro: true, 
  setIntro: undefined,
  homeStoresFilter: null,
  setHomeStoresFilter: null
} 

// Logged-in user state
export const UserState = {
  userID: null,
  setUserID: null,
  user: null,
  setUser: null,
  signOut: null
}

// Search state
export const SearchState = {
    searchResult: null,
    setSearchResult: null,
    searchTerm: null,
    setSearchTerm: null,
  }

export const DistanceState = {
  distance: 3000,
  setDistance: null
}

export const CardState = {
  products: [],
  setProducts: null,

  discount: 0,
  setDiscount: null,

  shippingCost: 0,
  setShippingCost: null,

  totalPrice: 0,
  setTotalPrice: null,
}



export const StoreState = {
  store: null, 
  setStore: null,
}

export const FavoritesState = {
  favorites: null,
  setFavorites: null,
}

export const OrderState = {
  order: [],
  setOrder: null,
}

export const AppContext = createContext(AppState)
export const UserContext = createContext(UserState)
export const LocationContext = createContext(LocationState)
export const DistanceContext = createContext(DistanceState)

export const CardContext = createContext(CardState)
export const SearchContext = createContext(SearchState)
export const StoreContext = createContext(StoreState)
export const FavoritesContext = createContext(FavoritesState)

export const OrderContext = createContext(OrderState)