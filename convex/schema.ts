import { defineSchema } from "convex/server";
import { mentorSchema } from "./mentors/schema";
import { courseSchema } from "./courses/schema";
import { moduleSchema } from "./modules/schema";
import { scheduleSchema } from "./schedules/schema";
import { teacherSchema } from "./teachers/schema";

export default defineSchema({
  mentors: mentorSchema,
  courses: courseSchema,
  modules: moduleSchema,
  schedules: scheduleSchema,
  teachers: teacherSchema,
});
