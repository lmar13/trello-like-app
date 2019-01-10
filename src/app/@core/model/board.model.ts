import { Card } from "./card.model";

export interface Board {
	_id: string;
	title: string;
  cards: Card[];
  owner: string;
  startDate: Date;
  endDate: Date;
  assignedUsers: string[];
}
