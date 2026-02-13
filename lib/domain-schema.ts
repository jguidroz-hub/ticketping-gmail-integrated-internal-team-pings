import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './schema';

// Per-user preferences and settings
export const userSettings = pgTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  timezone: text('timezone').default('UTC'),
  emailNotifications: boolean('email_notifications').default(true),
  weeklyDigest: boolean('weekly_digest').default(true),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

// Tracks important state changes for debugging and compliance
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
});

// Organizations/teams using TicketPing
export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  emailDomain: text('email_domain').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

// Internal team communication pings attached to emails
export const pings = pgTable('pings', {
  id: text('id').primaryKey(),
  teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  emailThreadId: text('email_thread_id').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

// Users belonging to teams with their roles
export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});
