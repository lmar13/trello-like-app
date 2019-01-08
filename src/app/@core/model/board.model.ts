import { Column } from "./column.model";
import { Card } from "./card.model";


export class Board {
	_id: string;
	title: string;
	columns: Column[];
  cards: Card[];
}
