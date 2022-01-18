import { useEffect, useRef, useState } from "react";

import "./useStepWizard.css";

export default function useStepWizard(steps: Array<JSX.Element>, submitStep: JSX.Element) {
	let stepIndexes = useRef<Array<number>>([]);

	let combinedSteps = useRef<Array<JSX.Element>>([...steps, submitStep]);

	const [activeStepIndex, setActiveStep] = useState<number>(0);

	const [renderedStepIndicator, setRenderedStepIndicator] = useState<JSX.Element>();

	useEffect(() => {
		//exceptional state; cannot continue without steps to render
		if (steps.length === 0) throw new Error("You must provide at least one step.");
		combinedSteps.current = [...steps, submitStep];
	}, [steps, submitStep]);

	//update when steps changes.
	useEffect(() => {
		//map the index of each step into the stepIndexes reference.
		stepIndexes.current = combinedSteps.current.map((_step, index) => index);
	}, [combinedSteps]);

	//when the active step changes
	useEffect(() => {
		function renderStepIndicator() {
			let submitStep = stepIndexes.current.length;
			let currentStep = activeStepIndex + 1;
			let content: string;
			if (currentStep < submitStep) {
				content = `${currentStep} / ${submitStep}`;
			} else {
				content = "Submit";
			}
			return (
				<div className="stepIndicator">
					<p>{content}</p>
				</div>
			);
		}

		setRenderedStepIndicator(renderStepIndicator());
	}, [activeStepIndex]);

	function goToPreviousPage() {
		//if on the first page, cannot move further backward
		if (activeStepIndex === 0) return;

		//get the previous index, update current index
		let previousPageIndex = stepIndexes.current[activeStepIndex - 1];
		setActiveStep(previousPageIndex);
	}

	function goToNextPage() {
		//if on the last page, cannot move further forward
		if (activeStepIndex === stepIndexes.current.length - 1) return;

		//get the next index, update current index
		let nextPageIndex = stepIndexes.current[activeStepIndex + 1];
		setActiveStep(nextPageIndex);
	}

	return (
		<div className="stepWizard">
			<div className="navigationBar">
				<button onClick={() => goToPreviousPage()} disabled={activeStepIndex === 0}>
					Previous
				</button>
				{renderedStepIndicator}
				<button onClick={() => goToNextPage()} disabled={activeStepIndex === stepIndexes.current.length - 1}>
					Next
				</button>
			</div>
			<div className="stepContent">{combinedSteps.current[activeStepIndex]}</div>
		</div>
	);
}
