
export interface Card {
	_id: string;
  title: string;
  content: string;
  columnId: string;
  boardId: string;
  order: number;
  owner: string;
  assignedUsers: string[];
}
