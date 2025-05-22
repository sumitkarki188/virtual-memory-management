import { COLORS } from './colors';

export const TIMELINE_STEPS = [
  { id: 'tlb_lookup', label: 'TLB Lookup', color: COLORS.highlight },
  { id: 'tlb_hit', label: 'TLB Hit', color: COLORS.tlbHit },
  { id: 'tlb_miss', label: 'TLB Miss', color: COLORS.tlbMiss },
  { id: 'page_table_hit', label: 'Page Table Hit', color: COLORS.tlbHit },
  { id: 'page_fault', label: 'Page Fault', color: COLORS.pageFault },
  { id: 'memory_update', label: 'Memory Update', color: COLORS.used },
];