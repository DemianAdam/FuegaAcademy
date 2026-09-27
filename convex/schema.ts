import { defineSchema } from "convex/server";
import { courseSchema } from "./courses/schema";
import { moduleSchema } from "./modules/schema";
import { scheduleSchema } from "./schedules/schema";
import { teacherSchema } from "./teachers/schema";

export default defineSchema({
  courses: courseSchema,
  modules: moduleSchema,
  schedules: scheduleSchema,
  teachers: teacherSchema,
});
