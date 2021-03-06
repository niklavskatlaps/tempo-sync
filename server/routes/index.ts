import express from 'express';
import { getAppStatus, copyWorklogs } from 'controllers';

const router  = express.Router();

router.get('/', getAppStatus);
router.post('/', copyWorklogs);

export default router;
