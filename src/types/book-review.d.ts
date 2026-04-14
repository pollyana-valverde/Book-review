interface BookReview {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: {
    title: string;
  };
  categoryId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
