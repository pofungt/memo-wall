import IncomingForm from 'formidable/Formidable';
import { Request } from 'express';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';

export function parse(form: IncomingForm, req: Request) {
	return new Promise<[Fields, Files]>((resolve, reject) => {
		form.parse(req, async (err, fields, files) => {
			if (err) {
				reject(err);
			} else {
				resolve([fields, files]);
			}
		});
	});
}

const uploadDir = 'public/uploads';
fs.mkdirSync(uploadDir, { recursive: true });
let counter = 0;

export const form = formidable({
	uploadDir: uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 200 * 1024 ** 2,
	filter: (part) => part.mimetype?.startsWith('image/') || false,
	filename: (name, ext, part, form) => {
		counter++;
		let fieldName: string | null = part.name;
		let timeStamp = Date.now();
		let extension = part.mimetype?.split('/').pop();
		return `${fieldName}-${timeStamp}-${counter}.${extension}`;
	}
});
