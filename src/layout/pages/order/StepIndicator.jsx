import React from 'react';
import { Check } from 'lucide-react';

/**
 * Horizontal step rail for the checkout flow.
 *
 * @param {Object[]} steps - [{ key, label }]
 * @param {number} currentStep - 1-indexed position of the active step
 */
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <nav className="sabr-steps" aria-label="Checkout progress">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div className="sabr-step" key={step.key}>
            <div
              className={`sabr-step__line ${isDone ? 'sabr-step__line--done' : ''}`}
              aria-hidden="true"
            />
            <div
              className={`sabr-step__dot ${isActive ? 'sabr-step__dot--active' : ''} ${
                isDone ? 'sabr-step__dot--done' : ''
              }`}
            >
              {isDone ? <Check size={15} strokeWidth={2.5} /> : stepNumber}
            </div>
            <span
              className={`sabr-step__label ${isActive ? 'sabr-step__label--active' : ''} ${
                isDone ? 'sabr-step__label--done' : ''
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};

export default StepIndicator;
