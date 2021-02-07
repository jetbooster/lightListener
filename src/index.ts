import { Control, Discovery } from 'magic-home';

const lights = {
  name: 'id',
};

const main = async () => {
  const clients = await Discovery.scan(10000);
  console.log(clients[0]);
  const light = new Control(clients[0].address);
  console.log(light);
};
main();
