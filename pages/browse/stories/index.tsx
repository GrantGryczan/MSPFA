import { withStatusCode } from 'lib/server/errors';
import type { PublicStory } from 'lib/client/stories';
import { connection } from 'lib/server/db';
import Label from 'components/Label';
import { Field } from 'formik';
import Row from 'components/Row';
import { useRouter } from 'next/router';
import type { integer } from 'lib/types';
import BrowsePage, { getBooleanRecordFromQueryValue, getNumberFromQueryValue, getStringFromQueryValue, getTagsFromQueryValue, MAX_RESULTS_PER_PAGE } from 'components/BrowsePage';
import StoryListing from 'components/StoryListing';
import TagField from 'components/TagField';
import type StoryStatus from 'lib/client/StoryStatus';
import { storyStatusNames } from 'lib/client/StoryStatus';
import type { ChangeEvent, ReactNode } from 'react';
import { useState } from 'react';
import type { StorySortMode } from 'pages/api/stories';
import useFunction from 'lib/client/reactHooks/useFunction';
import BrowsePageAdvancedOptions from 'components/BrowsePage/BrowsePageAdvancedOptions';
import BrowsePageRangeField from 'components/BrowsePage/BrowsePageRangeField';
import BrowsePageDateRangeField from 'components/BrowsePage/BrowsePageDateRangeField';

const minQueryDate = new Date(0);
minQueryDate.setFullYear(2010, 0, 1);
/** The beginning of the year that MSPFA was created (in the user's time zone). */
const MIN_QUERY_DATE = minQueryDate.setHours(0, 0, 0, 0);

/** A record which maps every `StoryStatus` to `true`. */
const allStatusesTrue: Record<string, true> = {} as any;

const statusFieldContainers: ReactNode[] = [];

for (const status of Object.keys(storyStatusNames)) {
	allStatusesTrue[status] = true;

	statusFieldContainers.push(
		<span
			key={status}
			className="browse-page-checkbox-field-container"
		>
			<Field
				type="checkbox"
				id={`field-status-${status}`}
				name={`status.${status}`}
				className="spaced"
			/>
			<label
				className="spaced"
				htmlFor={`field-status-${status}`}
			>
				{storyStatusNames[status as unknown as StoryStatus]}
			</label>
		</span>
	);
}

/** A mapping from each `StorySortMode` to the `StorySortMode` which sorts in reverse from it. */
const reversedSorts: Record<StorySortMode, StorySortMode> = {
	titleIndex: 'titleIndex',
	mostFavs: 'fewestFavs',
	fewestFavs: 'mostFavs',
	mostPages: 'fewestPages',
	fewestPages: 'mostPages',
	newest: 'oldest',
	oldest: 'newest',
	newestUpdated: 'newestUpdated',
	random: 'random'
};

type ServerSideProps = {
	stories?: never,
	resultCount?: never
} | {
	stories: PublicStory[],
	resultCount: integer
};

const Component = ({ stories, resultCount }: ServerSideProps) => {
	const router = useRouter();

	const [sortReverse, setSortReverse] = useState(false);

	const now = Date.now();

	return (
		<BrowsePage
			resourceLabel="Adventures"
			initialValues={{
				title: getStringFromQueryValue(router.query.title),
				tags: getTagsFromQueryValue(router.query.tags, ['-test']),
				status: getBooleanRecordFromQueryValue(router.query.status, allStatusesTrue),
				sort: getStringFromQueryValue(router.query.sort, 'mostFavs') as StorySortMode,
				minFavCount: getNumberFromQueryValue(router.query.minFavCount, 0),
				maxFavCount: getNumberFromQueryValue(router.query.maxFavCount, 0),
				minPageCount: getNumberFromQueryValue(router.query.minPageCount, 0),
				maxPageCount: getNumberFromQueryValue(router.query.maxPageCount, 0),
				minCreated: getNumberFromQueryValue(router.query.minCreated, MIN_QUERY_DATE, now),
				maxCreated: getNumberFromQueryValue(router.query.maxCreated, MIN_QUERY_DATE, now),
				minUpdated: getNumberFromQueryValue(router.query.minUpdated, MIN_QUERY_DATE, now),
				maxUpdated: getNumberFromQueryValue(router.query.maxUpdated, MIN_QUERY_DATE, now)
			}}
			listing={StoryListing}
			resultCount={resultCount}
			results={stories}
		>
			{function BrowsePageContent({ values, setFieldValue }) {
				/** The reverse of the `sort` value. */
				const reversedSort = reversedSorts[values.sort];
				/** Whether the `sort` value should remain the same when `sortReverse`. */
				const symmetricalSort = values.sort === reversedSort;

				return (
					<>
						<Row>
							<Label className="spaced" htmlFor="field-title">
								Title
							</Label>
							<Field
								id="field-title"
								name="title"
								className="spaced"
								maxLength={50}
								autoFocus
							/>
						</Row>
						<Row>
							<Label className="spaced">
								Status
							</Label>
							{statusFieldContainers}
						</Row>
						<Row>
							<TagField allowExcludedTags />
						</Row>
						<Row>
							<Label className="spaced" htmlFor="field-sort">
								Sort By
							</Label>
							<Field
								as="select"
								id="field-sort"
								name="sort"
								className="spaced"
							>
								<option value="titleIndex">Title Relevance</option>
								{sortReverse ? (
									<>
										<option value="fewestFavs">Least Favorited</option>
										<option value="fewestPages">Fewest Pages</option>
										<option value="oldest">Oldest</option>
									</>
								) : (
									<>
										<option value="mostFavs">Most Favorited</option>
										<option value="mostPages">Most Pages</option>
										<option value="newest">Newest</option>
									</>
								)}
								<option value="newestUpdated">Most Recently Updated</option>
								<option value="random">Random</option>
							</Field>
							<span
								// Make the reverse checkbox translucent when `symmetricalSort` to make it clear to the user that reversing is unused for this sort method, but don't disable it or else that would make it less convenient to access a couple sorting options from the `sort` field.
								className={`browse-page-checkbox-field-container${symmetricalSort ? ' translucent' : ''}`}
							>
								<input
									type="checkbox"
									id="field-sort-reverse"
									className="spaced"
									checked={sortReverse}
									onChange={
										useFunction((event: ChangeEvent<HTMLInputElement>) => {
											setSortReverse(event.target.checked);

											if (!symmetricalSort) {
												setFieldValue('sort', reversedSort);
											}
										})
									}
								/>
								<label
									htmlFor="field-sort-reverse"
									className="spaced"
								>
									Reverse
								</label>
							</span>
						</Row>
						<BrowsePageAdvancedOptions>
							<BrowsePageRangeField nameSuffix="FavCount" label="Favorite Count" />
							<BrowsePageRangeField nameSuffix="PageCount" label="Page Count" />
							<BrowsePageDateRangeField
								nameSuffix="Created"
								label="Date Created"
								min={MIN_QUERY_DATE}
								max={now}
							/>
							<BrowsePageDateRangeField
								nameSuffix="Updated"
								label="Latest Date Updated"
								min={MIN_QUERY_DATE}
								max={now}
							/>
						</BrowsePageAdvancedOptions>
					</>
				);
			}}
		</BrowsePage>
	);
};

export default Component;

export const getServerSideProps = withStatusCode<ServerSideProps>(async ({ query }) => {
	await connection;

	const results = ( // TODO
		typeof query.title === 'string'
			? []
			: undefined
	);

	let props;

	if (results) {
		let pageNumber = typeof query.p === 'string' ? +query.p : 1;

		if (Number.isNaN(pageNumber) || pageNumber < 1) {
			pageNumber = 1;
		}

		const startIndex = (pageNumber - 1) * MAX_RESULTS_PER_PAGE;

		props = {
			stories: results.slice(startIndex, startIndex + MAX_RESULTS_PER_PAGE),
			resultCount: results.length
		};
	} else {
		props = {};
	}

	return { props };
});