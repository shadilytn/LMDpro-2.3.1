import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// User accounts tied to Firebase Auth identities
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Academic Notes & Study Documents (syncable to Google Drive & Picker)
export const academicNotes = pgTable('academic_notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  summary: text('summary'),
  fileUrl: text('file_url'), // Google Drive or Cloud File URL if backed up
  syncStatus: text('sync_status').default('Local'), // 'Local' | 'Backed Up' | 'Syncing'
  createdAt: timestamp('created_at').defaultNow(),
});

// Assessment submissions, auto-scanned quizzes & step-by-step socratic evaluations
export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  subject: text('subject').notNull(),
  questionText: text('question_text').notNull(),
  solvedAnswer: text('solved_answer').notNull(),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Ephemeral learned vectors for RAG, embedding compression, and automatic size-reduction indexing
export const learnedVectors = pgTable('learned_vectors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  topic: text('topic').notNull(),
  concepts: text('concepts').notNull(), // Socratic learning points
  compressedEmbeddings: text('compressed_embeddings').notNull(), // Serialized compact text representations
  originalByteSize: integer('original_byte_size').notNull(),
  compressedByteSize: integer('compressed_byte_size').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  academicNotes: many(academicNotes),
  assessments: many(assessments),
  learnedVectors: many(learnedVectors),
}));

export const academicNotesRelations = relations(academicNotes, ({ one }) => ({
  user: one(users, {
    fields: [academicNotes.userId],
    references: [users.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
}));

export const learnedVectorsRelations = relations(learnedVectors, ({ one }) => ({
  user: one(users, {
    fields: [learnedVectors.userId],
    references: [users.id],
  }),
}));
