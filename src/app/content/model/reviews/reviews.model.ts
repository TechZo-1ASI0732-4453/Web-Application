export class Reviews {
  id: string;
  content: string;
  score: number;
  get_user_id: string;
  give_user_id: string;
  give_user_name: string;
  give_user_img: string;

  constructor(
    id: string,
    content: string,
    score: number,
    get_user_id: string,
    give_user_id: string
  ) {
    this.id=id;
    this.content=content;
    this.score=score;
    this.get_user_id=get_user_id;
    this.give_user_id=give_user_id;
    this.give_user_name='';
    this.give_user_img='';
  }

  set setGiveUserImg(value: string) {
    this.give_user_img = value;
  }
  set setGiveUserName(value: string) {
    this.give_user_name = value;
  }
}
