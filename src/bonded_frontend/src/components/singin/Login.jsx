import styles from './scss/_login.module.scss'
import nfid from '@/assets/login/nfid.webp'
import nns from '@/assets/login/nns.webp'
import ii from '@/assets/login/ii.png'
import logo3 from '@/assets/logo/logo3-dark.png'
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '@/reusable/Input';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';
import LoginFunctions from './LoginFunctions';

const Login = () => {

    const navigate = useNavigate();

    const {
        loading,
        setLoading,
        userIdentity,
        setUserIdentity,
        authenticatedActor,
        principalId,
        userData,
        handleLoginII,
        isSigningInII,
        setSignInIIError,
        handleLoginNNS,
        handleLoginNFID,
        isSigningInNNS,
        isSigningInNFID,
        signInError
    } = LoginFunctions()

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <img src={logo3} alt="logo" className={styles.logo} />

                <Input
                    label="Username"
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                />

                <Input
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    showPasswordIcon={true}
                />

                <div className={styles.forgotPassword}>
                    <a href="#" className={styles.forgotPasswordLink}>
                        Forgot password?
                        <span className={styles.arrow}> <ArrowRight /> </span>
                    </a>
                </div>
                <Link to="/dashboard">
                    <Button
                        variant="primary"
                        className={styles.traditionalLoginButton}
                    >
                        Login
                    </Button>
                </Link>

                <Link to="/wizard">
                    <div className={styles.signupLink}>
                        <span className={styles.signupText}>
                            Sign up
                        </span>
                    </div>
                </Link>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>or</span>
                </div>

                <div className={styles.authButtons}>
                    <Button
                        variant="primary"
                        className={styles.authButton}
                        onClick={handleLoginII}
                    >
                        {isSigningInII ? (<>Authenticating</>) : (
                            <> Sign in with Internet Identity </>)}
                    </Button>
                    <Button
                        variant="primary"
                        className={styles.authButton}
                        onClick={handleLoginNFID}
                    >
                        {isSigningInNFID ? (<>Authenticating</>) : (
                                <> Sign in with NFID </>)}
                    </Button>
                    <Button
                        variant="primary"
                        className={styles.authButton}
                        onClick={handleLoginNNS}
                    >
                        {isSigningInNNS ? (<>Authenticating</>) : (
                            <> Sign in with NNS Identity </>)}
                    </Button>
                </div>
                {signInError}
            </div>
        </div>
    )
}

export default Login