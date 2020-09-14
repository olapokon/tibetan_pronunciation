import React, { Component } from 'react';
import {
	superscripts,
	prefixes,
	roots,
	modifiedThirdColumn,
	suffixes,
	secondSuffixes,
	subscriptsTable,
	subscriptsDisplayTable,
	superscribedRootsTable,
} from './tibetanUnicodeData';

type AppProps = null;

type AppState = {
	root: string;
	superscript: string;
	prefix: string;
	suffix: string;
	secondSuffix: string;
	subscript: string;
	availableSubscripts: string[];
};

// manual of standard tibetan p 44
class App extends Component<AppProps, AppState> {
	state: AppState = {
		root: '',
		superscript: '',
		prefix: '',
		suffix: '',
		secondSuffix: '',
		subscript: '',
		availableSubscripts: [],
	};

	handleChange = (event: any): void => {
		const { name, value } = event.target;
		switch (name) {
			case 'root':
				this.setState({
					...this.state,
					[name]: value,
				});
				this.handleRootChange(value);
				break;
			case 'suffix':
				this.setState({
					...this.state,
					secondSuffix: '',
					[name]: value,
				});
				break;
			case 'superscript':
				// the la subscript cannot be displayed if there is a superscript
				// remove la from the subscripts menu if a superscript is selected and clear current subscript
				if (value) {
					const prunedSubscripts = [...this.state.availableSubscripts];
					if (prunedSubscripts.includes('\u0F63')) {
						prunedSubscripts.splice(prunedSubscripts.indexOf('\u0F63'), 1);
					}
					this.setState({
						...this.state,
						[name]: value,
						availableSubscripts: prunedSubscripts,
						subscript: '',
					});
					break;
				}
				// if the superscript is deselected, load all subscripts for the current root
				if (subscriptsTable[this.state.root]) {
					this.setState({
						...this.state,
						availableSubscripts: [...subscriptsTable[this.state.root]],
						[name]: value,
					});
				} else {
					this.setState({
						...this.state,
						[name]: value,
					});
				}
				break;
			default:
				this.setState({
					...this.state,
					[name]: value,
				});
				break;
		}
	}

	handleRootChange = (value: string): void =>  {
		// prefixes, superscripts, and suffixes are available for all roots,
		// specific subscripts are available to specific roots

		// reset the affixes in state
		this.setState({
			superscript: '',
			prefix: '',
			suffix: '',
			secondSuffix: '',
			subscript: '',
			availableSubscripts: [],
		});

		if (subscriptsTable[value]) {
			this.setState({
				availableSubscripts: [...subscriptsTable[value]],
			});
		}
	}

	createRootDisplay = (): string =>  {
		let rootDisplay = '';
		if (this.state.superscript) {
			rootDisplay = this.state.superscript + superscribedRootsTable[this.state.root];
		} else {
			rootDisplay = this.state.root;
		}
		if (this.state.subscript) {
			rootDisplay += subscriptsDisplayTable[this.state.subscript];
		}
		return this.state.root
			? `${this.state.prefix}${rootDisplay}${this.state.suffix}${this.state.secondSuffix}`
			: '\u0F00';
	}

	createTranscriptionDisplay = (): string =>  {
		const rootsArray = Object.keys(roots);
		let currentRoot = roots[this.state.root] ? roots[this.state.root] : '';
		let tone = '';
		let diairesis = false;
		let suffix = '';

		// determine if the root belongs to the third or fourth column
		let rootColumn = '';
		if (rootsArray.indexOf(this.state.root) > 15 && rootsArray.indexOf(this.state.root) < 21) {
			rootColumn = 'third';
		} else if (
			rootsArray.indexOf(this.state.root) > 24 &&
			rootsArray.indexOf(this.state.root) < 29
		) {
			rootColumn = 'fourth';
		}

		// determine if there is change in the root, based on a prefix, superscript, or subscript
		// the root change of the subscript overrides the root change for a third column root with prefix
		if (this.state.prefix || this.state.superscript) {
			if (rootColumn === 'third') {
				currentRoot = modifiedThirdColumn[this.state.root];
			} else if (rootColumn === 'fourth') {
				tone = 'high';
			}
		}

		if (this.state.subscript) {
			switch (this.state.subscript) {
				// ra subscript
				case '\u0F62':
					switch (this.state.root) {
						case '\u0F40':
						case '\u0F4F':
						case '\u0F54':
							currentRoot = 'tra';
							tone = 'high';
							break;
						case '\u0F41':
						case '\u0F50':
						case '\u0F55':
							currentRoot = 'thra';
							tone = 'high';
							break;
						case '\u0F42':
						case '\u0F51':
						case '\u0F56':
							if (this.state.superscript === '\u0F66') {
								currentRoot = 'dra';
							} else {
								currentRoot = 'thra';
							}
							tone = 'low';
							break;
						case '\u0F67':
							currentRoot = 'hra';
							break;
						default:
							break;
					}
					break;

				// la subscript
				case '\u0F63':
					if (this.state.root === '\u0F5F') {
						currentRoot = 'da';
						tone = 'low';
					} else {
						currentRoot = 'la';
						tone = 'high';
					}
					break;

				// ya subscript
				case '\u0F61':
					switch (this.state.root) {
						case '\u0F58':
							currentRoot = 'nya';
							tone = 'low';
							break;
						case '\u0F54':
							currentRoot = 'ca';
							tone = 'high';
							break;
						case '\u0F55':
							currentRoot = 'cha';
							tone = 'high';
							break;
						case '\u0F56':
							currentRoot = 'cha';
							tone = 'low';
							break;
						default:
							currentRoot = currentRoot.slice(0, -1) + 'ya';
							break;
					}
					break;

				default:
					break;
			}
		}

		if (this.state.suffix) {
			if (
				this.state.suffix === '\u0F51' ||
				this.state.suffix === '\u0F53' ||
				this.state.suffix === '\u0F63' ||
				this.state.suffix === '\u0F66'
			) {
				diairesis = true;
			}
			suffix = suffixes[this.state.suffix];
		}

		let transliterationDisplay = currentRoot;
		if (diairesis) transliterationDisplay += '\u0308';
		if (tone === 'high') transliterationDisplay += '\u0301';
		if (tone === 'low') transliterationDisplay += '\u0300';
		transliterationDisplay += suffix;

		return transliterationDisplay;
	}

	/*
	 *	diairesis: \u0308
	 *	high tone: \u0301
	 *	low tone: \u0300
	 */

	render() {
		return (
			<div className="container">
				<div className="display--tibetan">
					<h1>{this.createRootDisplay()}</h1>
				</div>
				<div className="display--transliteration">{this.createTranscriptionDisplay()}</div>
				<div className="options">
					<div className="option">
						<div
							className={
								this.state.root
									? 'option__text'
									: 'option__text option__text--inactive'
							}
						>
							Superscript
						</div>
						<select
							className={
								this.state.root
									? 'option__select'
									: 'option__select option__select--inactive'
							}
							name="superscript"
							value={this.state.superscript}
							onChange={this.handleChange}
							disabled={!this.state.root}
						>
							<option></option>
							{this.state.root &&
								superscripts.map((superscript, index) => (
									<option key={index}>{superscript}</option>
								))}
						</select>
					</div>
					<div className="option">
						<div
							className={
								this.state.root
									? 'option__text'
									: 'option__text option__text--inactive'
							}
						>
							Prefix
						</div>
						<select
							className={
								this.state.root
									? 'option__select'
									: 'option__select option__select--inactive'
							}
							name="prefix"
							value={this.state.prefix}
							onChange={this.handleChange}
							disabled={!this.state.root}
						>
							<option></option>
							{this.state.root &&
								prefixes.map((prefix, index) => (
									<option key={index}>{prefix}</option>
								))}
						</select>
					</div>
					<div className="option">
						Root syllable
						<select
							className="option__select"
							name="root"
							value={this.state.root}
							onChange={this.handleChange}
						>
							<option></option>
							{Object.keys(roots).map((rootSyllable, index) => (
								<option key={index}>{rootSyllable}</option>
							))}
						</select>
					</div>

					<div className="option">
						<div
							className={
								this.state.root
									? 'option__text'
									: 'option__text option__text--inactive'
							}
						>
							Suffix 1
						</div>
						<select
							className={
								this.state.root
									? 'option__select'
									: 'option__select option__select--inactive'
							}
							name="suffix"
							value={this.state.suffix}
							onChange={this.handleChange}
							disabled={!this.state.root}
						>
							<option></option>
							{this.state.root &&
								Object.keys(suffixes).map((suffix, index) => (
									<option key={index}>{suffix}</option>
								))}
						</select>
					</div>

					<div className="option">
						<div
							className={
								this.state.suffix
									? 'option__text'
									: 'option__text option__text--inactive'
							}
						>
							Suffix 2
						</div>
						<select
							className={
								this.state.suffix
									? 'option__select'
									: 'option__select option__select--inactive'
							}
							name="secondSuffix"
							value={this.state.secondSuffix}
							onChange={this.handleChange}
							disabled={!this.state.suffix}
						>
							<option></option>
							{this.state.suffix &&
								secondSuffixes.map((suffix, index) => (
									<option key={index}>{suffix}</option>
								))}
						</select>
					</div>

					<div className="option">
						<div
							className={
								this.state.availableSubscripts.length > 0
									? 'option__text'
									: 'option__text option__text--inactive'
							}
						>
							Subscript
						</div>
						<select
							className={
								this.state.availableSubscripts.length > 0
									? 'option__select'
									: 'option__select option__select--inactive'
							}
							name="subscript"
							value={this.state.subscript}
							onChange={this.handleChange}
							disabled={!(this.state.availableSubscripts.length > 0)}
						>
							<option></option>
							{this.state.root &&
								this.state.availableSubscripts.map((subscript, index) => (
									<option key={index}>{subscript}</option>
								))}
						</select>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
