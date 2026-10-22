import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { courseSchema } from "./courses/schema";
import { moduleSchema } from "./modules/schema";
import { scheduleSchema } from "./schedules/schema";
import { teacherSchema } from "./teachers/schema";
import { userSchema } from "./users/schema";
import { enrollmentSchema } from "./enrollments/schema";
import { orderSchema } from "./orders/schema";

export default defineSchema({
  ...authTables,
  users: userSchema,
  courses: courseSchema,
  modules: moduleSchema,
  schedules: scheduleSchema,
  teachers: teacherSchema,
  enrollments: enrollmentSchema,
  orders: orderSchema,
});
