import {configureStore} from '@reduxjs/toolkit'
import userReducer from './user/reducer'
import reactotron from '../ReactotronConfig'
const store = configureStore({
  reducer: {
    user: userReducer,
  },
  enhancers: (getDefaultEnhancers) => {
    return getDefaultEnhancers({
      autoBatch: {},
    }).concat(reactotron.createEnhancer())
  },
})

export default store;
