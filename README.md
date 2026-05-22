# ai-sdlc

**Мета репозиторію** — пакет, який можна встановити **однією командою** у стандартне оточення Cursor (окремого розробника або команди) і який надає **плагін / MCP / набір skills / сабагентів** для реалізації [Self-Healing AI-Driven SDLC](self-healing-sdlc-blueprint.md): автономний PR-ревʼю, зростаюча knowledge base у репо, self-healing тестів і ескалація з контекстом — без повторного копіювання `.cursor/`, правил і промптів у кожен проєкт.

Ідея в тому, щоб **не налаштовувати все з нуля в кожному репозиторії**: один раз підключив пакет до профілю чи workspace — отримав той самий контракт поведінки агента скрізь, де це потрібно.

## Що саме покриває blueprint (коротко)

- **PR flow:** аналіз дифу, перевірка проти `specs/`, прогін e2e, при падінні — `@self-healer`, при успіху — оновлення знань через `@knowledge-grower`.
- **Self-growing KB:** після merge PR агент розширює спеки, критичні шляхи, e2e та реєстр модулів — репозиторій лишається єдиним джерелом правди (код + спеки + тести + рішення).

Детальна архітектура, ролі сабагентів, структура репо та фази впровадження — у [self-healing-sdlc-blueprint.md](self-healing-sdlc-blueprint.md).

## Референс: як це має «відчуватись» при встановленні

За духом схоже на [**PostHog Wizard**](https://posthog.com/wizard): запускаєш CLI (`npx @posthog/wizard`), інструмент аналізує контекст і підключає потрібні шматки інтеграції. Тут ціль та сама — **одна команда / один крок установки**, після якого оточення Cursor отримує готові skills, агентів і (де потрібно) MCP, узгоджені з цим SDLC, а не ручна збірка в кожному проєкті.

## Статус

Репозиторій у розробці: формується сам пакет установки та артефакти, які він розкладає в Cursor/MCP-оточення.

## CLI

Початковий npm package надає команду `ai-sdlc`, яка встановлює Cursor-ready
AI SDLC templates у поточний репозиторій:

```bash
npm install
node bin/ai-sdlc.js --help
node bin/ai-sdlc.js version
node bin/ai-sdlc.js init
node bin/ai-sdlc.js doctor
```

За замовчуванням `init` копіює `templates/cursor` у поточну директорію і не
перезаписує існуючі файли:

```bash
node bin/ai-sdlc.js init
node bin/ai-sdlc.js init --target cursor
```

`AGENTS.md` обробляється окремо. Якщо файлу немає, `init` створює його з
керованим блоком `ai-sdlc`. Якщо файл вже існує, команда зберігає наявний
контент і додає або оновлює тільки цей блок:

```md
<!-- ai-sdlc:start -->
...
<!-- ai-sdlc:end -->
```

Щоб перезаписати існуючі файли:

```bash
node bin/ai-sdlc.js init --force
```

Навіть з `--force`, `AGENTS.md` не замінюється повністю: оновлюється тільки
керований `ai-sdlc` блок.

Поки підтримується тільки Cursor target. Інші targets завершаться чистою
помилкою:

```bash
node bin/ai-sdlc.js init --target claude-code
```

Щоб перевірити, чи `ai-sdlc` коректно встановлений у репозиторії:

```bash
node bin/ai-sdlc.js doctor
```

`doctor` перевіряє `AGENTS.md`, Cursor agents, skills, rules і `specs/`
scaffold. Якщо щось відсутнє, команда завершується з кодом `1` і пропонує
запустити `ai-sdlc init`.

Щоб безпечно видалити встановлені Cursor agents, skills і rules:

```bash
node bin/ai-sdlc.js uninstall
```

`uninstall` видаляє тільки керований блок `ai-sdlc` з `AGENTS.md` і не чіпає
інший контент цього файлу. `specs/` за замовчуванням не видаляється, бо там
може бути згенерована knowledge base.

Щоб додатково прибрати початкові placeholder-файли `specs/_index.md` і
`specs/_coverage.md`, якщо вони ще не були змінені:

```bash
node bin/ai-sdlc.js uninstall --include-specs
```
