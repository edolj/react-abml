import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ["Select domain", "Select critical example", "Argument example"];

const StepViews = () => {
  const activeStep = 1;

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepViews;
