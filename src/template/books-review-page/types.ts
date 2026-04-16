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

type BooksReviewSearchParams = {
  title?: string | string[];
  category?: string | string[];
};

export type { BooksReviewSearchParams, ReviewDTO };
