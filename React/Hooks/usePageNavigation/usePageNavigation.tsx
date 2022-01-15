/*
	TODO: show ~5 page indicators at a time and scroll with user progression.
	TODO: style component appropriately.
*/

/*
	Usage: provide an array of 'pages' that return JSX.Elements.
	
	This component allows navigation between the pages using buttons.
	
	The previous/next buttons prevent navigating 'too far' outside the array range.
*/

import { useEffect, useRef, useState } from "react";

import "./PageNavigation.css";

function Loading() {
	return <div>Loading...</div>
}

export default function usePageNavigation(pages: Array<JSX.Element>) {
	const [currentPage, setCurrentPage] = useState<JSX.Element>(pages[0]);

	//derived from pages.length; to be populated on initialisation
	let pageIndexes = useRef<Array<number>>([]);

	const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

	//derived from page indexes; to be populated on initialisation
	let [renderedPageNumbers, setRenderedPageNumbers] = useState<Array<JSX.Element>>();

	const [initialised, setInitialised] = useState<boolean>(false);

	//Initialise pages when the number of pages change.
	useEffect(() => {
		//exceptional state; cannot continue with an empty page array
		if (pages.length === 0) throw new Error("pages array must not be empty.");

		let derivedPageIndexes: Array<number> = [];

		//from 0 (first index) to one less than pages.length (last index)
		//pages.map would cause a render loop without bloated code
		for (let index = 0; index < pages.length; index++) {
			//add the index to the temporary array
			derivedPageIndexes = [...derivedPageIndexes, index];
		}

		//assign the derived page indexes to the reference array
		pageIndexes.current = derivedPageIndexes;

		//store rendered page numbers
		setRenderedPageNumbers(
			//for each page index
			pageIndexes.current.map((index) => (
				//return a page indicator
				<div key={index} className="pageNumber">
					{index + 1}
				</div>
			))
		);

		//now initialised, show the page.
		setInitialised(true);
	}, [pages.length]);

	function goToPreviousPage() {
		//if on the first page
		if (currentPageIndex === 0) {
			//no more Pages to navgiate backward to, exit.
			return;
		}

		//get the previous index, update current index and page
		let previousPageIndex = pageIndexes.current[currentPageIndex - 1];
		setCurrentPageIndex(previousPageIndex);
		setCurrentPage(pages[previousPageIndex]);
	}

	function goToNextPage() {
		//if on the last page
		if (currentPageIndex + 1 === pages.length) {
			//no more Pages to navgiate forward to, exit.
			return;
		}

		//get the next index, update current index and page
		let nextPageIndex = pageIndexes.current[currentPageIndex + 1];
		setCurrentPageIndex(nextPageIndex);
		setCurrentPage(pages[nextPageIndex]);
	}

	if (!initialised) return Loading();
	else {
		return (
			<div className="pageNavigation">
				{<div className="pageIndicatorBar">{renderedPageNumbers}</div>}
				{currentPage}
				<div className="pageNavigationBar">
					<button onClick={() => goToPreviousPage()}>Previous</button>
					<button onClick={() => goToNextPage()}>Next</button>
				</div>
			</div>
		);
	}
}
