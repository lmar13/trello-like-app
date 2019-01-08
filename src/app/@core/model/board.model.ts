import { Card } from "./card.model";


export class Board {
	_id: string;
	title: string;
	columns: string[];
  cards: Card[];
}
