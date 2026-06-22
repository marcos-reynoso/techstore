import { z } from "zod"

export function getZodMessage(error: unknown, fallback = "Something went wrong") {
  if (!(error instanceof z.ZodError)) {
    return fallback
  }

  const issue = error.issues[0]
  if (!issue) {
    return fallback
  }

  return issue.path.length > 0 ? issue.message : issue.message
}
