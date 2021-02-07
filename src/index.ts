import { Control, Discovery } from 'magic-home';

const main = async () => {
  const disc = await Discovery.scan(10000);
  console.log(disc);
};
main();
