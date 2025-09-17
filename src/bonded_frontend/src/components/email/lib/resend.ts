import { Resend } from 'resend';

export const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || 're_NBLYdjMA_CwhVuAjFP5tXxYH7kRU8Cxyw');
