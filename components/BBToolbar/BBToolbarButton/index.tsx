import './styles.module.scss';
import { useContext, useCallback } from 'react';
import { TextAreaRefContext } from 'components/BBToolbar';
import Button from 'components/Button';
import { Dialog } from 'modules/client/dialogs';
import type { BBTagProps } from 'components/BBCode/BBTags';
import LabeledDialogBox from 'components/Box/LabeledDialogBox';
import FieldBoxRow from 'components/Box/FieldBoxRow';

type NewBBTagProps = {
	children: string,
	attributes: BBTagProps['attributes']
};

const tags: Record<string, {
	title: string,
	/**
	 * The initial values of the BB tag's dialog form.
	 *
	 * These values are spread to `{ children, attributes: '' }` when setting the dialog form's initial values.
	 *
	 * If this is a function, the return value is spread to the initial values instead.
	 */
	initialValues?: (
		Record<string, any>
		| ((
			/** The user's selected text in the text area. */
			children: string
		) => Record<string, any>)
	),
	/**
	 * The content of the BB tag dialog which opens when the tag's icon is clicked in the toolbar.
	 *
	 * If `undefined`, no dialog will open when this tag's icon is clicked.
	 */
	content?: Dialog<Record<string, any>>['content'],
	/**
	 * A function called when the BB tag's dialog closes.
	 *
	 * The dialog form's values are passed in, and the return value is spread with the form's values to the BB tag's props.
	 */
	valuesToProps?: <Values extends Record<string, any>>(
		values: Values
	) => Partial<NewBBTagProps>
}> = {
	b: { title: 'Bold' },
	i: { title: 'Italic' },
	u: { title: 'Underline' },
	s: { title: 'Strikethrough' },
	color: {
		title: 'Text Color',
		content: (
			<LabeledDialogBox>
				<FieldBoxRow
					type="color"
					name="attributes"
					label="Color"
					required
					autoFocus
					size={9}
				/>
			</LabeledDialogBox>
		)
	},
	background: {
		title: 'Text Background Color',
		content: (
			<LabeledDialogBox>
				<FieldBoxRow
					type="color"
					name="attributes"
					label="Color"
					required
					autoFocus
					size={9}
				/>
			</LabeledDialogBox>
		)
	},
	size: {
		title: 'Font Size',
		content: (
			<LabeledDialogBox>
				<FieldBoxRow
					type="number"
					name="attributes"
					label="Size in Pixels"
					required
					autoFocus
					min={0}
				/>
			</LabeledDialogBox>
		)
	},
	font: {
		title: 'Font Family'
	},
	left: { title: 'Align Left' },
	center: { title: 'Align Center' },
	right: { title: 'Align Right' },
	justify: { title: 'Align Justify' },
	url: {
		title: 'Link'
	},
	alt: {
		title: 'Hover Text',
		content: (
			<LabeledDialogBox>
				<FieldBoxRow
					name="attributes"
					label="Hover Text"
					required
					autoFocus
				/>
			</LabeledDialogBox>
		)
	},
	img: {
		title: 'Image'
	},
	spoiler: {
		title: 'Spoiler'
	},
	flash: {
		title: 'Flash Embed'
	}
};

// The above `tags` must be in the same order as the BB toolbar icon sheet.

/** The indexes of each tag within the BB toolbar icon sheet. */
const tagIndexes = Object.fromEntries(
	Object.keys(tags).map(
		(tagName, i) => [tagName, i]
	)
);

export type BBToolbarButtonProps = {
	/** The name of the BB tag which the BB toolbar button creates. */
	tag: string
};

/** Adds a BBCode toolbar to the child text area. */
const BBToolbarButton = ({ tag: tagName }: BBToolbarButtonProps) => {
	const tag = tags[tagName];

	const { textAreaRef, setValue } = useContext(TextAreaRefContext);

	return (
		<Button
			className="icon"
			title={tag.title}
			style={{
				backgroundPositionX: `${-tagIndexes[tagName]}em`
			}}
			onClick={
				useCallback(async () => {
					const { selectionStart, selectionEnd } = textAreaRef.current;
					const selection = textAreaRef.current.value.slice(selectionStart, selectionEnd);

					const tagProps: NewBBTagProps = {
						children: selection,
						// This needs to initially be an empty string and not `undefined` so that the form's initial values include this property and any fieldsFields with `name="attributes"` are initially Formik-controlled.
						attributes: ''
					};

					if (tag.content) {
						const dialog = new Dialog({
							title: tag.title,
							content: tag.content,
							initialValues: Object.assign(
								tagProps,
								tag.initialValues instanceof Function
									? tag.initialValues(selection)
									: tag.initialValues
							),
							actions: [
								{ label: 'Okay', autoFocus: false },
								'Cancel'
							]
						});

						if (!(await dialog)?.submit) {
							return;
						}

						Object.assign(
							tagProps,
							dialog.form!.values,
							tag.valuesToProps && tag.valuesToProps(dialog.form!.values)
						);
					}

					const openTag = `[${tagName}${
						tagProps.attributes
							// Perhaps this should be escaped to prevent "]" in `attributes` from closing the tag?
							? tagProps.attributes instanceof Object
								? (
									Object.entries(tagProps.attributes).map(
										([name, value]) => ` ${name}=${value}`
									).join('')
								)
								: `=${tagProps.attributes}`
							: ''
					}]`;
					const closeTag = `[/${tagName}]`;

					setValue(
						textAreaRef.current.value.slice(0, selectionStart)
						+ openTag
						+ tagProps.children
						+ closeTag
						+ textAreaRef.current.value.slice(selectionEnd, textAreaRef.current.value.length)
					);

					// This timeout is necessary so the selection of the new value occurs after the new value renders.
					setTimeout(() => {
						textAreaRef.current.focus();
						textAreaRef.current.selectionStart = selectionStart + openTag.length;
						textAreaRef.current.selectionEnd = selectionStart + openTag.length + tagProps.children.length;
					});

					// This ESLint comment is necessary because the rule incorrectly thinks `tagName` should be a dependency here, despite that it depends on `tag` which is already a dependency.
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, [tag, textAreaRef])
			}
		/>
	);
};

export default BBToolbarButton;