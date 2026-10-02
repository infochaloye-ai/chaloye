import type { BookingStatus, InquiryStatus } from '@/lib/cms/types';
import type { Tone } from './ui';

export const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
export const bookingTone: Record<BookingStatus, Tone> = {
  pending: 'amber',
  confirmed: 'green',
  completed: 'blue',
  cancelled: 'red',
};

export const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'replied', 'closed'];
export const inquiryTone: Record<InquiryStatus, Tone> = {
  new: 'orange',
  replied: 'blue',
  closed: 'gray',
};
