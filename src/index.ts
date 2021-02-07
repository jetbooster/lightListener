import { Control, Discovery, Client } from 'magic-home';

const OFFICE_ID = 'B4E842016B7A';

const wait = async (millis:number) => new Promise((res) => setTimeout(res, millis));

interface Lights {
  [key:string]:string
}

const lights:Lights = {
  office: 'B4E842016B7A',
};

const getLight = (clients:Client[], name:string):Client => {
  const light = clients.find((client) => client.id === lights[name]);
  if (!light) {
    throw Error(`No light on found network with id ${lights[name]}`);
  }
  return light;
};

const main = async () => {
  const clients = await Discovery.scan();

  const officeLight = getLight(clients, 'office');
  const light = new Control(officeLight.address, { command_timeout: null });
  let result = await light.setColor(0, 0, 0);
  console.log(result);
  await wait(5000);
  result = await light.setColor(255, 255, 255);
  console.log(result);
};
try {
  main();
} catch (e) {
  console.log(e);
}
