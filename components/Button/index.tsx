import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './styles.module.scss';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** A styled `button` element. Accepts any props which `button` accepts, except `type` which is replaced with the `submit?: boolean` prop. */
const Button = React.forwardRef((
	{
		type = 'button',
		className,
		...props
	}: ButtonProps,
	ref: React.ForwardedRef<HTMLButtonElement & HTMLButtonElement>
) => {
	const buttonClassName = `button${className ? ` ${className}` : ''}`;

	return (
		<button
			type={type}
			className={buttonClassName}
			{...props}
			ref={ref}
		/>
	);
});

export default Button;