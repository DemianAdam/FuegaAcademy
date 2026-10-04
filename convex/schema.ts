import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { courseSchema } from "./courses/schema";
import { moduleSchema } from "./modules/schema";
import { scheduleSchema } from "./schedules/schema";
import { teacherSchema } from "./teachers/schema";
import { userSchema } from "./users/schema";
import { languageSchema } from "./languages/schema";
import { translationSchema } from "./translations/schema";
import { missingLanguageSchema } from "./languages/schema";
import { enrollmentSchema } from "./enrollments/schema";

export default defineSchema({
  ...authTables,
  users: userSchema,
  languages: languageSchema,
  courses: courseSchema,
  modules: moduleSchema,
  schedules: scheduleSchema,
  teachers: teacherSchema,
  translations: translationSchema,
  missingLanguages: missingLanguageSchema,
  enrollments: enrollmentSchema,
});
