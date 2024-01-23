#telegram-bot-economic
#17.01  code refactor begin


Can test @ecomomic_rubot on telegram after deploy or run it yourself 

Telegram_bot_name: Breaf Economic RU

Telegram_link: https://t.me/economic_rubot


used:
- NodeJS, telegraf, jsdom, axios
- parse html (cbr.ru) to get statistic (need impl. universal parser);

api:
- /DEPRICATED new limit 100/mo, need impl apikey-toggle/ currencylayer.com to get currency rates (~~1000/mo~~)
- https://www.cbr-xml-daily.ru/ to get currency rates from CBRF (10k/day)

need code refactor