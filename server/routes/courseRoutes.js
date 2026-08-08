import {Router} from 'express';
const router=Router();
import {getAllCourses,createCourse,updateCourse,getCourseDetails,deleteCourse,addLectures} from '../controllers/courseController.js'
import {isLoggedIn,  authorizeRoles, authorizedSubcriber} from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

router.get('/',getAllCourses);
router.post('/',isLoggedIn,authorizeRoles("ADMIN"),upload.single('thumbnail'),createCourse);
router.put('/:id',isLoggedIn,authorizeRoles("ADMIN"),updateCourse);
router.delete('/:id',isLoggedIn,authorizeRoles("ADMIN"),deleteCourse);
router.post('/:id',isLoggedIn,authorizeRoles("ADMIN"),upload.single('lecture'),addLectures);
router.get('/:id',isLoggedIn,authorizedSubcriber,getCourseDetails);

export default router;

