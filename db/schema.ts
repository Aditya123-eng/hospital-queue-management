import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { HospitalState } from '@/lib/types';

export const hospitalState = pgTable('hospital_state', {
  id: text('id').primaryKey(),
  data: jsonb('data').$type<HospitalState>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type HospitalStateRecord = typeof hospitalState.$inferSelect;
export type NewHospitalStateRecord = typeof hospitalState.$inferInsert;
