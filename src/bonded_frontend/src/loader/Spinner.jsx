import React from "react";
import styles from "./scss/_spinner.module.scss";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={styles.bar} style={{ transform: `rotate(${i * 30}deg)` }} />
      ))}
    </div>
  );
};

export default Spinner;
