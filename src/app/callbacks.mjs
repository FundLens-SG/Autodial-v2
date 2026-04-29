export function scheduleCallback(lead, date, time, note = '') {
  if (!date || !time) throw new Error('Callback date and time are required');
  return {
    id: `cb_${Date.now()}`,
    lead_name: lead.name || '',
    lead_phone: lead.phone || '',
    scheduled_date: date,
    scheduled_time: time,
    note,
    status: 'pending',
  };
}

export function dueCallbacks(callbacks, todayKey) {
  return callbacks
    .filter(item => item.status !== 'called' && item.scheduled_date && item.scheduled_date <= todayKey)
    .sort((a, b) => `${a.scheduled_date} ${a.scheduled_time || ''}`.localeCompare(`${b.scheduled_date} ${b.scheduled_time || ''}`));
}
