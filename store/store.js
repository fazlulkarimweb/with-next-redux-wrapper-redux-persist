import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import counter from './counter/reducer';
import storage from './sync_storage';
// If you don't bother about the error redux-persist failed to create sync storage. falling back to noop storage...uncomment the next line and comment out the previous import. See more on - https://github.com/vercel/next.js/discussions/15687
// const storage = require('redux-persist/lib/storage').default;

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  counter,
  // OTHER REDUCERS WILL BE ADDED HERE
});

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
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
    const { persistStore, persistReducer } = require('redux-persist');
    // If you bother about the error redux-persist failed to create sync storage. falling back to noop storage....comment the next line and uncomment the second line. See more on - https://github.com/vercel/next.js/discussions/15687 Though it's a unresolved issue in many instances.
    // const storage = require('redux-persist/lib/storage').default;
    // const storage = require('./sync_storage');

    const persistConfig = {
      key: 'nextjs',
      whitelist: ['counter'], // only counter will be persisted, add other reducers if needed
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
