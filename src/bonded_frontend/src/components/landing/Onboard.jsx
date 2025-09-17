
import styles from './scss/_onboard.module.scss'
import { OnboardFunction } from './OnboardFunction'
import { ArrowRight, Settings, Stamp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboard = () => {
  const { steps, index, setIndex } = OnboardFunction();
  const navigate = useNavigate();


  return (
    <div
      className={styles.onboardWrapper}
      style={{ backgroundColor: steps[index].backgroundColor }}
    >
      <div className={styles.onboardContainer}>
      <div className={styles.iconContainer}>
        <img src={steps[index].image} alt={steps[index].title} />
      </div>

      <div className={styles.stepTextContainer}>
        <p className={styles.stepTitle}>{steps[index].title}</p>
        
        <p className={styles.stepText}>{steps[index].text}</p>
      </div>

      <button
        onClick={() => {
          if (index >= steps.length - 1) {
            navigate('/login');
            return;
          }
          setIndex((i) => i + 1);
        }}
        className={styles.nextButton}
      >
        Next
        <ArrowRight />
      </button>

      <div className={styles.stepDots}>
        {steps.map((_, i) => (
          <span
            key={i}
            className={`${styles.stepDot} ${i === index ? styles.active : ''}`}
          />
        ))}
      </div>
      </div>
    </div>
  );
}

export default Onboard