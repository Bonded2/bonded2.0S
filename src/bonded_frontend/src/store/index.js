import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import integrationReducer from './slices/integrationSlice';
import signupReducer from './slices/signupSlice';
import uploadReducer from './slices/uploadSline';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    integration: integrationReducer,
    signup: signupReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['profile/setProfilePhoto'],
        ignoredActionsPaths: ['payload.photo'],
        ignoredPaths: ['profile.profilePhoto.photo'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// TypeScript types would be exported here in a .ts file
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
