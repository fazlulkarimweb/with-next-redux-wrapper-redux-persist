import { createStore, applyMiddleware, combineReducers } from "redux";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import counter from "./counter/reducer";

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  counter,
  // OTHER REDUCERS WILL BE ADDED HERE
});

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return createStore(combinedReducer, bindMiddleware([thunkMiddleware]));
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "nextjs",
      whitelist: ["counter"], // only counter will be persisted, add other reducers if needed
      storage, // if needed, use a safer storage
    };

    const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

    const store = createStore(
      persistedReducer,
      bindMiddleware([thunkMiddleware])
    ); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore);
