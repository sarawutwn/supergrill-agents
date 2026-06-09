# grill-agents

## ภาษาไทย

`grill-agents` เป็นชุด OpenCode agent และ skills สำหรับ workflow แบบ Superpowers-first planning โดย installer จะติดตั้งไฟล์ต่อไปนี้เข้าไปที่ OpenCode config ของเครื่องผู้ใช้:

```text
<opencode-config>/
  agents/
    superGrill.md
  skills/
    create-plan/
      SKILL.md
    grill-design/
      SKILL.md
```

### Requirements

- ติดตั้ง [OpenCode](https://opencode.ai/) แล้ว
- macOS/Linux/Git Bash ต้องมี `curl` หรือ `wget`
- Windows แนะนำให้ใช้ PowerShell
- เพื่อให้ใช้งานได้อย่างเต็มประสิทธิภาพ ควรติดตั้ง skill Superpowers ด้วย: [obra/superpowers](https://github.com/obra/superpowers)

### ติดตั้งบน macOS/Linux/Git Bash

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | sh
```

### ติดตั้งบน Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

### ตำแหน่งที่ติดตั้ง

- macOS/Linux/Git Bash: `~/.config/opencode`
- Windows PowerShell: `%APPDATA%\opencode`

OpenCode จะโหลด global agents จาก `agents/` และ global skills จาก `skills/<name>/SKILL.md` ภายใต้ config directory นี้

### อัปเดต

รันคำสั่งติดตั้งเดิมซ้ำได้เลย installer จะดาวน์โหลดไฟล์จาก git ref ปัจจุบันและเขียนทับไฟล์เดิมทันที ไม่มีการสร้าง backup

### การตั้งค่าเพิ่มเติม

เปลี่ยนตำแหน่งติดตั้ง OpenCode config:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | OPENCODE_CONFIG_DIR="$HOME/.config/opencode" sh
```

ติดตั้งจาก branch, tag, หรือ commit ที่ต้องการ:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | GRILL_AGENTS_REF="main" sh
```

สำหรับ PowerShell:

```powershell
$env:OPENCODE_CONFIG_DIR="$env:APPDATA\opencode"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

```powershell
$env:GRILL_AGENTS_REF="main"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

## English

`grill-agents` is an OpenCode agent and skills pack for a Superpowers-first planning workflow. The installer copies these files into the user's OpenCode config directory:

```text
<opencode-config>/
  agents/
    superGrill.md
  skills/
    create-plan/
      SKILL.md
    grill-design/
      SKILL.md
```

### Requirements

- [OpenCode](https://opencode.ai/) installed
- macOS/Linux/Git Bash requires `curl` or `wget`
- Windows users should use PowerShell
- For the full workflow, install the Superpowers skill as well: [obra/superpowers](https://github.com/obra/superpowers)

### Install on macOS/Linux/Git Bash

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | sh
```

### Install on Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

### Install location

- macOS/Linux/Git Bash: `~/.config/opencode`
- Windows PowerShell: `%APPDATA%\opencode`

OpenCode loads global agents from `agents/` and global skills from `skills/<name>/SKILL.md` inside this config directory.

### Updating

Run the same install command again. The installer downloads files from the selected git ref and overwrites existing files immediately. It does not create backups.

### Configuration

Override the OpenCode config install path:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | OPENCODE_CONFIG_DIR="$HOME/.config/opencode" sh
```

Install from a specific branch, tag, or commit:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | GRILL_AGENTS_REF="main" sh
```

For PowerShell:

```powershell
$env:OPENCODE_CONFIG_DIR="$env:APPDATA\opencode"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

```powershell
$env:GRILL_AGENTS_REF="main"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```
