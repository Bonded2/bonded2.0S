import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updatePersonalInfo, setAcceptedTerms } from '@/store/slices/signupSlice'

export const SignUpFunction = () => {
    const dispatch = useAppDispatch()
    const { personalInfo } = useAppSelector(state => state.signup)

    const handleInputChange = (field, value) => {
        dispatch(updatePersonalInfo({ field, value }))
    }

    const handleAccept = (event) => {
        dispatch(setAcceptedTerms(event.target.checked))
    }

    const isFormValid = () => {
        const { firstname, lastname, username, accepted } = personalInfo
        return firstname.trim() !== '' && lastname.trim() !== '' && username.trim() !== '' && accepted
    }

    return {
        formData: personalInfo,
        accepted: personalInfo.accepted,
        handleInputChange,
        handleAccept,
        isFormValid,
    }
}
