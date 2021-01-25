import React from 'react';

interface TibetanCharacterMenuProps {
	active: boolean;
	handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	label: string;
	identifier: string;
	value: string;
	options: string[];
}

function TibetanCharacterMenu({
	active,
	handleChange,
	label,
	identifier,
	value,
	options,
}: TibetanCharacterMenuProps) {
	return (
		<div className="option">
			<div className={active ? 'option__text' : 'option__text option__text--inactive'}>
				{label}
			</div>
			<select
				id={identifier}
				className={active ? 'option__select' : 'option__select option__select--inactive'}
				name={identifier}
				value={value}
				onChange={handleChange}
				disabled={!active}
			>
				<option></option>
				{active
					? options.map((opt, index) => (
							<option key={index} id={`${identifier}_${opt}`}>
								{opt}
							</option>
					  ))
					: null}
			</select>
		</div>
	);
}

export default TibetanCharacterMenu;
