import validate from './index.validate';
import type { APIHandler } from 'lib/server/api';
import { deleteMessageForUser, getMessageByUnsafeID, updateUnreadMessages } from 'lib/server/messages';
import { Perm } from 'lib/client/perms';
import { permToGetUserInAPI } from 'lib/server/permToGetUser';

const Handler: APIHandler<{
	query: {
		messageID: string,
		userID: string
	},
	method: 'PUT',
	body: true
}> = async (req, res) => {
	await validate(req, res);

	const user = await permToGetUserInAPI(req, res, Perm.sudoDelete);

	const message = await getMessageByUnsafeID(req.query.messageID, res);

	if (message.notDeletedBy.some(userID => userID.equals(user._id))) {
		await deleteMessageForUser(user._id, message);

		await updateUnreadMessages(user._id);
	}

	res.status(204).end();
};

export default Handler;