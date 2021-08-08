import './styles.module.scss';
import type { ReactNode } from 'react';
import Header from 'components/Header';
import type { HeaderProps } from 'components/Header';
import Footer from 'components/Footer';
import Dialogs from 'components/Dialog/Dialogs';
import LoadingIndicator from 'components/LoadingIndicator';
import PageHeading from 'components/Page/PageHeading';

export type PageProps = {
	/**
	 * The content of the heading displayed at the top of the page.
	 *
	 * When set, padding is added to the `main` element via `className="padded"`.
	 */
	heading?: ReactNode,
	children: ReactNode
} & HeaderProps;

const Page = ({ heading, children, flashyTitle }: PageProps) => (
	<>
		{/* It is necessary for dialogs to be before the page so that dialog elements are reached first when tabbing. */}
		<Dialogs />
		<div id="page">
			<Header flashyTitle={flashyTitle} />
			<main className={`mid${heading ? ' padded' : ''}`}>
				{(heading
					? <PageHeading>{heading}</PageHeading>
					: null
				)}
				{children}
			</main>
			<Footer />
		</div>
		<LoadingIndicator />
		{/* This exists to preload certain resources via styles set on it. */}
		<div id="preload-resources" />
	</>
);

export default Page;