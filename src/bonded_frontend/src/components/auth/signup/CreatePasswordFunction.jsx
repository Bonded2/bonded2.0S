import { useState, useMemo } from 'react';

export const CreatePasswordFunction = () => {
    const [password, setPassword] = useState('');

    // ANCHOR: Password validation functions
    const validatePassword = (password) => {
        return {
            minLength: password.length >= 8,
            hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            hasNumber: /\d/.test(password),
            hasUppercase: /[A-Z]/.test(password)
        };
    };

    // ANCHOR: Dynamic validation rules with real-time status
    const validationRules = useMemo(() => {
        const validation = validatePassword(password);
        return [
            {
                text: 'Minimum eight characters',
                isMet: validation.minLength
            },
            {
                text: 'At least one symbol',
                isMet: validation.hasSymbol
            },
            {
                text: 'At least one number',
                isMet: validation.hasNumber
            },
            {
                text: 'At least one uppercase letter',
                isMet: validation.hasUppercase
            }
        ];
    }, [password]);

    // ANCHOR: Check if all validation rules are met
    const isPasswordValid = useMemo(() => {
        const validation = validatePassword(password);
        return validation.minLength && validation.hasSymbol && validation.hasNumber && validation.hasUppercase;
    }, [password]);
    
    return {
        password,
        setPassword,
        validationRules,
        isPasswordValid
    }
}