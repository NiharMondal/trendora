"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepItem = {
	id: string;
	title: string;
	description?: string;
};

type StepperProps = {
	steps: StepItem[];
	currentStep?: number; // controlled
	defaultStep?: number; // uncontrolled
	onStepChange?: (step: number) => void;
	clickable?: boolean;
	className?: string;
};

export function Stepper({
	steps,
	currentStep,
	defaultStep = 0,
	onStepChange,
	clickable = false,
	className,
}: StepperProps) {
	const [internalStep, setInternalStep] = React.useState(defaultStep);

	const activeStep = currentStep ?? internalStep;

	const handleStepClick = (index: number) => {
		if (!clickable) return;

		if (currentStep === undefined) {
			setInternalStep(index);
		}

		onStepChange?.(index);
	};

	return (
		<div className={cn("w-full", className)}>
			<div className="flex items-center justify-between relative">
				{steps.map((step, index) => {
					const isActive = index === activeStep;
					const isCompleted = index < activeStep;

					return (
						<div
							key={step.id}
							className="flex-1 flex flex-col items-center relative"
						>
							{/* Connector Line */}
							{index !== steps.length - 1 && (
								<div
									className={cn(
										"absolute top-5 left-1/2 w-full h-[2px]",
										isCompleted ? "bg-primary" : "bg-muted",
									)}
								/>
							)}

							{/* Circle */}
							<button
								type="button"
								onClick={() => handleStepClick(index)}
								className={cn(
									"z-10 flex items-center justify-center w-10 h-10 rounded-full border text-sm font-medium transition",
									isCompleted &&
										"bg-primary text-primary-foreground border-primary",
									isActive &&
										"border-primary bg-background text-primary",
									!isActive &&
										!isCompleted &&
										"bg-muted border-muted-foreground/30 text-muted-foreground",
									clickable && "cursor-pointer",
								)}
							>
								{isCompleted ? (
									<Check className="w-4 h-4" />
								) : (
									index + 1
								)}
							</button>

							{/* Title */}
							<div className="mt-3 text-center">
								<p
									className={cn(
										"text-sm font-medium",
										isActive && "text-primary",
										!isActive && "text-muted-foreground",
									)}
								>
									{step.title}
								</p>
								{step.description && (
									<p className="text-xs text-muted-foreground">
										{step.description}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
