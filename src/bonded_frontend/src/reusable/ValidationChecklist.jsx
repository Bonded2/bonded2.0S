import { CircleCheckBig } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './scss/_validationchecklist.module.scss';

const ValidationChecklist = ({ validationRules = [] }) => {
    return (
        <div className={styles.validationChecklist}>
            {validationRules.map((rule, index) => {
                const isMet = rule.isMet || false;
                return (
                    <div
                        key={index}
                        className={`${styles.validationItem} ${isMet ? styles.validationItemSuccess : styles.validationItemDefault}`}
                    >
                        <CircleCheckBig className={`${styles.checkIcon} ${isMet ? styles.checkIconSuccess : styles.checkIconDefault}`} />
                        <span className={styles.validationText}>{rule.text || rule}</span>
                    </div>
                );
            })}
        </div>
    );
};

// ANCHOR: PropTypes for type checking
ValidationChecklist.propTypes = {
    validationRules: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                isMet: PropTypes.bool
            })
        ])
    ).isRequired
};

export default ValidationChecklist;