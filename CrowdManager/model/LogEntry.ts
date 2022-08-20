import { Schema, model, models, Types } from 'mongoose';
import db from '../services/db';
import { Message } from './Message';

const LogEntrySchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  phonenumbers: String,
  message: String,
}, {
  collection: 'log',
  timestamps: true
})

const LogEntry = models.LogEntry || model('LogEntry', LogEntrySchema);

export default LogEntry;

export async function log(message: Message) {
  await db;
  return new LogEntry({
    _id: new Types.ObjectId(),
    email: message.from,
    phonenumbers: message.to.join(','),
    message: message.body,
  }).save()
}

export async function getLogs() {
  await db;
  return LogEntry.find({}).sort({ createdAt: -1 });
}
