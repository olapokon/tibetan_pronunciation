import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import App from './App';
// import ReactTestUtils from 'react-dom/test-utils';
import { act } from 'react-dom/test-utils';

let container;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);

	act(() => {
		ReactDOM.render(<App />, container);
	});
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

it('renders without crashing', () => {});

// root: 'kha', superscript: 'sa', subscript: 'ra', suffix 1: 'la': expected: 'drä̀l'
it('returns the correct result: with root sound change and diairesis', () => {
	// trigger root change event - 'kha'
	const rootSelect = container.querySelector('#root');
	rootSelect.value = 'ག';
	let event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);
	rootSelect.dispatchEvent(event);

	// trigger superscript change event - 'sa'
	const superscriptSelect = container.querySelector('#superscript');
	superscriptSelect.value = 'ས';
	event.initEvent('change', true, false);
	superscriptSelect.dispatchEvent(event);

	// trigger subscript change event - 'ra'
	const subscriptSelect = container.querySelector('#subscript');
	subscriptSelect.value = 'ར';
	event.initEvent('change', true, false);
	subscriptSelect.dispatchEvent(event);

	// trigger suffix 1 change event - 'la'
	const suffix1Select = container.querySelector('#suffix1');
	suffix1Select.value = 'ལ';
	event.initEvent('change', true, false);
	suffix1Select.dispatchEvent(event);

	const transliterationDisplay = container.querySelector('.display--transliteration');
	expect(transliterationDisplay.textContent).toEqual('drä̀l');
});
