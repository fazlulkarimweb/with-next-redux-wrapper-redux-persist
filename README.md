# Boilerplate for Next Redux Wrapper with Redux Persist (& redux-thunk too) for Next JS project 😍

My problem was that I needed a simple persistent global state for my Next.js website. This is a redux boilerplate and I wrote it for myself at first to speed up my future project.

Using a persistent global state in a Next js website is much more daunting than I thought! See my [twitter](https://twitter.com/fazlulkarimweb/status/1266463218265812992) 😂. You have to have a solid understanding of client-side and server-side rendering & how Next js is dealing with it! Obviously don't forget about the persistency feature and some performance drawbacks of in case of server-side rendering. So I created this boilerplate with a classic counter app example.

![Counter Example](https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist/blob/master/public/Homepage.gif?raw=true)

## Why this boileplate? 😰

Copy and pasting redux boilerplate code without understanding seems a norm to people who are relatively new to the redux ecosystem. If you are new to redux, you may use this boilerplate to copy and paste and attain the functionality right away. Okay, you can do this. But it will be more helpful if you understand the code and implement it by yourself. You may take help from this boilerplate code. I didn't find a boilerplate like this in the next js example section. Besides I used hook every time in my redux code. The example in the next js repo weren't written with the hooks. Hooks in redux are elegant and powerful.😍

So I decided to write one for myself!

## Enough Talk, Show me the code

What should be the structure of your redux store?

```javascript
// ./store/store

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
```

View the file structure along with the code

![Code with the file structure](https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist/blob/master/public/_appjs.png?raw=true)

## How you should wrap the \_app js file

Screenshot for understanding the file structure along with the code.

![Code with the file structure](https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist/blob/master/public/next%20app%20wrapper.png?raw=true)

## External API call & NEXT RUN BUILD

I tried to add some external API call to see the hydration and rehydration process. Have a look into the SSG, Static & SSR rendering of the pages in this boilerplate. Seems good to me.

![Code with the file structure](https://github.com/fazlulkarimweb/with-next-redux-wrapper-redux-persist/blob/master/public/Next_Build.png?raw=true)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update the tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
