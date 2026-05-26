export interface ParsedLead {
  name: string;
  phone: string;
  email: string | null;
  source: 'Meta' | 'Google' | '99acres' | 'Direct';
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Negotiation' | 'Converted' | 'Lost';
  project_interest: string | null;
  flat_type_interest: string | null;
  notes: string | null;
}

export interface SkippedRow {
  rowNumber: number;
  data: Record<string, string>;
  reason: string;
}

export interface ParseResult {
  valid: ParsedLead[];
  invalid: SkippedRow[];
}

/**
 * Parses raw CSV text into a 2D array of strings.
 * Correctly handles quoted fields containing commas, double double-quotes, and newlines.
 */
export function parseCSVText(csvText: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip the second quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(current);
      if (row.length > 1 || row[0] !== '') {
        result.push(row);
      }
      row = [];
      current = '';
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in \r\n
      }
    } else {
      current += char;
    }
  }

  if (current !== '' || row.length > 0) {
    row.push(current);
    result.push(row);
  }

  return result;
}

/**
 * Normalizes string keys by stripping spaces, special chars, and lowercasing
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Validates and maps a single row into the ParsedLead format
 */
function mapAndValidateRow(
  data: Record<string, string>,
  rowNumber: number
): { lead?: ParsedLead; error?: string } {
  // 1. Extract values based on normalized header aliases
  const rawName = data['name'] || data['fullname'] || data['leadname'] || data['customername'] || data['customer'] || '';
  const rawPhone = data['phone'] || data['phonenumber'] || data['mobile'] || data['mobilenumber'] || data['contact'] || data['contactnumber'] || '';
  const rawEmail = data['email'] || data['emailaddress'] || '';
  const rawSource = data['source'] || data['leadsource'] || '';
  const rawStatus = data['status'] || data['leadstatus'] || '';
  const rawProject = data['projectinterest'] || data['project'] || data['preferredproject'] || data['tower'] || '';
  const rawFlatType = data['flattypeinterest'] || data['flattype'] || data['flat'] || data['bhk'] || data['unitinterest'] || '';
  const rawNotes = data['notes'] || data['comments'] || data['remarks'] || data['description'] || '';

  const name = rawName.trim();
  const phone = rawPhone.trim();

  // Validate required fields
  if (!name) {
    return { error: 'Name is required' };
  }
  if (!phone) {
    return { error: 'Phone number is required' };
  }

  // 2. Validate and map Source
  let source: ParsedLead['source'] = 'Direct';
  const cleanSource = rawSource.trim().toLowerCase();
  if (cleanSource.includes('meta') || cleanSource.includes('facebook') || cleanSource.includes('instagram')) {
    source = 'Meta';
  } else if (cleanSource.includes('google') || cleanSource.includes('adwords') || cleanSource.includes('ads')) {
    source = 'Google';
  } else if (cleanSource.includes('99acres')) {
    source = '99acres';
  } else {
    source = 'Direct'; // Safe fallback due to DB constraint CHECK (source IN ('Meta', 'Google', '99acres', 'Direct'))
  }

  // 3. Validate and map Status
  let status: ParsedLead['status'] = 'New';
  const cleanStatus = rawStatus.trim().toLowerCase();
  if (cleanStatus === 'new') {
    status = 'New';
  } else if (cleanStatus === 'contacted') {
    status = 'Contacted';
  } else if (cleanStatus.includes('visit')) {
    status = 'Site Visit Scheduled';
  } else if (cleanStatus.includes('negotiat')) {
    status = 'Negotiation';
  } else if (cleanStatus.includes('convert') || cleanStatus.includes('won') || cleanStatus.includes('sold') || cleanStatus.includes('close')) {
    status = 'Converted';
  } else if (cleanStatus.includes('lost') || cleanStatus === 'failed') {
    status = 'Lost';
  } else {
    status = 'New'; // Safe fallback due to DB check constraint
  }

  return {
    lead: {
      name,
      phone,
      email: rawEmail.trim() || null,
      source,
      status,
      project_interest: rawProject.trim() || null,
      flat_type_interest: rawFlatType.trim() || null,
      notes: rawNotes.trim() || null,
    },
  };
}

/**
 * Main parser entry point
 */
export function parseLeadsCSV(csvText: string): ParseResult {
  const rows = parseCSVText(csvText);
  if (rows.length === 0) {
    return { valid: [], invalid: [] };
  }

  // Identify headers
  const rawHeaders = rows[0].map(h => h.trim());
  const normalizedHeaders = rawHeaders.map(normalizeKey);

  const valid: ParsedLead[] = [];
  const invalid: SkippedRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Skip empty lines
    if (row.length === 0 || (row.length === 1 && row[0] === '')) {
      continue;
    }

    // Assemble row key-value map
    const rowData: Record<string, string> = {};
    for (let j = 0; j < rawHeaders.length; j++) {
      const headerKey = normalizedHeaders[j] || `column${j}`;
      rowData[headerKey] = row[j] || '';
    }

    const { lead, error } = mapAndValidateRow(rowData, i + 1);
    if (error) {
      // Re-assemble human-readable raw data for logs
      const rawDataMap: Record<string, string> = {};
      for (let j = 0; j < rawHeaders.length; j++) {
        rawDataMap[rawHeaders[j] || `Column ${j + 1}`] = row[j] || '';
      }
      invalid.push({
        rowNumber: i + 1,
        data: rawDataMap,
        reason: error,
      });
    } else if (lead) {
      valid.push(lead);
    }
  }

  return { valid, invalid };
}
