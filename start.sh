#!/bin/bash
export PORT=8002
screen -dmS portal-energy-sh bash -c 'cd /opt/portal-energy-shr && pnpm run start:prod  >> /opt/portal-energy-shr/energyshr-portal.log 2>&1'

#screen -dmS portal-energy-sh npm run start:prod
#pnpm run start:prod
