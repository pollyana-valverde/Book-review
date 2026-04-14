interface Album {
  id: string;
  title: string;
  reviews?: BookReview[];
  created_at?: Date;
  updated_at?: Date;
}
