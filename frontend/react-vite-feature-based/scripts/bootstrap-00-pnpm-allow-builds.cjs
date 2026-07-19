const fs = require("fs")

const requiredAllowBuilds = {
  "@parcel/watcher": true,
  esbuild: true,
}

function writeDefaultWorkspace(filePath) {
  fs.writeFileSync(
    filePath,
    [
      "allowBuilds:",
      '  "@parcel/watcher": true',
      "  esbuild: true",
      "",
    ].join("\n"),
  )
}

function ensurePnpmAllowBuilds() {
  const filePath = "pnpm-workspace.yaml"
  if (!fs.existsSync(filePath)) {
    writeDefaultWorkspace(filePath)
    return
  }

  const current = fs.readFileSync(filePath, "utf8")
  if (!/^\s*allowBuilds:/m.test(current)) {
    fs.writeFileSync(filePath, `${current.replace(/\s*$/u, "")}\n\n${[
      "allowBuilds:",
      '  "@parcel/watcher": true',
      "  esbuild: true",
      "",
    ].join("\n")}`)
    return
  }

  const missing = Object.entries(requiredAllowBuilds)
    .filter(([name]) => !new RegExp(`^\\s*["']?${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']?\\s*:`, "m").test(current))
    .map(([name, value]) => `  ${name.includes("@") ? JSON.stringify(name) : name}: ${value ? "true" : "false"}`)

  if (missing.length) {
    fs.writeFileSync(filePath, `${current.replace(/\s*$/u, "")}\n${missing.join("\n")}\n`)
  }
}

ensurePnpmAllowBuilds()
