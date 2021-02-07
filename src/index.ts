import { Control, Discovery, Client } from 'magic-home';
import { connect } from 'mqtt';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, './.env') });

const { MQTT_PASSWORD } = process.env;

if (!MQTT_PASSWORD) {
  throw Error('MQTT_PASSWORD required. Provide through .env file or env vars');
}

const MQTT_USERNAME = 'jetbooster';
const MQTT_HOST = 'raspberrypi';

interface LightConfig {
  id: string,
  type: 'mono'|'color'|'colourW'|'colourWWCW',
  channel?: 'red'|'green'|'blue'|'ww'|'cw', // For mono lights controlled by a multi output controller, which channel should be 'main'
}

interface LightWithConfig extends Client {
  config: LightConfig
}

interface Lights {
  [key:string]:LightConfig
}

const lights:Lights = {
  office: {
    id: 'B4E842016B7A',
    type: 'mono',
    channel: 'green',
  },
  kitchen: {
    id: 'D8F15BDE0C2A',
    type: 'colourW',
  },
};

const getLight = (clients:Client[], name:string):LightWithConfig => {
  const light = clients.find((client) => client.id === lights[name].id);
  if (!light) {
    throw Error(`No light on found network with id ${lights[name]}`);
  }

  (light as LightWithConfig).config = lights[name];
  return light as LightWithConfig;
};

const main = async () => {
  const clients = await Discovery.scan();
  const mqttClient = connect(`mqtt://${MQTT_USERNAME}:${MQTT_PASSWORD}@${MQTT_HOST}`);
  mqttClient.on('connect', () => {
    console.log('connected to MQTT');
    Object.keys(lights).forEach((light) => {
      mqttClient.subscribe(`lightControl/${light}`, (err) => {
        if (err) {
          throw err;
        }
        console.log(`subscribed to lightControl/${light}`);
      });
    });
  });

  mqttClient.on('error', (err) => {
    console.error(err);
  });

  mqttClient.on('message', async (topic, message) => {
    const msg = message.toString();
    console.log({ msg, topic });
    const lightName = topic.split('/')[1];
    const lightConfig = getLight(clients, lightName);
    const light = new Control(lightConfig.address, { command_timeout: null });
    if (lightConfig.config) {
      if (lightConfig.config.type === 'mono') {
        const col = lightConfig.config.channel;
        const val = Number(msg);
        console.log({ val });
        if (Number.isNaN(val) || !(typeof val === 'number')) {
          throw Error('Invalid MQTT message for mono light. 1 element required');
        }
        switch (col) {
          case 'red': {
            await light.setColor(val, 0, 0);
            break;
          }
          case 'green': {
            await light.setColor(0, val, 0);
            break;
          }
          case 'blue': {
            await light.setColor(0, 0, val);
            break;
          }
          case 'ww': {
            await light.setWhites(val, 0);
            break;
          }
          case 'cw': {
            await light.setWhites(0, val);
            break;
          }
          default: {
            throw Error(`Unexpected channel type for mono-mode light: ${lightConfig.config.channel}`);
          }
        }
      } else if (lightConfig.config.type === 'colourW') {
        const elems = msg.split(',').map(Number).filter((num) => !((Number.isNaN(num)) || typeof num !== 'number'));
        if (elems.length !== 4) {
          throw Error('Invalid MQTT message for cool white light. 4 elements required');
        }
        console.log({ elems });
        await light.setColorAndWarmWhite(
          elems[0], elems[1], elems[2], elems[3],
        );
      } else if (lightConfig.config.type === 'colourWWCW') {
        // split on , then filter any values which don't parse as numbers
        const elems = msg.split(',').map(Number).filter((num) => !((Number.isNaN(num)) || typeof num !== 'number'));
        console.log({ elems });
        if (elems.length !== 5) {
          throw Error('Invalid MQTT message for cool white light. 5 elements required');
        }
        await light.setColorAndWhites(
          elems[0], elems[1], elems[2], elems[3], elems[4],
        );
      }
    }
  });
};
try {
  main();
} catch (e) {
  console.log(e);
}
