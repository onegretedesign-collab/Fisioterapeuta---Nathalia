import { plansData, type PlanItem } from '../data/plans.ts';
import type { FirstVisitFormData, FirstVisitSubmission } from './generateFirstVisitPdf.ts';

export interface FichaPayload {
  p: string; // protocol
  d: string; // date
  n: string; // patient name
  c: string; // contact/phone
  a: string; // address
  h: string; // preferred period
  m: string; // main complaint
  pl: string; // plan id
}

export function encodeFichaToUrlParam(submission: FirstVisitSubmission): string {
  const payload: FichaPayload = {
    p: submission.protocolNumber,
    d: submission.generatedAt,
    n: submission.formData.patientName,
    c: submission.formData.phone,
    a: submission.formData.address,
    h: submission.formData.preferredPeriod,
    m: submission.formData.mainComplaint || '',
    pl: submission.selectedPlan.id,
  };

  const json = JSON.stringify(payload);
  // Base64 encode safe for URL
  if (typeof btoa !== 'undefined') {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  }
  // Node.js fallback for tests
  return encodeURIComponent(Buffer.from(json, 'utf-8').toString('base64'));
}

export function decodeFichaFromUrlParam(param: string): FirstVisitSubmission | null {
  try {
    let json = '';
    const decodedParam = decodeURIComponent(param);
    if (typeof atob !== 'undefined') {
      json = decodeURIComponent(escape(atob(decodedParam)));
    } else {
      json = Buffer.from(decodedParam, 'base64').toString('utf-8');
    }

    const payload: FichaPayload = JSON.parse(json);
    if (!payload.n || !payload.c || !payload.pl) {
      return null;
    }

    const selectedPlan: PlanItem =
      plansData.find((p) => p.id === payload.pl) || plansData[0];

    const formData: FirstVisitFormData = {
      planId: payload.pl,
      patientName: payload.n,
      phone: payload.c,
      address: payload.a,
      preferredPeriod: payload.h || 'A combinar',
      mainComplaint: payload.m || '',
    };

    return {
      formData,
      selectedPlan,
      protocolNumber: payload.p || '000000',
      generatedAt: payload.d || new Date().toLocaleDateString('pt-BR'),
    };
  } catch (err) {
    console.error('Failed to decode ficha param:', err);
    return null;
  }
}
