import { count, and, lte, gte, eq, sql } from 'drizzle-orm'
import { db } from '../../db'
import { goals, goalsCompletions } from '../../db/schema'
import dayjs from 'dayjs'

interface AddGoalCompletionRequest {
  goalId: string
}

export async function addGoalCompletion({ goalId }: AddGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCompletionCounts = db.$with('goals_completion_counts').as(
    db
      .select({
        goalId: goalsCompletions.goalId,
        completionCount: count(goalsCompletions.id).as('completionCount'),
      })
      .from(goalsCompletions)
      .where(
        and(
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          eq(goalsCompletions.goalId, goalId)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )
  const result = await db
    .with(goalsCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalsCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalsCompletionCounts, eq(goalsCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed')
  }

  const insertResult = await db
    .insert(goalsCompletions)
    .values({
      goalId,
      createdAt: new Date(),
    })
    .returning()

  const goalCompletion = insertResult[0]

  return goalCompletion
}
