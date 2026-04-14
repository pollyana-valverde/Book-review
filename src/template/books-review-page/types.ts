interface ReviewDTO {
  id: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  categoryId: string;
  categoryTitle: string;
  updatedAt: string;
}

export type { ReviewDTO };
