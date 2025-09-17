import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Personal Information
    personalInfo: {
        firstname: '',
        middlename: '',
        lastname: '',
        username: '',
        accepted: false
    },

    // Email Information
    email: {
        email: '',
        isVerified: false,
        verificationCode: ''
    },

    // Password Information
    password: {
        password: '',
        validationRules: [
            {
                text: 'Minimum eight characters',
                isMet: false
            },
            {
                text: 'At least one symbol',
                isMet: false
            },
            {
                text: 'At least one number',
                isMet: false
            },
            {
                text: 'At least one uppercase letter',
                isMet: false
            }
        ],
        isPasswordValid: false
    },

    // Signup Progress
    progress: {
        currentStep: 1,
        completedSteps: [],
        totalSteps: 3
    }
};

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        // Personal Information Actions
        updatePersonalInfo: (state, action) => {
            const { field, value } = action.payload;
            state.personalInfo[field] = value;
        },
        setAcceptedTerms: (state, action) => {
            state.personalInfo.accepted = action.payload;
        },
        updateAllPersonalInfo: (state, action) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
        },

        // Email Actions
        setEmail: (state, action) => {
            state.email.email = action.payload;
        },
        setEmailVerification: (state, action) => {
            state.email.isVerified = action.payload;
        },
        setVerificationCode: (state, action) => {
            state.email.verificationCode = action.payload;
        },

        // Password Actions
        setPassword: (state, action) => {
            state.password.password = action.payload;

            // Update validation rules based on password
            const password = action.payload;
            state.password.validationRules = [
                {
                    text: 'Minimum eight characters',
                    isMet: password.length >= 8
                },
                {
                    text: 'At least one symbol',
                    isMet: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                },
                {
                    text: 'At least one number',
                    isMet: /\d/.test(password)
                },
                {
                    text: 'At least one uppercase letter',
                    isMet: /[A-Z]/.test(password)
                }
            ];

            // Update password validity
            state.password.isPasswordValid = state.password.validationRules.every(rule => rule.isMet);
        },

        // Progress Actions
        setCurrentStep: (state, action) => {
            state.progress.currentStep = action.payload;
        },
        completeStep: (state, action) => {
            if (!state.progress.completedSteps.includes(action.payload)) {
                state.progress.completedSteps.push(action.payload);
            }
        },
        nextStep: (state) => {
            if (state.progress.currentStep < state.progress.totalSteps) {
                state.progress.currentStep += 1;
            }
        },
        previousStep: (state) => {
            if (state.progress.currentStep > 1) {
                state.progress.currentStep -= 1;
            }
        },

        // Validation Actions
        validatePersonalInfo: (state) => {
            const { firstname, lastname, username, accepted } = state.personalInfo;
            return firstname.trim() !== '' && lastname.trim() !== '' && username.trim() !== '' && accepted;
        },
        validateEmail: (state) => {
            return state.email.email.trim() !== '';
        },
        validatePassword: (state) => {
            return state.password.isPasswordValid;
        },

        // Reset Actions
        resetSignupData: () => initialState,
        resetPersonalInfo: (state) => {
            state.personalInfo = initialState.personalInfo;
        },
        resetEmail: (state) => {
            state.email = initialState.email;
        },
        resetPassword: (state) => {
            state.password = initialState.password;
        }
    }
});

export const {
    updatePersonalInfo,
    setAcceptedTerms,
    updateAllPersonalInfo,
    setEmail,
    setEmailVerification,
    setVerificationCode,
    setPassword,
    setCurrentStep,
    completeStep,
    nextStep,
    previousStep,
    validatePersonalInfo,
    validateEmail,
    validatePassword,
    resetSignupData,
    resetPersonalInfo,
    resetEmail,
    resetPassword
} = signupSlice.actions;

export default signupSlice.reducer;
