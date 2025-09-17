import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setEmail } from '@/store/slices/signupSlice'

export const EmailFunction = () => {
  const dispatch = useAppDispatch()
  const { email } = useAppSelector(state => state.signup.email)

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value))
  }

  return { email, handleEmailChange };
} 