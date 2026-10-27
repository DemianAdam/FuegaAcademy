# Design: Final Project Course Runs

Courses receive a `requiresFinalProject` flag. Enrollments gain an `active` or `completed` lifecycle, while submissions are stored separately and tied to one enrollment run. Student upload and review APIs enforce ownership and administrator authorization server-side.

The purchase flow only considers active enrollments when deciding whether checkout is allowed. Approved final projects complete the current run; a later payment creates a new active enrollment.

Project files use dedicated Convex storage records instead of the administrator image-asset store. Submission metadata records ownership, file details, review status, timestamps, and optional feedback.
