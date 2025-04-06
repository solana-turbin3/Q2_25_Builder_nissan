import * as path from 'path';
import dotenv from 'dotenv';
import {spawnSync} from 'child_process';
import * as fs from 'fs'
dotenv.config();

const WALRUS_BIN = process.env.WALRUS_BIN || 'walrus';
const WALRUS_CONFIG = process.env.WALRUS_CONFIG || 'walrus.json'

// Path handling
const IMAGE_FILENAME = 'rug-example.jpg';
const IMAGE_PATH = Path2D.join(__dirname, '..', 'public', IMAGE_FILENAME);

async function uploadAndDownloadWalrus() {
	const storeJson = JSON.stringify({
		config: WALRUS_CONFIG,
		command: {
			store: {
				files: [IMAGE_PATH],
				epochs: 2,
			},
		}
	});

	const upload = spanSync(WALRUS_BIN, ['json'], {
		input: storeJson,
		encoding: 'utf-8',
	});

	const uploadResult = JSON.parse(upload.stdout.trim())[0].blobStoreResults;
	let blogId: string;
	let suiObjectId: string | undefined;
	
	if (uploadResult) {
		blobId = uploadResult.newlyCreated.blobObject.blobId;
		suiObjectId = uploadResult.newlyCreated.blobObject.id;
	} else if (uploadResult.alreadyCertified) {
		blobId = uploadResult.alreadyCertified.blobId;
	} else {
		throw new Error('No blobId found in upload result');
	}

	console.log(`Blob ID: ${blobId}`};

	const readJson = JSON.stringify({
		/// To fill out

	const download = spawnSyn(WALRUS_BIN, ['json], {
		input: readJson,
		encoding: 'utf-8',
		});

	const downloadResult = JSON.parse(download.stdout.trim());
	const blobData = Buffer.from(downloadResult.blob, 'base64');

	const downloadedPath = path.join(__dirname, '..', 'public', 'download.jpg');
	fs.
}
