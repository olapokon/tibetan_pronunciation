import React, { Component } from 'react';
import {
	superscripts,
	prefixes,
	roots,
	suffixes,
	secondSuffixes,
	subscriptsTable,
	Column,
	Tone,
} from './tibetanUnicodeData';

const DIAIRESIS_UNICODE_CODEPOINT = '\u0308';
const HIGH_TONE_UNICODE_CODEPOINT = '\u0301';
const LOW_TONE_UNICODE_CODEPOINT = '\u0300';

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

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
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
					if (prunedSubscripts.includes('ལ')) {
						prunedSubscripts.splice(prunedSubscripts.indexOf('ལ'), 1);
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
	};

	handleRootChange = (value: string): void => {
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
	};

	createTibetanDisplay = (): string => {
		if (!this.state.root) {
			return 'ཨ';
		}
		const prefix = this.state.prefix ? roots[this.state.prefix].unicodeCodePoint : '';
		const superscript = this.state.superscript
			? roots[this.state.superscript].unicodeCodePoint
			: '';
		const subscript = this.state.subscript
			? roots[this.state.subscript].unicodeCodePointAsSubscript
			: '';
		const suffix = this.state.suffix ? roots[this.state.suffix].unicodeCodePoint : '';
		const secondSuffix = this.state.secondSuffix
			? roots[this.state.secondSuffix].unicodeCodePoint
			: '';
		const root = superscript
			? roots[this.state.root].unicodeCodePointAsSubscript
			: roots[this.state.root].unicodeCodePoint;
		return `${prefix}${superscript}${root}${subscript}${suffix}${secondSuffix}`;
	};

	createPhoneticDisplay = (): string => {
		if (!this.state.root || !roots[this.state.root]) {
			return '';
		}

		const root = roots[this.state.root];
		let rootPhonetic = root.phonetic;
		const column = roots[this.state.root].column;
		let tone: Tone = Tone.NONE;

		const rootsArray = Object.keys(roots);
		let diairesis = false;
		let suffix = '';

		// determine if there is change in the root, based on a prefix, superscript, or subscript
		// the root change of the subscript overrides the root change for a third column root with prefix
		if (this.state.prefix || this.state.superscript) {
			if (column === Column.THIRD) {
				rootPhonetic = root.phoneticModifiedThirdColumn ? root.phoneticModifiedThirdColumn : root.phonetic;
			}
			if (column === Column.FOURTH) {
				tone = Tone.HIGH;
			}
		}

		if (this.state.subscript) {
			switch (this.state.subscript) {
				// ra subscript
				case 'ར':
					switch (this.state.root) {
						case 'ཀ':
						case 'ཏ':
						case 'པ':
							rootPhonetic = 'tra';
							tone = Tone.HIGH;
							break;
						case 'ཁ':
						case 'ཐ':
						case 'ཕ':
							rootPhonetic = 'thra';
							tone = Tone.HIGH;
							break;
						case 'ག':
						case 'ད':
						case 'བ':
							if (this.state.superscript === 'ས') {
								rootPhonetic = 'dra';
							} else {
								rootPhonetic = 'thra';
							}
							tone = Tone.LOW;
							break;
						case 'ཧ':
							rootPhonetic = 'hra';
							break;
						default:
							break;
					}
					break;

				// la subscript
				case 'ལ':
					if (this.state.root === 'ཟ') {
						rootPhonetic = 'da';
						tone = Tone.LOW;
					} else {
						rootPhonetic = 'la';
						tone = Tone.HIGH;
					}
					break;

				// ya subscript
				case 'ཡ':
					switch (this.state.root) {
						case 'མ':
							rootPhonetic = 'nya';
							tone = Tone.LOW;
							break;
						case 'པ':
							rootPhonetic = 'ca';
							tone = Tone.HIGH;
							break;
						case 'ཕ':
							rootPhonetic = 'cha';
							tone = Tone.HIGH;
							break;
						case 'བ':
							rootPhonetic = 'cha';
							tone = Tone.LOW;
							break;
						default:
							rootPhonetic = rootPhonetic.slice(0, -1) + 'ya';
							break;
					}
					break;

				default:
					break;
			}
		}

		if (this.state.suffix) {
			if (
				this.state.suffix === 'ད' ||
				this.state.suffix === 'ན' ||
				this.state.suffix === 'ལ' ||
				this.state.suffix === 'ས'
			) {
				diairesis = true;
			}
			suffix = roots[this.state.suffix].phoneticAsSuffix || '';
		}

		let phoneticDisplay = rootPhonetic;
		if (diairesis) phoneticDisplay += DIAIRESIS_UNICODE_CODEPOINT;
		if (tone === Tone.HIGH) phoneticDisplay += HIGH_TONE_UNICODE_CODEPOINT;
		if (tone === Tone.LOW) phoneticDisplay += LOW_TONE_UNICODE_CODEPOINT;
		phoneticDisplay += suffix;

		return phoneticDisplay;
	};

	render() {
		return (
			<div className="container">
				{/* tibetan display */}
				<div className="display--tibetan">
					<h1>{this.createTibetanDisplay()}</h1>
				</div>
				{/* transliteration display */}
				<div className="display--transliteration">{this.createPhoneticDisplay()}</div>
				<div className="options">
					{/* prefixes menu */}
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
							id="prefix"
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
									<option key={index} id={`prefix_${prefix}`}>
										{prefix}
									</option>
								))}
						</select>
					</div>
					{/* superscripts menu */}
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
							id="superscript"
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
									<option key={index} id={`superscript_${superscript}`}>
										{superscript}
									</option>
								))}
						</select>
					</div>
					{/* root syllables menu */}
					<div className="root option">
						Root syllable
						<select
							id="root"
							className="option__select"
							name="root"
							value={this.state.root}
							onChange={this.handleChange}
						>
							<option></option>
							{Object.keys(roots).map((rootSyllable, index) => (
								<option key={index} id={`root_${rootSyllable}`}>
									{rootSyllable}
								</option>
							))}
						</select>
					</div>
					{/* subscripts menu */}
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
							id="subscript"
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
									<option key={index} id={`subscript_${subscript}`}>
										{subscript}
									</option>
								))}
						</select>
					</div>
					{/* suffixes menu */}
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
							id="suffix1"
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
								suffixes.map((suffix, index) => (
									<option key={index} id={`suffix1_${suffix}`}>
										{suffix}
									</option>
								))}
						</select>
					</div>
					{/* second suffixes menu */}
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
							id="suffix2"
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
									<option key={index} id={`suffix2_${suffix}`}>
										{suffix}
									</option>
								))}
						</select>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
