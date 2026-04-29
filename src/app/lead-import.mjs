export function normalizeStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'pending';
  if (['np', 'no pick', 'no answer', 'na'].includes(raw)) return 'np';
  if (['cb', 'callback', 'call back'].includes(raw)) return 'cb';
  if (['ni', 'not interested', 'reject'].includes(raw)) return 'ni';
  if (['set', 'appt', 'appointment', 'booked'].includes(raw)) return 'set';
  return 'pending';
}

export function normalizePhone(value) {
  return String(value || '').replace(/[^\d+]/g, '');
}

export function leadFromRow(row, columns = {}) {
  const pick = key => {
    const index = columns[key];
    return Number.isInteger(index) ? row[index] : '';
  };
  return {
    name: String(pick('name') || pick('firstName') || pick('phone') || 'Unknown').trim(),
    phone: normalizePhone(pick('phone')),
    email: String(pick('email') || '').trim(),
    notes: String(pick('notes') || pick('remarks') || '').trim(),
    status: normalizeStatus(pick('status')),
    npCount: 0,
  };
}

export function reviewImportedLeads(leads) {
  const seen = new Set();
  return leads.map((lead, index) => {
    const phone = normalizePhone(lead.phone);
    const duplicate = phone && seen.has(phone);
    if (phone) seen.add(phone);
    return {
      index,
      phone,
      duplicate,
      missingPhone: phone.replace(/[^\d]/g, '').length < 7,
      needsReview: duplicate || phone.replace(/[^\d]/g, '').length < 7 || !lead.name,
    };
  });
}
