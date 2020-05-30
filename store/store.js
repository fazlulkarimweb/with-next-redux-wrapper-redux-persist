import { createStore, applyMiddleware, combineReducers } from "redux";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import counter from "../store/counter/reducer";

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
    //If it's on server side, create a store simply
    return createStore(combinedReducer, bindMiddleware([thunkMiddleware]));
  } else {
    //If it's on client side, create a store with a persistability feature
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "nextjs",
      whitelist: ["counter"], // make sure it does not clash with server keys
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, combinedReducer);
    const store = createStore(
      persistedReducer,
      bindMiddleware([thunkMiddleware])
    );
    store.__persistor = persistStore(store);
    return store;
  }
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore);
