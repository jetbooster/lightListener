#!/bin/bash

npx tsc

if [[ -s /etc/systemd/system/lightListener.service]]; then
  echo 'service already exists';
  exit 1;
fi

sudo bash -c 'cat <<EOF > /etc/systemd/system/lightListener.service
[Unit]
Description=Light Listener Service
After=mosquitto.service
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=pi
ExecStart=/usr/local/bin/node /home/pi/lightListener/dist/index.js

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl start lightListener
sudo systemctl enable lightListener