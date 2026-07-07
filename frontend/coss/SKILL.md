---
name: coss
description: Helps implement coss UI components correctly. Use when building UIs with coss primitives (buttons, dialogs, selects, forms, menus, tabs, inputs, toasts, etc.), migrating from shadcn/Radix to coss/Base UI, composing trigger-based overlays, or troubleshooting coss component behavior. Covers imports, accessibility, Tailwind styling, and common pitfalls.
compatibility: Requires Tailwind CSS v4 and @base-ui/react. Designed for React projects using the coss component registry.
license: MIT
metadata:
  author: cosscom
---

# coss ui

## OpenCode Greenfield Bootstrap Metadata

This OpenCode-only metadata installs the official coss agent skills and coss UI registry artifacts during Greenfield bootstrap. The rest of this file remains the official coss skill guidance and references.

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 30,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "node -e \"const fs=require('fs'),cp=require('child_process');const roots=['.agents/skills','.opencode/skills'];if(roots.some(d=>fs.existsSync(d+'/coss/SKILL.md')&&fs.existsSync(d+'/coss-particles/SKILL.md'))){console.warn('official coss skills already installed; skipping skills add');process.exit(0)}const src=['cosscom','coss'].join(String.fromCharCode(47));const r=cp.spawnSync('pnpm',['dlx','skills','add',src,'--yes'],{stdio:'inherit',env:{...process.env,CI:'1'},timeout:Number(process.env.COSS_SKILLS_TIMEOUT_MS||900000),shell:process.platform==='win32'});if(r.error){console.error(r.error&&r.error.message?r.error.message:r.error);process.exit(1)}process.exit(typeof r.status==='number'?r.status:1)\"",
    "node -e \"const fs=require('fs'),p=require('path'),at=String.fromCharCode(64),dlr=String.fromCharCode(36),nl=String.fromCharCode(10),bs=String.fromCharCode(92),q=String.fromCharCode(39);const ex=f=>fs.existsSync(f);const rd=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return null}};const wr=(f,j)=>fs.writeFileSync(f,JSON.stringify(j,null,2)+nl);const sl=s=>{let v=String(s||'').split(bs).join('/');while(v.endsWith('/'))v=v.slice(0,-1);return v};const a2p=a=>{a=sl(a);return a.startsWith(at+'/')?'src/'+a.slice(2):a};const p2a=d=>{d=sl(d);return d.startsWith('src/')?at+'/'+d.slice(4):d};const noTs=s=>s.endsWith('.ts')?s.slice(0,-3):s;const shared=ex('src/shared')||ex('src/shared/components')||ex('src/shared/hooks');const ui=shared?'src/shared/components/ui':'src/components/ui';const utils=shared?'src/shared/utils/cn':'src/lib/utils';const hooks=shared?'src/shared/hooks':'src/hooks';for(const d of [ui,p.dirname(noTs(utils)+'.ts'),hooks])fs.mkdirSync(d,{recursive:true});if(!ex(noTs(utils)+'.ts'))fs.writeFileSync(noTs(utils)+'.ts','import { clsx, type ClassValue } from '+q+'clsx'+q+';'+nl+'import { twMerge } from '+q+'tailwind-merge'+q+';'+nl+nl+'export function cn(...inputs: ClassValue[]) {'+nl+'  return twMerge(clsx(inputs));'+nl+'}'+nl);const j=rd('components.json')||{style:'new-york',rsc:false,tsx:true,tailwind:{css:ex('src/app/global.css')?'src/app/global.css':'src/index.css',baseColor:'neutral',cssVariables:true},iconLibrary:'lucide',aliases:{}};j[dlr+'schema']=j[dlr+'schema']||'https://ui.shadcn.com/schema.json';j.aliases={...(j.aliases||{}),components:p2a(p.dirname(ui)),ui:p2a(ui),utils:p2a(noTs(utils)),hooks:p2a(hooks)};j.registries={...(j.registries||{}),[at+'coss']:'https://coss.com/ui/r/{name}.json'};wr('components.json',j)\"",
    "node -e \"const fs=require('fs'),cp=require('child_process'),at=String.fromCharCode(64),bs=String.fromCharCode(92);const env={...process.env,PNPM_CONFIG_IGNORE_SCRIPTS:'true',CI:'1'};const rd=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return {aliases:{}}}};const sl=s=>{let v=String(s||'').split(bs).join('/');while(v.endsWith('/'))v=v.slice(0,-1);return v};const a2p=a=>{a=sl(a);return a.startsWith(at+'/')?'src/'+a.slice(2):a};const hasDep=n=>{const p=rd('package.json');return Boolean((p.dependencies||{})[n]||(p.devDependencies||{})[n])};const clean=v=>{let s=String(v||'').trim().toLowerCase();for(const p of [at+'coss/','coss/',at+'coss:','coss:'])if(s.startsWith(p))s=s.slice(p.length);if(s.startsWith(at))s=s.slice(1);return s.split('').filter(ch=>'abcdefghijklmnopqrstuvwxyz0123456789-'.includes(ch)).join('')};const req=String(process.env.COSS_COMPONENTS||'').replaceAll(',',' ').split(' ').map(clean).filter(Boolean);const mode=String(process.env.COSS_BOOTSTRAP_MODE||'fast').toLowerCase();const specs=mode==='full-style'||mode==='style'||mode==='full'?[at+'coss/style']:req.length?[...new Set(req.map(n=>at+'coss/'+n).concat(at+'coss/colors-neutral'))]:[at+'coss/ui',at+'coss/colors-neutral'];const ok=()=>{const cfg=rd('components.json'),ui=a2p((cfg.aliases||{}).ui||'src/components/ui'),utils=a2p((cfg.aliases||{}).utils||'src/lib/utils');if(!fs.existsSync(ui))return false;const files=fs.readdirSync(ui).filter(n=>(n.endsWith('.ts')||n.endsWith('.tsx'))&&n!=='index.ts');const min=req.length?1:10;const reg=(cfg.registries||{})[at+'coss']||JSON.stringify(cfg).includes('coss.com/ui/r/{name}.json');return files.length>=min&&Boolean(reg)&&hasDep('clsx')&&hasDep('tailwind-merge')&&(fs.existsSync(utils)||fs.existsSync(utils+'.ts'))};if(ok()){console.warn('coss ui artifacts already present; skipping shadcn add');process.exit(0)}const timeout=Number(process.env.COSS_SHADCN_TIMEOUT_MS||600000),idle=Number(process.env.COSS_SHADCN_IDLE_MS||10000),stable=Number(process.env.COSS_SHADCN_STABLE_MS||15000),poll=Number(process.env.COSS_SHADCN_POLL_MS||2000);const child=cp.spawn('pnpm',['dlx','shadcn@latest','add',...specs,'--yes','--overwrite'],{stdio:['ignore','pipe','pipe'],env,shell:process.platform==='win32'});let last=Date.now(),firstOk=0,done=false,early=false,force=null;const pipe=(s,o)=>s&&s.on('data',b=>{last=Date.now();o.write(b)});pipe(child.stdout,process.stdout);pipe(child.stderr,process.stderr);const kill=msg=>{if(done||early)return;early=true;console.warn(msg);child.kill('SIGTERM');force=setTimeout(()=>{if(!done)child.kill('SIGKILL')},5000);force.unref&&force.unref()};const ticker=setInterval(()=>{const good=ok(),now=Date.now();if(good&&!firstOk)firstOk=now;if(!good)firstOk=0;if(good&&(now-last>=idle||now-firstOk>=stable))kill('coss ui artifacts are stable; continuing bootstrap')},poll);ticker.unref&&ticker.unref();const timer=setTimeout(()=>{if(ok())kill('coss shadcn timed out after generating artifacts; continuing bootstrap');else{console.error('coss shadcn timeout after '+timeout+'ms');child.kill('SIGTERM')}},timeout);timer.unref&&timer.unref();child.on('close',code=>{if(done)return;done=true;clearInterval(ticker);clearTimeout(timer);if(force)clearTimeout(force);if(early||code===0||ok())process.exit(0);process.exit(code||1)});child.on('error',e=>{console.error(e&&e.message?e.message:e);process.exit(1)})\"",
    "node -e \"const fs=require('fs'),p=require('path'),at=String.fromCharCode(64),nl=String.fromCharCode(10),bs=String.fromCharCode(92);const rd=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return {aliases:{}}}};const sl=s=>String(s||'').split(bs).join('/');const a2p=a=>{a=sl(a);return a.startsWith(at+'/')?'src/'+a.slice(2):a};const ui=a2p((rd('components.json').aliases||{}).ui||'src/components/ui');if(fs.existsSync(ui)){const out=fs.readdirSync(ui).filter(n=>(n.endsWith('.ts')||n.endsWith('.tsx'))&&n!=='index.ts').sort().map(n=>{const b=n.endsWith('.tsx')?n.slice(0,-4):n.slice(0,-3);return 'export * from \\\"./'+b+'\\\";'}).join(nl);fs.writeFileSync(p.join(ui,'index.ts'),out+nl)}\""
  ],
  "verificationCommands": []
}
```

coss ui is a component library built on Base UI with a shadcn-like developer experience plus a large particle catalog.

## What this skill is for

Use this skill to:

- pick the right coss primitive(s) for a UI task
- write correct coss usage code (imports, composition, props)
- avoid common migration mistakes from shadcn/Radix assumptions
- reference particle examples to produce practical, production-like patterns

## Source of truth

- coss components docs: `apps/ui/content/docs/components/*.mdx`
  - `https://github.com/cosscom/coss/tree/main/apps/ui/content/docs/components`
- coss particle examples: `apps/ui/registry/default/particles/p-*.tsx`
  - `https://github.com/cosscom/coss/tree/main/apps/ui/registry/default/particles`
- coss particles catalog: `https://coss.com/ui/particles`
- docs map for agents: `https://coss.com/ui/llms.txt`

## Out of scope

- Maintaining coss monorepo internals/build pipelines.
- Editing registry internals unless explicitly requested.

## Principles for agent output

1. Use existing primitives and particles first before inventing custom markup.
2. Prefer composition over custom behavior reimplementation.
3. Follow coss naming and APIs from docs exactly.
4. Keep examples accessible and production-realistic.
5. Prefer concise code that mirrors coss docs/particles conventions.
6. Assume Tailwind CSS v4 conventions in coss examples and setup guidance.

## Critical usage rules

Always apply before returning coss code:

- Do not invent coss APIs. Verify against component docs first.
- For trigger-based primitives (Dialog, Menu, Select, Popover, Tooltip), follow each primitive's documented trigger/content hierarchy and composition API; do not mix patterns across components.
- Preserve accessibility labels and error semantics.
- Consult primitive-specific guides for component invariants and edge cases.
- For manual install guidance, include all required dependencies and local component files referenced by imports.
- Prefer styled coss exports first; use `*Primitive` exports only when custom composition/styling requires it.

Rule references (read on demand when the task touches these areas):

- `./references/rules/styling.md` - Tailwind tokens, icon conventions, data-slot selectors
- `./references/rules/forms.md` - Field composition, validation, input patterns
- `./references/rules/composition.md` - Trigger/popup hierarchies, grouped controls
- `./references/rules/migration.md` - shadcn/Radix to coss/Base UI migration patterns
- `./references/portal-props.md` - optional `portalProps` on composed popups and toast providers (`keepMounted`, `container`, which surfaces support it)

## Component discovery

All 54 primitives have dedicated reference guides at `./references/primitives/<name>.md`. To find the right one for a task, consult the component registry index:

- `./references/component-registry.md`

## Usage workflow

1. Identify user intent (single primitive, composed flow, form flow, overlay flow, feedback flow).
2. Consult `references/component-registry.md` to identify candidate primitives.
3. Select primitives from coss docs first; avoid custom fallback unless needed.
4. Check at least one particle example for practical composition patterns. Particle files live at `apps/ui/registry/default/particles/p-<name>-N.tsx`.
5. Write minimal code using documented imports/props.
6. Self-check accessibility and composition invariants.

## Installation reference

See `./references/cli.md` for full install/discovery workflow.

Quick CLI pattern:

```bash
npx shadcn@latest add @coss/<component>
```

Quick manual pattern:

- install dependencies listed in the component docs page
- copy required component file(s)
- update imports to match the target app alias setup

## Primitive Guidance

Every primitive has a reference guide at `./references/primitives/<name>.md` with imports, minimal patterns, inline code examples, pitfalls, and particle references. Use the component registry to find the right file.

High-risk primitives (read these guides first -- they have the most composition gotchas):

- `./references/primitives/dialog.md` - modal overlays, form-in-dialog, responsive dialog/drawer
- `./references/primitives/menu.md` - dropdown actions, checkbox/radio items, submenus
- `./references/primitives/context-menu.md` - right-click/long-press menus at the pointer
- `./references/primitives/select.md` - items-first pattern, multiple, object values, groups
- `./references/primitives/form.md` - Field composition, validation, submission
- `./references/primitives/input-group.md` - addons, DOM order invariant, textarea layouts
- `./references/primitives/toast.md` - toastManager (not Sonner), anchored toasts, providers

## Output Checklist

Before returning code:

- imports and props match coss docs
- composition structure is valid for selected primitive(s)
- accessibility and explicit control types (`button`, `input`, etc.) are present
- migration-sensitive flows are verified (type/lint, keyboard/a11y behavior, and SSR-sensitive primitives like Select/Command)
