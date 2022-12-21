import { Random } from "@mongez/reinforcements";

export default function randomInteger(min: number, max: number) {
  return () => Random.integer(min, max);
}
