import { createSlice } from '@reduxjs/toolkit';

// ANCHOR: All country codes from ISO 3166-1 alpha-2 (shared across app)
export const ALL_COUNTRY_CODES = [
    'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ',
    'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI',
    'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ',
    'DK', 'DJ', 'DM', 'DO',
    'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET',
    'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF',
    'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY',
    'HT', 'HM', 'VA', 'HN', 'HK', 'HU',
    'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT',
    'JM', 'JP', 'JE', 'JO',
    'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG',
    'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU',
    'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM',
    'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MK', 'MP', 'NO', 'OM',
    'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR',
    'QA',
    'RE', 'RO', 'RU', 'RW',
    'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SE', 'CH', 'SY',
    'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV',
    'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ',
    'VU', 'VE', 'VN', 'VG', 'VI',
    'WF', 'EH', 'YE', 'ZM', 'ZW'
];

const initialState = {
    uploadedPhotos: [],
    uploadedDocuments: [],
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
        addUploadedDocument: (state, action) => {
            const {
                tempId,
                file,
                fileName,
                fileType,
                fileSize,
                documentType,
                countryCode,
                countryName,
                dateRange,
                isLegalDocument,
                uploadDate
            } = action.payload;

            const newDocument = {
                id: Date.now(),
                tempId: tempId,
                file: file,
                fileName: fileName,
                fileType: fileType,
                fileSize: fileSize,
                documentType: documentType,
                countryCode: countryCode,
                countryName: countryName,
                dateRange: dateRange,
                isLegalDocument: isLegalDocument || false,
                uploadDate: uploadDate || new Date().toISOString(),
            };
            state.uploadedDocuments.unshift(newDocument);
        },
        removeUploadedDocument: (state, action) => {
            const documentId = action.payload;
            state.uploadedDocuments = state.uploadedDocuments.filter(
                doc => doc.id !== documentId
            );
        },
        clearUploadedDocuments: (state) => {
            state.uploadedDocuments = [];
        },
        updateDocument: (state, action) => {
            const { id, updates } = action.payload;
            const docIndex = state.uploadedDocuments.findIndex(doc => doc.id === id);
            if (docIndex !== -1) {
                state.uploadedDocuments[docIndex] = {
                    ...state.uploadedDocuments[docIndex],
                    ...updates
                };
            }
        }
    }
})

export const {
    addUploadedPhoto,
    clearUploadedPhotos,
    addUploadedDocument,
    removeUploadedDocument,
    clearUploadedDocuments,
    updateDocument,
    setUploadServices,
    setSingleUploadService
} = uploadSlice.actions;

export default uploadSlice.reducer;