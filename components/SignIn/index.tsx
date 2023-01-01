import './styles.module.scss';
import { setSignInPage, resolveExternalSignIn } from 'lib/client/signIn';
import Link from 'components/Link';
import createUpdater from 'react-component-updater';
import type { ChangeEvent } from 'react';
import Captcha from 'components/Captcha';
import LabeledGridRow from 'components/LabeledGrid/LabeledGridRow';
import LabeledGrid from 'components/LabeledGrid';
import ForgotPassword from 'components/ForgotPassword';
import AuthButton from 'components/Button/AuthButton';
import BirthdateField from 'components/DateField/BirthdateField';
import { escapeRegExp } from 'lodash';
import type { integer } from 'lib/types';
import Row from 'components/Row';
import type { UserContextType } from 'lib/client/reactContexts/UserContext';
import { useUser } from 'lib/client/reactContexts/UserContext';
import useEmailTaken from 'lib/client/reactHooks/useEmailTaken';

const startSigningUp = () => {
	setSignInPage(1);
};

const [useSignInValuesUpdater, updateSignInValues] = createUpdater();

/** The initial values of the sign-in dialog's form. */
export const initialSignInValues = {
	email: '',
	password: '',
	confirmPassword: '',
	name: '',
	termsAgreed: false,
	birthdate: '',
	captchaToken: ''
};

export let signInValues = { ...initialSignInValues };

export const resetSignInValues = () => {
	signInValues = { ...initialSignInValues };
	updateSignInValues();
};

const onChange = (
	event: ChangeEvent<(
		HTMLInputElement
		& HTMLSelectElement
		& { name: keyof typeof signInValues }
	)>
) => {
	if (event.target.type === 'checkbox') {
		(signInValues[event.target.name] as boolean) = event.target.checked;
	} else {
		(signInValues[event.target.name] as string) = event.target.value;
	}
	updateSignInValues();
};

export type SignInProps = {
	/** 0 if signing in and not signing up. 1 or more for the page of the sign-up form the user is on. */
	page: integer
};

// TODO: Refactor this jank bullshit.
export let setUser: UserContextType[1];

const SignIn = ({ page }: SignInProps) => {
	useSignInValuesUpdater();

	[, setUser] = useUser();

	const { emailInputRef, emailTakenGridRow } = useEmailTaken(
		page === 1 && signInValues.email
	);

	return (
		<div id="sign-in-content">
			{page !== 2 && (
				<>
					<Row className="translucent">
						{page ? 'Sign up with' : 'Sign in with'}
					</Row>
					<Row id="sign-in-methods-external">
						<AuthButton type="google" onResolve={resolveExternalSignIn} />
						<AuthButton type="discord" onResolve={resolveExternalSignIn} />
					</Row>
					<Row className="translucent">
						or
					</Row>
				</>
			)}
			<LabeledGrid>
				{page === 2 ? (
					<>
						<LabeledGridRow htmlFor="sign-in-name" label="Username">
							<input
								id="sign-in-name"
								name="name"
								autoComplete="username"
								required
								maxLength={32}
								autoFocus={!signInValues.name}
								value={signInValues.name}
								onChange={onChange}
							/>
						</LabeledGridRow>
						<LabeledGridRow htmlFor="sign-in-birthdate-year" label="Birthdate">
							<BirthdateField
								id="sign-in-birthdate"
								required
								value={signInValues.birthdate}
								onChange={onChange}
							/>
						</LabeledGridRow>
					</>
				) : (
					<>
						<LabeledGridRow htmlFor="sign-in-email" label="Email">
							<input
								key={page} // This is necessary to re-render this element when `page` changes, or else `autoFocus` will not work correctly.
								type="email"
								id="sign-in-email"
								name="email"
								autoComplete="email"
								required
								maxLength={254}
								autoFocus={!signInValues.email}
								value={signInValues.email}
								onChange={onChange}
								ref={emailInputRef}
							/>
						</LabeledGridRow>
						{emailTakenGridRow}
						<LabeledGridRow htmlFor="sign-in-password" label="Password">
							<input
								type="password"
								id="sign-in-password"
								name="password"
								autoComplete={page ? 'new-password' : 'current-password'}
								required
								minLength={8}
								value={signInValues.password}
								onChange={onChange}
							/>
						</LabeledGridRow>
						{page === 0 ? (
							<ForgotPassword />
						) : (
							<LabeledGridRow htmlFor="sign-in-confirm-password" label="Confirm">
								<input
									type="password"
									id="sign-in-confirm-password"
									name="confirmPassword"
									autoComplete="new-password"
									required
									placeholder="Re-Type Password"
									pattern={escapeRegExp(signInValues.password)}
									value={signInValues.confirmPassword}
									onChange={onChange}
								/>
							</LabeledGridRow>
						)}
					</>
				)}
			</LabeledGrid>
			{page === 2 && (
				<>
					<Row>
						<Captcha />
					</Row>
					<Row id="terms-agreed-container">
						<label>
							<input
								type="checkbox"
								name="termsAgreed"
								className="spaced"
								required
								checked={signInValues.termsAgreed}
								onChange={onChange}
							/>
							<span className="spaced translucent">
								I agree to the <Link href="/terms" target="_blank">terms of service</Link>.
							</span>
						</label>
					</Row>
				</>
			)}
			{page === 0 && (
				<Row id="sign-up-link-container">
					<span className="translucent">Don't have an account? </span>
					<Link onClick={startSigningUp}>Sign up!</Link>
				</Row>
			)}
		</div>
	);
};

export default SignIn;
