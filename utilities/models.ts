export interface objType {
	content: string;
	image?: string;
	liked_by: number[];
	created_at?: string;
	updated_at?: string;
}

export interface User {
	username: string;
	password: string;
	id: number;
	created_at?: string;
	updated_at?: string;
}
