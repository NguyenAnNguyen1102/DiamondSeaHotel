import React from 'react';

const ProgressStepper = ({currentStep}) => {
  const steps = [
    'Thông tin khách hàng',
    'Chi tiết thanh toán',
    
  ];

  return (
    <div className="d-flex justify-content-center align-items-center my-4">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={index}>
            {/* Circle & label */}
            <div className="d-flex flex-column align-items-center">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border ${
                  isActive ? 'bg-primary text-white' : isCompleted ? 'bg-success text-white' : 'bg-light text-muted'
                }`}
                style={{ width: 35, height: 35 }}
              >
                {isCompleted && !isActive ? '✔' : index + 1}
              </div>
              <div style={{color:''}} className={`mt-2 text-center ${isActive ? 'text-primary fw-semibold' :isCompleted?'text-white':'text-secondary'}` } >
                {label}
              </div>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`flex-grow-1 mx-2`}
                style={{
                  height: 4,
                  backgroundColor: index < currentStep ? '#0d6efd' : '#dee2e6',
                }}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
