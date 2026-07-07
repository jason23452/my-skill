#!/usr/bin/env node

const fs=require('fs');const hasPkg=fs.existsSync('package.json');const hasPy=fs.existsSync('pyproject.toml')||fs.existsSync('requirements.txt');const service=hasPkg?'frontend':hasPy?'backend':'app';const port=hasPkg?'5173':hasPy?'8000':'8080';const lines=['services:','  '+service+':','    build:','      context: .','      dockerfile: Dockerfile','    ports:','      - '+port+':'+port,'    environment:','      - NODE_ENV=development'];fs.writeFileSync('compose.yaml',lines.join('\n')+'\n');
