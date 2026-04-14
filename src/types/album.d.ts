interface Album {
  id: string;
  title: string;
  reviews?: BookReview[];
  createdAt?: Date;
  updatedAt?: Date;
}
