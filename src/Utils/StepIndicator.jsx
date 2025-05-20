

const StepIndicator = ({ currentStep }) => {
  const steps = ["First Step", "Second Step", "Confirmation"];

  return (
    <div className="flex items-center justify-start mb-6">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle and Label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold 
                  ${isActive ? "bg-blue-600 text-white" : "bg-gray-400 text-white"}`}
              >
                {stepNum}
              </div>
              <div
                className={`mt-2 text-sm ${
                  isActive ? "text-black font-medium" : "text-gray-500"
                }`}
              >
                {label}
              </div>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
                
              <div className="w-[15rem] h-0.5 bg-gray-300  mb-[30px]"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};




export default StepIndicator