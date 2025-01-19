import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { api } from "./services/api"
import user from '../features/user/userSlice'
import { listenerMiddleware } from "../middleware/auth"

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
  export const  store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      user
    },
    middleware: (getDeafaultMiddleware) => 
      getDeafaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
    
  })

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
