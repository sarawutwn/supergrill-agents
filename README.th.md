# grill-agents

[อ่านภาษาอังกฤษ](README.md)

`grill-agents` คือชุด OpenCode agent และ skills สำหรับผู้ใช้ที่ต้องการเริ่ม workflow แบบ Superpowers-first ได้ทันทีในหลายโปรเจกต์

โปรเจกต์นี้ติดตั้ง agent profile และ skills ที่เกี่ยวข้องลงใน global config ของ OpenCode หลังติดตั้งแล้ว OpenCode จะโหลด agent และ skills เหล่านี้ได้จากทุก workspace โดยไม่ต้องคัดลอกไฟล์เข้าไปในแต่ละโปรเจกต์

## โปรเจกต์นี้มีอะไรบ้าง

- `superGrill`: agent profile หลักสำหรับ workflow นี้
- `create-plan`: skill สำหรับแปลง design ที่อนุมัติแล้วให้เป็น implementation plan ที่ชัดเจน
- `grill-design`: skill สำหรับจัดรูปความคิดของโปรเจกต์ให้เป็น design ที่เป็นระบบ
- `caveman`: โหมดสื่อสารแบบกระชับ ช่วยลดจำนวน token และตัดคำฟุ่มเฟือย

installer จะวางไฟล์เหล่านี้ไว้ใน OpenCode config directory:

```text
<opencode-config>/
  agents/
    superGrill.md
  skills/
    caveman/
      SKILL.md
    create-plan/
      SKILL.md
    grill-design/
      SKILL.md
```

## Requirements

- ต้องติดตั้ง [OpenCode](https://opencode.ai/) ก่อน
- macOS, Linux, หรือ Git Bash ต้องมี `curl` หรือ `wget`
- Windows แนะนำให้รัน installer ด้วย PowerShell
- หากต้องการใช้ workflow ให้ครบถ้วน ควรติดตั้งชุด Superpowers ด้วย: [obra/superpowers](https://github.com/obra/superpowers)
- สำหรับการพัฒนาและทดสอบ repository นี้ ให้ใช้ [Bun](https://bun.sh/)

## วิธีติดตั้ง

### macOS, Linux, หรือ Git Bash

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | sh
```

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

## ตำแหน่งที่ติดตั้ง

โดยค่าเริ่มต้น installer จะเขียนไฟล์ลงใน global OpenCode config directory ของระบบปฏิบัติการ:

- macOS, Linux, หรือ Git Bash: `~/.config/opencode`
- Windows PowerShell: `%APPDATA%\opencode`

OpenCode จะโหลด global agents จาก `agents/` และ global skills จาก `skills/<name>/SKILL.md` ภายใต้ config directory นี้

## การอัปเดต

รันคำสั่งติดตั้งเดิมอีกครั้งเพื่ออัปเดตไฟล์ได้เลย installer จะดาวน์โหลดไฟล์จาก git ref ที่เลือกและเขียนทับไฟล์เดิมทันที โดยจะไม่สร้าง backup

## การตั้งค่าเพิ่มเติม

### เปลี่ยน OpenCode Config Directory

ใช้ `OPENCODE_CONFIG_DIR` เมื่อต้องการติดตั้งไปยัง OpenCode config path ที่กำหนดเอง

macOS, Linux, หรือ Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | OPENCODE_CONFIG_DIR="$HOME/.config/opencode" sh
```

Windows PowerShell:

```powershell
$env:OPENCODE_CONFIG_DIR="$env:APPDATA\opencode"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

### ติดตั้งจาก Ref ที่ต้องการ

ใช้ `GRILL_AGENTS_REF` เพื่อติดตั้งจาก branch, tag, หรือ commit ที่ต้องการ

macOS, Linux, หรือ Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | GRILL_AGENTS_REF="main" sh
```

Windows PowerShell:

```powershell
$env:GRILL_AGENTS_REF="main"; irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```
