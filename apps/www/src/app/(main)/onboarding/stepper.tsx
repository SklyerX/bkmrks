"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WordFadeIn from "@/components/ui/word-fade-in";
import { motion } from "framer-motion";
import { useValidateStep } from "@/states/validate-step";
import StepOne from "./step-one";
import { redirect } from "next/navigation";
import StepTwo from "./step-two";

// TODO: setup store for stepper so 'next' button can be disabled
// TODO: make into -> https://claude.ai/chat/1dfd12a5-232b-4898-8f32-3d22a5630da2  -> but also learn

export default function Stepper() {
  const [step, setStep] = React.useState(0);
  const { isValid, setIsValid, skip, setSkip } = useValidateStep();

  useEffect(() => {
    setIsValid(false);
  }, [step]);

  useEffect(() => {
    if (skip) {
      if (step === steps.length - 1) return redirect("/dash");
      setStep((prevStep) => prevStep + 1);

      setSkip(false);
    }
  }, [step, skip, setSkip]);

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleNextStep = () => {
    if (step === steps.length - 1) {
      // handle finish
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="p-10 flex">
      <div className="w-full lg:w-2/4">
        <WordFadeIn
          words={steps[step].title}
          className="!font-semibold !text-3xl w-fit"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mt-1.5 text-lg text-muted-foreground w-3/4"
        >
          {steps[step].description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex gap-2 mt-6"
        >
          {steps.map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-200",
                {
                  "bg-gray-900": index <= step,
                  "bg-gray-200": index > step,
                }
              )}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="my-10"
        >
          {steps[step].component}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.3 }}
          className="flex w-full items-center justify-between"
        >
          <Button
            onClick={handlePreviousStep}
            disabled={step === 0}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="size-8" />
            Go back
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!isValid}
            className="font-medium"
          >
            {step === steps.length - 1 ? "Finish" : "Next"}
            {step === steps.length - 1 ? (
              ""
            ) : (
              <ChevronRight className="size-8" />
            )}
          </Button>
        </motion.div>
      </div>
      <div className="w-2/4 hidden lg:block">world</div>
    </div>
  );
}

interface Step {
  title: string;
  description: string;
  component: React.ReactNode;
}

// TODO: make own component for each step

const steps: Step[] = [
  {
    title: "Import Bookmarks",
    description:
      "Before we get started would you like to import your existing bookmarks?",
    component: <StepOne />,
  },
  {
    title: "Create a folder",
    description:
      "Lets create your first folder to organize your bookmarks. Just so you you get the gist of it.",
    component: <StepTwo />,
  },
];
