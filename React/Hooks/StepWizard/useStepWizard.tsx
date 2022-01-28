import { useEffect, useRef, useState } from "react";

import "./useStepWizard.css";

export default function useStepWizardNext(steps: Array<JSX.Element>, submitStep: JSX.Element, numberStepsShown: number) {
	let stepIndexes = useRef<Array<number>>([]);

	let combinedSteps = useRef<Array<JSX.Element>>([...steps, submitStep]);

	const [activeStepIndex, setActiveStep] = useState<number>(0);

	const [renderedStepIndicators, setRenderedStepIndicators] = useState<Array<JSX.Element>>();

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

	function renderStepIndicators(currentIndex: number) {
		//submit step must be last in the array.
		let submitIndex = stepIndexes.current.length - 1;
		//contain the numbers to render into indicators.
		let indexesToRender: Array<number> = [];

		//first step number
		if (currentIndex === 0) {
			let firstIndex = currentIndex;
			//get the next steps
			let lastIndex = firstIndex + numberStepsShown;
			//extract the relevant indexes
			indexesToRender = stepIndexes.current.slice(firstIndex, lastIndex);
		}
		//middle step number
		else if (currentIndex > 0 && currentIndex < submitIndex - 1) {
			//display an even number of steps either side of the current step.
			//even steps either side is numberStepsShown minus the current step, then halved.
			//if number steps shown is even, this results in a decimal.
			//eg
			//3 - 1 / 2 = 1
			//4 - 1 / 2 = 1.5
			//5 - 1 / 2 = 2
			let stepsEitherSide = (numberStepsShown - 1) / 2;
			let firstIndex = currentIndex - stepsEitherSide;
			let lastIndex = currentIndex + stepsEitherSide;
			//slice is exlcusive, include the last index
			lastIndex++;
			//extract the relevant indexes
			indexesToRender = stepIndexes.current.slice(firstIndex, lastIndex);
		}
		//last step number
		else if (currentIndex === submitIndex - 1) {
			//remove the current step from the calculation
			let previousSteps = numberStepsShown - 1;
			//get the previous steps
			let firstIndex = currentIndex - previousSteps;
			//end at the last step
			let lastIndex = currentIndex;
			//slice is exclusive, include the last index
			lastIndex++;
			//extract the relevant indexes
			indexesToRender = stepIndexes.current.slice(firstIndex, lastIndex);
		}
		//at submit step
		else {
			let firstIndex = currentIndex - numberStepsShown;
			let lastIndex = currentIndex;
			//extract the relevant indexes
			//allow slice to exclude the submit step;
			indexesToRender = stepIndexes.current.slice(firstIndex, lastIndex);
		}

		function renderIndicator(stepNumber: number) {
			return (
				<div key={stepNumber} className={`step ${currentIndex === stepNumber ? "active" : ""}`}>
					{stepNumber + 1}
				</div>
			);
		}

		//style submit indicator differently.
		let submitIndicator = (
			<div key="submit" className={`step submit ${currentIndex === submitIndex ? "active" : ""}`}>
				Submit
			</div>
		);

		return [...indexesToRender.map((number) => renderIndicator(number)), submitIndicator];
	}

	//when the active step changes
	useEffect(() => setRenderedStepIndicators(renderStepIndicators(activeStepIndex)), [activeStepIndex]);

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
			<div className="stepIndicatorBar">{renderedStepIndicators}</div>
			<div className="navigationBar">
				<button onClick={() => goToPreviousPage()} disabled={activeStepIndex === 0}>
					Previous
				</button>
				<button onClick={() => goToNextPage()} disabled={activeStepIndex === stepIndexes.current.length - 1}>
					Next
				</button>
			</div>
			<div className="stepContent">{combinedSteps.current[activeStepIndex]}</div>
		</div>
	);
}
