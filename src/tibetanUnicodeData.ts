export type TibetanSyllable = {
	wylie: string;
	phonetic: string;
	// unicode: string;
	column: Column;
};

export enum Column {
	FIRST = 'FIRST',
	SECOND = 'SECOND',
	THIRD = 'THIRD',
	FOURTH = 'FOURTH',
	NONE = 'NONE',
}

export const superscripts: string[] = ['\u0F62', '\u0F63', '\u0F66'];

export const prefixes: string[] = ['\u0F42', '\u0F51', '\u0F56', '\u0F58', '\u0F60'];

export const roots: { [unicode: string]: TibetanSyllable } = {
	ཀ: {
		wylie: 'ka',
		phonetic: 'ka',
		column: Column.FIRST,
	},
	ཅ: {
		wylie: 'ca',
		phonetic: 'ca',
		column: Column.FIRST,
	},
	ཏ: {
		wylie: 'ta',
		phonetic: 'ta',
		column: Column.FIRST,
	},
	པ: {
		wylie: 'pa',
		phonetic: 'pa',
		column: Column.FIRST,
	},
	ཙ: {
		wylie: 'tsa',
		phonetic: 'tsa',
		column: Column.FIRST,
	},
	ཞ: {
		wylie: 'zha',
		phonetic: 'zha',
		column: Column.NONE,
	},
	ར: {
		wylie: 'ra',
		phonetic: 'ra',
		column: Column.NONE,
	},
	ཧ: {
		wylie: 'ha',
		phonetic: 'ha',
		column: Column.NONE,
	},
	ཁ: {
		wylie: 'kha',
		phonetic: 'kha',
		column: Column.SECOND,
	},
	ཆ: {
		wylie: 'cha',
		phonetic: 'cha',
		column: Column.SECOND,
	},
	ཐ: {
		wylie: 'tha',
		phonetic: 'tha',
		column: Column.SECOND,
	},
	ཕ: {
		wylie: 'pha',
		phonetic: 'pha',
		column: Column.SECOND,
	},
	ཚ: {
		wylie: 'tsha',
		phonetic: 'tsha',
		column: Column.SECOND,
	},
	ཟ: {
		wylie: 'za',
		phonetic: 'za',
		column: Column.NONE,
	},
	ལ: {
		wylie: 'la',
		phonetic: 'la',
		column: Column.NONE,
	},
	ཨ: {
		wylie: 'a',
		phonetic: 'a',
		column: Column.NONE,
	},
	ག: {
		wylie: 'ga',
		phonetic: 'kha',
		column: Column.THIRD,
	},
	ཇ: {
		wylie: 'ja',
		phonetic: 'cha',
		column: Column.THIRD,
	},
	ད: {
		wylie: 'da',
		phonetic: 'tha',
		column: Column.THIRD,
	},
	བ: {
		wylie: 'ba',
		phonetic: 'pha',
		column: Column.THIRD,
	},
	ཛ: {
		wylie: 'dza',
		phonetic: 'dza',
		column: Column.THIRD,
	},
	འ: {
		wylie: "'a",
		phonetic: 'a',
		column: Column.NONE,
	},
	ཤ: {
		wylie: 'sha',
		phonetic: 'sha',
		column: Column.NONE,
	},
	ང: {
		wylie: 'nga',
		phonetic: 'nga',
		column: Column.FOURTH,
	},
	ཉ: {
		wylie: 'nya',
		phonetic: 'nya',
		column: Column.FOURTH,
	},
	ན: {
		wylie: 'na',
		phonetic: 'na',
		column: Column.FOURTH,
	},
	མ: {
		wylie: 'ma',
		phonetic: 'ma',
		column: Column.FOURTH,
	},
	ཝ: {
		wylie: 'wa',
		phonetic: 'wa',
		column: Column.NONE, // TODO: FOURTH or NONE?
	},
	ཡ: {
		wylie: 'ya',
		phonetic: 'ya',
		column: Column.NONE,
	},
	ས: {
		wylie: 'sa',
		phonetic: 'sa',
		column: Column.NONE,
	},
};

export const modifiedThirdColumn: { [unicode: string]: string } = {
	ག: 'ga',
	ཇ: 'ja',
	ད: 'da',
	བ: 'ba',
	ཛ: 'dza',
};

export const suffixes: { [unicode: string]: string } = {
	ག: 'k',
	ང: 'ng',
	ད: '',
	ན: 'n',
	བ: 'p',
	མ: 'm',
	འ: '',
	ར: 'r',
	ལ: 'l',
	ས: '',
};

export const secondSuffixes: string[] = ['\u0F51', '\u0F66'];

export const superscribedRootsTable: { [unicode: string]: string } = {
	ཀ: '\u0F90',
	ཅ: '\u0F95',
	ཏ: '\u0F9F',
	པ: '\u0FA4',
	ཙ: '\u0FA9',
	ཞ: '\u0FAE',
	ར: '\u0FB2',
	ཧ: '\u0FB7',
	ཁ: '\u0F91',
	ཆ: '\u0F96',
	ཐ: '\u0FA0',
	ཕ: '\u0FA5',
	ཚ: '\u0FAA',
	ཟ: '\u0FAF',
	ལ: '\u0FB3',
	ཨ: '\u0FB8',
	ག: '\u0F92',
	ཇ: '\u0F97',
	ད: '\u0FA1',
	བ: '\u0FA6',
	ཛ: '\u0FAB',
	འ: '\u0FB0',
	ཤ: '\u0FB4',
	ང: '\u0F94',
	ཉ: '\u0F99',
	ན: '\u0FA3',
	མ: '\u0FA8',
	ཝ: '\u0FAD',
	ཡ: '\u0FB1',
	ས: '\u0FB6',
};

export const subscriptsTable: { [unicode: string]: string[] } = {
	ཀ: ['\u0F61', '\u0F62', '\u0F63'],
	ཁ: ['\u0F61', '\u0F62'],
	ག: ['\u0F61', '\u0F62', '\u0F63'],
	པ: ['\u0F61', '\u0F62', '\u0F63'],
	ཕ: ['\u0F61', '\u0F62'],
	བ: ['\u0F61', '\u0F62'],
	མ: ['\u0F61', '\u0F62'],
	ཏ: ['\u0F62'],
	ཐ: ['\u0F62'],
	ད: ['\u0F62'],
	ཤ: ['\u0F62'],
	ར: ['\u0F63'],
	ས: ['\u0F62', '\u0F63'],
	ཟ: ['\u0F63'],
	ཧ: ['\u0F62'],
};

export const subscriptsDisplayTable: { [unicode: string]: string } = {
	ཡ: '\u0FB1',
	ར: '\u0FB2',
	ལ: '\u0FB3',
};
