import { createSlice } from "@reduxjs/toolkit";

const codeToFlagEmoji = (code) =>
    code
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const ALL_COUNTRY_CODES = [
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

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const AVAILABLE_COUNTRIES = ALL_COUNTRY_CODES.map((code) => ({
    name: regionNames.of(code) || code,
    code,
    flag: codeToFlagEmoji(code),
}))
    .filter((c) => Boolean(c.name))
    .sort((a, b) => a.name.localeCompare(b.name));

const initialState = {
    // Profile Photo State
    profilePhoto: {
        photo: null,
        fileName: null,
        isUploaded: false,
        validationChecks: [
            { text: "Photo has good lighting", isMet: false },
            { text: "Details are in focus", isMet: false },
            { text: "There is no glare", isMet: false },
        ],
    },

    // Nationalities State
    nationalities: {
        selectedNationalities: [],
        searchTerm: "",
        isSaved: false,
        availableCountries: AVAILABLE_COUNTRIES,
        dropdowns: [{ id: 1, searchTerm: "", selectedNationality: null }],
    },

    // Residencies State
    residencies: {
        primaryResidence: "",
        otherAddresses: [{ id: 1, value: "" }],
        isSaved: false,
    },

    // Upload File State
    uploadedFiles: {
        files: [],
        currentFile: {
            file: null,
            fileType: null,
            countryCode: "",
            dateRange: { start: null, end: null },
            isProcessed: false,
        },
        documentTypes: [
            { id: 1, name: "Marriage Certificate", code: "marriage-certificate" },
            { id: 2, name: "Bank Statement", code: "bank-statement" },
            { id: 3, name: "Utility Bill", code: "utility-bill" },
            { id: 4, name: "Other", code: "other" },
        ],
        countriesOfIssue: AVAILABLE_COUNTRIES,
    },

    // Wizard State
    wizard: {
        currentStep: 1,
        totalSteps: 5,
        completedSteps: [],
    },
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        // Profile Photo Actions
        setProfilePhoto: (state, action) => {
            state.profilePhoto.photo = action.payload.photo;
            state.profilePhoto.fileName = action.payload.fileName;
            state.profilePhoto.isUploaded = true;
        },
        removeProfilePhoto: (state) => {
            state.profilePhoto.photo = null;
            state.profilePhoto.fileName = null;
            state.profilePhoto.isUploaded = false;
        },
        updateValidationChecks: (state, action) => {
            state.profilePhoto.validationChecks = action.payload;
        },

        // Nationalities Actions
        setSearchTerm: (state, action) => {
            const { id, searchTerm } = action.payload;
            const dropdown = state.nationalities.dropdowns.find((d) => d.id === id);
            if (dropdown) {
                dropdown.searchTerm = searchTerm;
            }
        },
        selectNationality: (state, action) => {
            const { id, nationality } = action.payload;
            const dropdown = state.nationalities.dropdowns.find((d) => d.id === id);
            if (dropdown) {
                dropdown.selectedNationality = nationality;
                dropdown.searchTerm = "";
            }
        },
        addNationalityDropdown: (state) => {
            const newId =
                Math.max(...state.nationalities.dropdowns.map((d) => d.id), 0) + 1;
            state.nationalities.dropdowns.push({
                id: newId,
                searchTerm: "",
                selectedNationality: null,
            });
        },
        removeNationalityDropdown: (state, action) => {
            const id = action.payload;
            state.nationalities.dropdowns = state.nationalities.dropdowns.filter(
                (d) => d.id !== id
            );
            // Also remove from selectedNationalities if it exists
            const dropdown = state.nationalities.dropdowns.find((d) => d.id === id);
            if (dropdown && dropdown.selectedNationality) {
                state.nationalities.selectedNationalities =
                    state.nationalities.selectedNationalities.filter(
                        (n) => n.code !== dropdown.selectedNationality.code
                    );
            }
        },
        saveNationality: (state) => {
            // Collect all selected nationalities from dropdowns
            state.nationalities.selectedNationalities = state.nationalities.dropdowns
                .filter((d) => d.selectedNationality !== null)
                .map((d) => d.selectedNationality);
            state.nationalities.isSaved = true;
        },
        editNationality: (state) => {
            state.nationalities.isSaved = false;
            // Keep the dropdowns but allow editing
        },

        // Residencies Actions
        setPrimaryResidence: (state, action) => {
            state.residencies.primaryResidence = action.payload;
        },
        addOtherAddress: (state) => {
            const newId =
                Math.max(
                    ...state.residencies.otherAddresses.map((addr) => addr.id),
                    0
                ) + 1;
            state.residencies.otherAddresses.push({ id: newId, value: "" });
        },
        updateOtherAddress: (state, action) => {
            const { id, value } = action.payload;
            const address = state.residencies.otherAddresses.find(
                (addr) => addr.id === id
            );
            if (address) {
                address.value = value;
            }
        },
        removeOtherAddress: (state, action) => {
            state.residencies.otherAddresses =
                state.residencies.otherAddresses.filter(
                    (addr) => addr.id !== action.payload
                );
        },
        saveResidencies: (state) => {
            state.residencies.isSaved = true;
        },
        editResidencies: (state) => {
            state.residencies.isSaved = false;
        },

        // Upload File Actions
        setCurrentFile: (state, action) => {
            state.uploadedFiles.currentFile = {
                ...state.uploadedFiles.currentFile,
                ...action.payload,
            };
        },
        addUploadedFile: (state, action) => {
            const newFile = {
                id: Date.now(),
                ...state.uploadedFiles.currentFile,
                ...action.payload,
                uploadedAt: new Date().toISOString(),
            };
            state.uploadedFiles.files.push(newFile);
            // Reset current file
            state.uploadedFiles.currentFile = {
                file: null,
                fileType: null,
                countryCode: "",
                dateRange: { start: null, end: null },
                isProcessed: false,
            };
        },
        removeUploadedFile: (state, action) => {
            state.uploadedFiles.files = state.uploadedFiles.files.filter(
                (file) => file.id !== action.payload
            );
        },
        clearCurrentFile: (state) => {
            state.uploadedFiles.currentFile = {
                file: null,
                fileType: null,
                countryCode: "",
                dateRange: { start: null, end: null },
                isProcessed: false,
            };
        },

        // Wizard Actions
        setCurrentStep: (state, action) => {
            state.wizard.currentStep = action.payload;
        },
        completeStep: (state, action) => {
            if (!state.wizard.completedSteps.includes(action.payload)) {
                state.wizard.completedSteps.push(action.payload);
            }
        },
        resetWizard: (state) => {
            state.wizard.currentStep = 1;
            state.wizard.completedSteps = [];
        },

        // Reset all profile data
        resetProfile: () => initialState,
    },
});

export const {
    setProfilePhoto,
    removeProfilePhoto,
    updateValidationChecks,
    setSearchTerm,
    selectNationality,
    addNationalityDropdown,
    removeNationalityDropdown,
    saveNationality,
    editNationality,
    setPrimaryResidence,
    addOtherAddress,
    updateOtherAddress,
    removeOtherAddress,
    saveResidencies,
    editResidencies,
    setCurrentFile,
    addUploadedFile,
    removeUploadedFile,
    clearCurrentFile,
    setCurrentStep,
    completeStep,
    resetWizard,
    resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
