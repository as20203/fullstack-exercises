import anecdotesReducer from './reducers/anecdoteReducer'
import anecdotesFilterReducer from './reducers/anecdoteFilterReducer'
import anecdoteNotificationReducer from './reducers/notificationReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
   anecdotes: anecdotesReducer,
   filter: anecdotesFilterReducer,
   notification: anecdoteNotificationReducer
  }
})


export default store;