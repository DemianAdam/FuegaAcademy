import { ConvexReactClient } from 'convex/react';

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL environment variable is not set');
}

export const convex = new ConvexReactClient(convexUrl);

// Placeholder API - will be replaced by Convex generated types after running `npx convex dev`
export const api = {
  courses: {
    getPublishedCourses: 'courses:getPublishedCourses' as any,
    getCourseBySlug: 'courses:getCourseBySlug' as any,
    getCourseSchedules: 'courses:getCourseSchedules' as any,
    getCourseMaterials: 'courses:getCourseMaterials' as any,
    getUpcomingSessions: 'courses:getUpcomingSessions' as any,
    getExam: 'courses:getExam' as any,
    getExamSubmission: 'courses:getExamSubmission' as any,
  },
  enrollments: {
    getMyEnrollments: 'enrollments:getMyEnrollments' as any,
    createCheckoutSession: 'enrollments:createCheckoutSession' as any,
  },
  attendance: {
    logAttendance: 'attendance:logAttendance' as any,
    getAttendance: 'attendance:getAttendance' as any,
  },
  exams: {
    submitExam: 'exams:submitExam' as any,
  },
  auth: {
    loginWithEmail: 'auth:loginWithEmail' as any,
    registerWithEmail: 'auth:registerWithEmail' as any,
  },
};