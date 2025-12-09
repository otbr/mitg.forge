export type DiscordTokenResponse = {
	access_token: string;
	token_type: string; // "Bearer"
	expires_in: number;
	refresh_token?: string;
	scope: string;
};

export type DiscordUserResponse = {
	id: string;
	username: string;
	global_name?: string | null;
	discriminator: string; // "0" em contas novas
	avatar: string | null;
	email?: string;
	verified?: boolean;
};
