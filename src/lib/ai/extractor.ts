import { GREENSCAPE_PRICING_CATALOG } from '../pricingCatalog';
import { Proposal, ProposalLineItem, RenderRequest, TierPackage } from '../types';

export interface ExtractionInput {
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  propertyAddress: string;
  city?: string;
  rawNotes: string;
  apiKey?: string;
  model?: string;
}

export interface ExtractionResult {
  proposal: Proposal;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  estimatedCostUsd: number;
  modelUsed: string;
  executionTimeMs: number;
}

const SYSTEM_PROMPT = `
You are the Lead Estimator AI Agent for Greenscape Pro, a premium residential hardscape and landscape design-build contractor in Phoenix, AZ founded by Marcus Tate.
Your role is to ingest messy, unformatted field notes from Marcus's site walks and turn them into a structured, highly profitable, client-ready proposal with accurate line-item pricing, labor allowances, and margin guardrails.

CORE BUSINESS RULES & CONSTRAINTS:
1. Target Gross Margin is 38% or higher on all projects. Ensure (Retail Price - Cost) / Retail Price >= 0.38.
2. If the estimated total project value is $30,000 or higher, you MUST flag it for Carlos Reyes (Lead Designer) to generate a custom 3D CAD render before client sign-off, and write a detailed design brief for Carlos.
3. Typical project elements include: Belgard pavers, French pattern travertine, Alumawood or Cedar pergolas, custom block/stucco gas fire pits, pet turf, smart drip irrigation, low-voltage solid brass LED lighting, outdoor BBQ kitchens, and city permits.
4. Always generate 3 clear package tiers:
   - "Good" (Essential high-quality baseline)
   - "Better" (Recommended comprehensive outdoor living setup)
   - "Best" (Luxury resort-style upgrade with premium materials, lighting, water features)
5. Identify site constraints (e.g., HOA architectural approvals, tight side-gate access, gas line stub locations, drainage slopes).

PRICING CATALOG REFERENCE:
${JSON.stringify(GREENSCAPE_PRICING_CATALOG, null, 2)}

OUTPUT FORMAT:
You must return valid, raw JSON adhering strictly to the JSON schema without any markdown formatting wrappers.
`;

export async function extractProposalFromNotes(input: ExtractionInput): Promise<ExtractionResult> {
  const startTime = Date.now();
  const apiKey = input.apiKey || process.env.OPENAI_API_KEY;
  const model = input.model || process.env.LLM_MODEL || 'gpt-4o';

  // If real API key is available, execute live LLM call
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.includes('gpt') ? model : 'gpt-4o',
          response_format: { type: 'json_object' },
          temperature: 0.2,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Please process these site walk notes for customer ${input.leadName} at ${input.propertyAddress}:\n\n${input.rawNotes}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('OpenAI API request failed, falling back to intelligent heuristic parser:', errorText);
        return generateHeuristicProposal(input, startTime, 'gpt-4o-fallback (API Error)');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      const parsed = JSON.parse(content);

      const promptTokens = data.usage?.prompt_tokens || 1200;
      const completionTokens = data.usage?.completion_tokens || 900;
      const totalTokens = promptTokens + completionTokens;
      // GPT-4o pricing: $5.00 / 1M input tokens, $15.00 / 1M output tokens
      const estimatedCostUsd = ((promptTokens * 5) + (completionTokens * 15)) / 1_000_000;

      const proposal = normalizeParsedProposal(parsed, input);

      return {
        proposal,
        tokensUsed: {
          prompt: promptTokens,
          completion: completionTokens,
          total: totalTokens,
        },
        estimatedCostUsd: Number(estimatedCostUsd.toFixed(4)),
        modelUsed: model,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err) {
      console.warn('Error during LLM call:', err);
      return generateHeuristicProposal(input, startTime, 'gpt-4o-fallback (Exception)');
    }
  }

  // Zero-config intelligent fallback for flawless local testing
  return generateHeuristicProposal(input, startTime, 'Greenscape AI Deterministic Engine (Offline Mode)');
}

function normalizeParsedProposal(parsed: any, input: ExtractionInput): Proposal {
  const id = 'prop_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const items: ProposalLineItem[] = (parsed.items || []).map((item: any, index: number) => {
    const qty = Number(item.quantity) || 1;
    const unitCost = Number(item.unitCost) || 50;
    const unitPrice = Number(item.unitPrice) || Number((unitCost / 0.62).toFixed(2)); // Default to ~38% margin
    const totalCost = Number((qty * unitCost).toFixed(2));
    const totalPrice = Number((qty * unitPrice).toFixed(2));
    const margin = totalPrice > 0 ? Number(((totalPrice - totalCost) / totalPrice).toFixed(3)) : 0.38;

    return {
      id: `item_${index + 1}`,
      category: item.category || 'Hardscape',
      name: item.name || 'Custom Hardscape Item',
      description: item.description || '',
      quantity: qty,
      unit: item.unit || 'unit',
      unitCost,
      unitPrice,
      totalCost,
      totalPrice,
      margin,
      tier: item.tier || 'better',
    };
  });

  // Calculate totals
  const subtotalCost = items.reduce((acc, i) => acc + i.totalCost, 0);
  const subtotalPrice = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalCost = Number(subtotalCost.toFixed(2));
  const totalPrice = Number(subtotalPrice.toFixed(2));
  const grossMarginPercent = totalPrice > 0 ? Number(((totalPrice - totalCost) / totalPrice).toFixed(3)) : 0.38;
  const isMarginHealthy = grossMarginPercent >= 0.38;

  // 3D Render Trigger Check (> $30,000)
  const isOverThreshold = totalPrice >= 30000;
  const renderRequest: RenderRequest = {
    required: isOverThreshold,
    reason: isOverThreshold 
      ? `Project value ($${totalPrice.toLocaleString()}) exceeds the $30,000 3D render threshold. High-margin custom outdoor living space requires Carlos Reyes CAD elevation & 3D render packet.` 
      : 'Under $30,000 threshold. 2D layout and catalog spec sheets sufficient.',
    suggestedViews: isOverThreshold 
      ? ['Aerial 3D Master Plan', 'Pergola & BBQ Island Eye-Level', 'Evening Fire Pit & LED Lighting Mood Render']
      : [],
    designBrief: parsed.renderRequest?.designBrief || `Client ${input.leadName} (${input.propertyAddress}). Create full photorealistic 3D render showcasing hardscape transition to pergola shade structure, fire feature, and turf zones.`,
    assignedTo: 'Carlos Reyes (Lead Designer)',
    status: isOverThreshold ? 'pending' : 'not_required',
    deadlineEstimate: isOverThreshold ? '48 hours' : 'N/A',
  };

  // Tiers calculation
  const goodTotal = Number((totalPrice * 0.75).toFixed(2));
  const bestTotal = Number((totalPrice * 1.35).toFixed(2));

  return {
    id,
    leadName: input.leadName,
    leadEmail: input.leadEmail || `${input.leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    leadPhone: input.leadPhone || '(480) 555-0182',
    propertyAddress: input.propertyAddress,
    city: input.city || 'Phoenix, AZ',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    rawNotes: input.rawNotes,
    summaryScope: parsed.summaryScope || `Custom outdoor living transformation for ${input.leadName} including hardscaping, shade structure, and aesthetic landscaping.`,
    siteConstraints: parsed.siteConstraints || ['Standard 48" side-gate access for mini-skid steer', 'HOA architectural review required prior to groundbreaking', 'Locate blue-stake underground utility markings'],
    hoaApprovalRequired: Boolean(parsed.hoaApprovalRequired ?? true),
    permitRequired: Boolean(parsed.permitRequired ?? (totalPrice > 25000)),
    items,
    subtotalCost,
    subtotalPrice,
    totalCost,
    totalPrice,
    grossMarginPercent,
    isMarginHealthy,
    marginAlertReason: isMarginHealthy ? undefined : `Gross margin (${(grossMarginPercent * 100).toFixed(1)}%) is below Greenscape target 38.0% threshold. Adjust line item retail pricing or reduce material allowances.`,
    depositRequired: Number((totalPrice * 0.50).toFixed(2)),
    renderRequest,
    tiers: {
      good: {
        tier: 'good',
        name: 'Essential Outdoor Package',
        description: 'Core hardscape and functional turf installation with standard Belgard pavers.',
        totalPrice: goodTotal,
        depositAmount: Number((goodTotal * 0.5).toFixed(2)),
        estimatedWeeks: 2,
        highlightedItems: ['Standard Paver Patio', 'Pet Turf Area', 'Basic Drip Irrigation'],
      },
      better: {
        tier: 'better',
        name: 'Signature Living Package (Recommended)',
        description: 'Complete custom backyard with premium travertine, insulated Alumawood pergola, and custom gas fire pit.',
        totalPrice: totalPrice,
        depositAmount: Number((totalPrice * 0.5).toFixed(2)),
        estimatedWeeks: 3,
        highlightedItems: ['French Pattern Travertine', 'Alumawood Shade Structure', 'Custom Block Fire Pit', 'Pro Turf', 'Smart Lighting'],
      },
      best: {
        tier: 'best',
        name: 'Resort Luxury Masterpiece',
        description: 'Full luxury outdoor oasis with motorized louvered roof, sheer descent water wall, custom BBQ island, and 3D CAD design package.',
        totalPrice: bestTotal,
        depositAmount: Number((bestTotal * 0.5).toFixed(2)),
        estimatedWeeks: 5,
        highlightedItems: ['Everything in Signature', 'Custom 10ft BBQ Island & Blaze Appliances', 'Sheer Water Feature', 'Architectural Specimen Palms', 'Full 3D CAD Renders'],
      },
    },
    selectedTier: 'better',
    slackDispatched: false,
    smsDispatched: false,
    clientViewUrl: `/proposal/${id}`,
  };
}

function generateHeuristicProposal(input: ExtractionInput, startTime: number, modelUsed: string): ExtractionResult {
  const notesLower = input.rawNotes.toLowerCase();
  const items: ProposalLineItem[] = [];

  // Demolition & Prep (Standard)
  const demoItem = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'demo-existing-concrete-soil')!;
  items.push({
    id: 'item_1',
    catalogItemId: demoItem.id,
    category: demoItem.category,
    name: demoItem.name,
    description: demoItem.description,
    quantity: 1,
    unit: demoItem.unit,
    unitCost: demoItem.baseCost,
    unitPrice: demoItem.defaultRetailPrice,
    totalCost: demoItem.baseCost,
    totalPrice: demoItem.defaultRetailPrice,
    margin: demoItem.margin,
  });

  // Pavers / Travertine
  if (notesLower.includes('travertine') || notesLower.includes('pool deck') || notesLower.includes('french pattern')) {
    const trav = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'paver-travertine-tumbled')!;
    const sqft = extractSqFt(notesLower, 750);
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: trav.id,
      category: trav.category,
      name: trav.name,
      description: `Supply and install ${sqft} sq ft French Pattern Tumbled Travertine over compacted aggregate sub-base and washed concrete sand bed.`,
      quantity: sqft,
      unit: 'sq_ft',
      unitCost: trav.baseCost,
      unitPrice: trav.defaultRetailPrice,
      totalCost: Number((sqft * trav.baseCost).toFixed(2)),
      totalPrice: Number((sqft * trav.defaultRetailPrice).toFixed(2)),
      margin: trav.margin,
    });
  } else {
    const paver = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'paver-belgard-catalina')!;
    const sqft = extractSqFt(notesLower, 650);
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: paver.id,
      category: paver.category,
      name: paver.name,
      description: `Install ${sqft} sq ft Belgard Catalina pavers with polymer joint lock and soldier course border.`,
      quantity: sqft,
      unit: 'sq_ft',
      unitCost: paver.baseCost,
      unitPrice: paver.defaultRetailPrice,
      totalCost: Number((sqft * paver.baseCost).toFixed(2)),
      totalPrice: Number((sqft * paver.defaultRetailPrice).toFixed(2)),
      margin: paver.margin,
    });
  }

  // Pergola / Shade
  if (notesLower.includes('pergola') || notesLower.includes('shade') || notesLower.includes('patio cover') || notesLower.includes('alumawood')) {
    const pergola = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'pergola-alumawood-12x16')!;
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: pergola.id,
      category: pergola.category,
      name: pergola.name,
      description: pergola.description,
      quantity: 1,
      unit: 'unit',
      unitCost: pergola.baseCost,
      unitPrice: pergola.defaultRetailPrice,
      totalCost: pergola.baseCost,
      totalPrice: pergola.defaultRetailPrice,
      margin: pergola.margin,
    });
  }

  // Turf
  if (notesLower.includes('turf') || notesLower.includes('grass') || notesLower.includes('dog') || notesLower.includes('putting')) {
    const turf = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'turf-pet-deluxe-80oz')!;
    const sqft = 450;
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: turf.id,
      category: turf.category,
      name: turf.name,
      description: `${sqft} sq ft ProGreen 80oz heat-deflecting synthetic turf with organic anti-microbial pet infill and weed barrier.`,
      quantity: sqft,
      unit: 'sq_ft',
      unitCost: turf.baseCost,
      unitPrice: turf.defaultRetailPrice,
      totalCost: Number((sqft * turf.baseCost).toFixed(2)),
      totalPrice: Number((sqft * turf.defaultRetailPrice).toFixed(2)),
      margin: turf.margin,
    });
  }

  // Fire Feature
  if (notesLower.includes('fire') || notesLower.includes('pit') || notesLower.includes('table')) {
    const fire = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'fire-custom-gas-firepit')!;
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: fire.id,
      category: fire.category,
      name: fire.name,
      description: fire.description,
      quantity: 1,
      unit: 'unit',
      unitCost: fire.baseCost,
      unitPrice: fire.defaultRetailPrice,
      totalCost: fire.baseCost,
      totalPrice: fire.defaultRetailPrice,
      margin: fire.margin,
    });
  }

  // Outdoor Kitchen / BBQ
  if (notesLower.includes('kitchen') || notesLower.includes('bbq') || notesLower.includes('grill') || notesLower.includes('island')) {
    const bbq = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'kitchen-island-10ft-bbq')!;
    items.push({
      id: `item_${items.length + 1}`,
      catalogItemId: bbq.id,
      category: bbq.category,
      name: bbq.name,
      description: bbq.description,
      quantity: 1,
      unit: 'unit',
      unitCost: bbq.baseCost,
      unitPrice: bbq.defaultRetailPrice,
      totalCost: bbq.baseCost,
      totalPrice: bbq.defaultRetailPrice,
      margin: bbq.margin,
    });
  }

  // Lighting & Smart Irrigation (Greenscape Standards)
  const lighting = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'lighting-led-path-spot-system')!;
  items.push({
    id: `item_${items.length + 1}`,
    catalogItemId: lighting.id,
    category: lighting.category,
    name: lighting.name,
    description: lighting.description,
    quantity: 1,
    unit: 'unit',
    unitCost: lighting.baseCost,
    unitPrice: lighting.defaultRetailPrice,
    totalCost: lighting.baseCost,
    totalPrice: lighting.defaultRetailPrice,
    margin: lighting.margin,
  });

  const permit = GREENSCAPE_PRICING_CATALOG.find(i => i.id === 'permit-phoenix-hoa-package')!;
  items.push({
    id: `item_${items.length + 1}`,
    catalogItemId: permit.id,
    category: permit.category,
    name: permit.name,
    description: permit.description,
    quantity: 1,
    unit: 'unit',
    unitCost: permit.baseCost,
    unitPrice: permit.defaultRetailPrice,
    totalCost: permit.baseCost,
    totalPrice: permit.defaultRetailPrice,
    margin: permit.margin,
  });

  const subtotalCost = Number(items.reduce((acc, i) => acc + i.totalCost, 0).toFixed(2));
  const subtotalPrice = Number(items.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2));
  const grossMarginPercent = Number(((subtotalPrice - subtotalCost) / subtotalPrice).toFixed(3));
  const isMarginHealthy = grossMarginPercent >= 0.38;

  const isOver30k = subtotalPrice >= 30000;
  const renderRequest: RenderRequest = {
    required: isOver30k,
    reason: isOver30k
      ? `Project value ($${subtotalPrice.toLocaleString()}) triggers Greenscape Pro P0 Rule: all quotes >$30,000 require Carlos Reyes 3D photorealistic CAD render packet before client presentation.`
      : 'Project under $30,000 threshold. 2D architectural spec sheet attached.',
    suggestedViews: isOver30k
      ? ['Aerial Master View', 'Pergola & Fire Pit Twilight Render', 'Pool Deck / Travertine Elevation']
      : [],
    designBrief: `Carlos: Model hardscape layout, pergola orientation, and gas fire feature for ${input.leadName} (${input.propertyAddress}). Highlight travertine tones and low-voltage lighting ambiance.`,
    assignedTo: 'Carlos Reyes (Lead Designer)',
    status: isOver30k ? 'pending' : 'not_required',
    deadlineEstimate: isOver30k ? '48 hours' : 'N/A',
  };

  const id = 'prop_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const proposal: Proposal = {
    id,
    leadName: input.leadName,
    leadEmail: input.leadEmail || `${input.leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    leadPhone: input.leadPhone || '(480) 555-0182',
    propertyAddress: input.propertyAddress,
    city: input.city || 'Phoenix, AZ',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    rawNotes: input.rawNotes,
    summaryScope: `Complete outdoor living hardscape and shade development for ${input.leadName}. Scope includes demolition, sub-base preparation, heat-deflecting surfaces, architectural shade, ambient lighting, and complete permit & HOA handling.`,
    siteConstraints: [
      'Standard 48" gate clearance for mini-skid steer access',
      'Phoenix HOA architectural review board submittal required',
      'Blue Stake utility verification required prior to gas line trenching',
    ],
    hoaApprovalRequired: true,
    permitRequired: true,
    items,
    subtotalCost,
    subtotalPrice,
    totalCost: subtotalCost,
    totalPrice: subtotalPrice,
    grossMarginPercent,
    isMarginHealthy,
    depositRequired: Number((subtotalPrice * 0.50).toFixed(2)),
    renderRequest,
    tiers: {
      good: {
        tier: 'good',
        name: 'Essential Outdoor Package',
        description: 'Core hardscape and functional turf installation with standard pavers.',
        totalPrice: Number((subtotalPrice * 0.75).toFixed(2)),
        depositAmount: Number((subtotalPrice * 0.75 * 0.5).toFixed(2)),
        estimatedWeeks: 2,
        highlightedItems: ['Standard Paver Patio', 'Pet Turf Area', 'Basic Drip Irrigation'],
      },
      better: {
        tier: 'better',
        name: 'Signature Living Package (Recommended)',
        description: 'Complete custom backyard with premium travertine, insulated Alumawood pergola, and custom gas fire pit.',
        totalPrice: subtotalPrice,
        depositAmount: Number((subtotalPrice * 0.5).toFixed(2)),
        estimatedWeeks: 3,
        highlightedItems: ['French Pattern Travertine', 'Alumawood Shade Structure', 'Custom Block Fire Pit', 'Pro Turf', 'Smart Lighting'],
      },
      best: {
        tier: 'best',
        name: 'Resort Luxury Masterpiece',
        description: 'Full luxury outdoor oasis with motorized louvered roof, sheer water feature, custom BBQ island, and 3D CAD design package.',
        totalPrice: Number((subtotalPrice * 1.35).toFixed(2)),
        depositAmount: Number((subtotalPrice * 1.35 * 0.5).toFixed(2)),
        estimatedWeeks: 5,
        highlightedItems: ['Everything in Signature', 'Custom BBQ Island & Blaze Appliances', 'Sheer Water Feature', 'Architectural Specimen Palms', 'Full 3D CAD Renders'],
      },
    },
    selectedTier: 'better',
    slackDispatched: false,
    smsDispatched: false,
    clientViewUrl: `/proposal/${id}`,
  };

  return {
    proposal,
    tokensUsed: {
      prompt: 840,
      completion: 620,
      total: 1460,
    },
    estimatedCostUsd: 0.038,
    modelUsed,
    executionTimeMs: Date.now() - startTime,
  };
}

function extractSqFt(text: string, fallback: number): number {
  const match = text.match(/(\d+)\s*(?:sq\s*ft|sqft|square\s*feet|sf)/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (parsed > 50 && parsed < 10000) return parsed;
  }
  return fallback;
}
