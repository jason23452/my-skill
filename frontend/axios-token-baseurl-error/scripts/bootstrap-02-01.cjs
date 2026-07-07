#!/usr/bin/env node

const fs=require('fs'),p=require('path');const w=(f,s)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,s)};w('src/features/home/api/health.ts','import { apiClient } from \"@/shared/api/client\";\nimport { normalizeApiError } from \"@/shared/api/errors\";\n\nexport type BackendHealth = { status: string; service?: string }\n\nexport async function fetchBackendHealth() {\n  try {\n    const response = await apiClient.get<BackendHealth>(\"/health\")\n    return response.data\n  } catch (error) {\n    throw normalizeApiError(error)\n  }\n}\n');
