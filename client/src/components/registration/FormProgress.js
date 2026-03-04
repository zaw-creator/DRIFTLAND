import styles from "./FormProgress.module.css";

export default function FormProgress({ currentStep, totalSteps }) {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Vehicle Info" },
    { number: 3, title: "Event Selection" },
    { number: 4, title: "Safety & Terms" },
  ];

  return (
    <div className={styles.progress}>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepWrapper}>
            <div
              className={`${styles.step} ${currentStep >= step.number ? styles.active : ""} ${currentStep > step.number ? styles.completed : ""}`}
            >
              <div className={styles.stepNumber}>
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <div className={styles.stepTitle}>{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.connector} ${currentStep > step.number ? styles.connectorActive : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
