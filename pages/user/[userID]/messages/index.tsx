import Page from 'components/Page';
import { withErrorPage } from 'modules/client/errors';
import { withStatusCode } from 'modules/server/errors';
import Box from 'components/Box';
import BoxSection from 'components/Box/BoxSection';
import { Perm } from 'modules/client/perms';
import { permToGetUserInPage } from 'modules/server/perms';
import messages, { getClientMessage } from 'modules/server/messages';
import type { ClientMessage } from 'modules/client/messages';
import type { PublicUser, PrivateUser } from 'modules/client/users';
import { getUser, setUser } from 'modules/client/users';
import { useUserCache } from 'modules/client/UserCache';
import List from 'components/List';
import { uniqBy } from 'lodash';
import users, { getPrivateUser, getPublicUser } from 'modules/server/users';
import type { ListedMessage } from 'components/MessageListing';
import MessageListing from 'components/MessageListing';
import { useCallback, useEffect, useMemo, useState } from 'react';

type ServerSideProps = {
	privateUser: PrivateUser,
	clientMessages: ClientMessage[],
	userCache: PublicUser[]
} | {
	statusCode: number
};

const Component = withErrorPage<ServerSideProps>(({
	privateUser,
	clientMessages,
	userCache: initialUserCache
}) => {
	const [previousClientMessages, setPreviousClientMessages] = useState(clientMessages);
	const listedMessagesFromProps = useMemo(() => (
		clientMessages.map<ListedMessage>(message => ({
			...message,
			selected: false
		}))
	), [clientMessages]);
	const [listedMessages, setListedMessages] = useState(listedMessagesFromProps);

	if (previousClientMessages !== clientMessages) {
		setListedMessages(listedMessagesFromProps);

		setPreviousClientMessages(clientMessages);
	}

	const { cacheUser } = useUserCache();
	initialUserCache.forEach(cacheUser);

	useEffect(() => {
		const user = getUser();

		if (user?.id === privateUser.id) {
			// Update the user's unread message count in case it is outdated.
			setUser({
				...user,
				unreadMessageCount: listedMessages.filter(message => !message.read).length
			});
		}
	}, [listedMessages, privateUser.id]);

	return (
		<Page flashyTitle heading="Messages">
			<Box>
				<BoxSection heading="Your Messages">
					<List
						listing={MessageListing}
						setMessage={
							useCallback((message: ListedMessage) => {
								const messageIndex = listedMessages.findIndex(({ id }) => id === message.id);

								setListedMessages([
									...listedMessages.slice(0, messageIndex),
									message,
									...listedMessages.slice(messageIndex + 1, listedMessages.length)
								]);
							}, [listedMessages])
						}
						removeListing={
							useCallback((message: ListedMessage) => {
								const messageIndex = listedMessages.findIndex(({ id }) => id === message.id);

								setListedMessages([
									...listedMessages.slice(0, messageIndex),
									...listedMessages.slice(messageIndex + 1, listedMessages.length)
								]);
							}, [listedMessages])
						}
					>
						{listedMessages}
					</List>
				</BoxSection>
			</Box>
		</Page>
	);
});

export default Component;

export const getServerSideProps = withStatusCode<ServerSideProps>(async ({ req, params }) => {
	const { user, statusCode } = await permToGetUserInPage(req, params.userID, Perm.sudoRead);

	if (statusCode) {
		return { props: { statusCode } };
	}

	const serverMessages = await messages.aggregate!([
		// Find messages sent to this user.
		{ $match: { notDeletedBy: user!._id } },
		// Sort by newest first.
		{ $sort: { sent: -1 } }
	]).toArray();

	const clientMessages = serverMessages.map(message => getClientMessage(message, user!));

	return {
		props: {
			privateUser: getPrivateUser(user!),
			clientMessages,
			userCache: (
				await users.find!({
					_id: {
						$in: uniqBy(serverMessages.map(message => message.from), String)
					}
				}).map(getPublicUser).toArray()
			)
		}
	};
});