import { client, db } from ".";
import { goals, goalsCompletions, users } from "./schema";
import dayjs from "dayjs";

async function seed() {
  const startOfWeek = dayjs().startOf("week");

  await db.delete(goalsCompletions);
  await db.delete(goals);
  await db.delete(users);

  const seedUser = await db
    .insert(users)
    .values([{ email: "email@email.com", password: "password" }])
    .returning();

  const seedGoals = await db
    .insert(goals)
    .values([
      {
        title: "Acordar Cedo",
        desiredWeeklyFrequency: 5,
        userId: seedUser[0].id,
      },
      {
        title: "Academia",
        desiredWeeklyFrequency: 5,
        userId: seedUser[0].id,
      },
      {
        title: "Estudar",
        desiredWeeklyFrequency: 3,
        userId: seedUser[0].id,
      },
    ])
    .returning();

  await db.insert(goalsCompletions).values([
    { goalId: seedGoals[0].id, createdAt: startOfWeek.toDate() },
    { goalId: seedGoals[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
