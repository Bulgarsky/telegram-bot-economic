#telegram-bot-economic
#Telegram_bot_name: Breaf Economic RU
#Telegram_link: https://t.me/economic_rubot

Can test @ecomomic_rubot on telegram after deploy or run it yourself. Now running on Docker

#used:
- NodeJS, telegraf, jsdom, axios
- parse html (cbr.ru) to get statistic

#used_api:
- ~~currencylayer.com~~  **/DEPRECATED/** new limit 100/mo, need implement apikey_toggle (account must have Non-Russian Bank 
  card)
- https://www.cbr-xml-daily.ru/ to get currency rates from CBRF (10k/day)
