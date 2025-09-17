import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    uploadedPhotos: [],
}

export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        addUploadedPhoto: (state, action) => {
            const { photo, fileName, uploadDate, displayDate } = action.payload;
            const newPhoto = {
                id: Date.now(),
                photo: photo,
                fileName: fileName,
                uploadDate: uploadDate,
                displayDate: displayDate,
            };
            state.uploadedPhotos.unshift(newPhoto);
        },
        clearUploadedPhotos: (state) => {
            state.uploadedPhotos = [];
        },
    }
})

export const { addUploadedPhoto, clearUploadedPhotos, setUploadServices, setSingleUploadService } = uploadSlice.actions;
export default uploadSlice.reducer;