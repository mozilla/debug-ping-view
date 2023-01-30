/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from './config';

const settings = {};

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app, settings);
const auth = getAuth(app);

export { app, auth, db };
