export function transitionLeadStatus(lead, outcome, options = {}) {
  const next = { ...lead };
  if (outcome === 'np') {
    const npCount = (next.npCount || 0) + 1;
    next.npCount = npCount;
    next.status = npCount >= (options.npMax || 5) ? 'ni' : 'np';
  } else if (outcome === 'pending') {
    next.status = 'pending';
  } else {
    next.status = outcome;
  }
  next.lastOutcomeAt = options.now || new Date().toISOString();
  return next;
}

export function nextDialableIndex(leads, after = -1, options = {}) {
  const npMax = options.npMax || 5;
  for (let i = after + 1; i < leads.length; i += 1) {
    const lead = leads[i];
    if (!lead) continue;
    if (lead.status === 'pending') return i;
    if (lead.status === 'cb' && options.includeCallbacks) return i;
    if (lead.status === 'np' && (lead.npCount || 0) < npMax && !options.skipNp) return i;
  }
  return -1;
}
